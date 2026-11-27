// Gera data/cidades.json com as sedes municipais de RN, PB, PE, AL e SE a partir da base
// "Localidades do Brasil 2022" do IBGE. Uso:
//   node scripts/build-cities.mjs caminho/para/BR_localidades_2022.dbf
// O arquivo vem de Localidades_Brasil_shp.zip em
// https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/localidades/Localidades_do_Brasil/2022/
import { readFile, writeFile } from 'node:fs/promises';

const file=process.argv[2];
if(!file)throw new Error('Informe o caminho do BR_localidades_2022.dbf.');
const b=await readFile(file);
const count=b.readUInt32LE(4),headerLength=b.readUInt16LE(8),recordLength=b.readUInt16LE(10);
const fields=[];
for(let o=32;b[o]!==0x0d;o+=32)fields.push({name:b.toString('latin1',o,o+11).replace(/\0.*$/,''),length:b[o+16]});
const utf8=new TextDecoder('utf-8');
const UFS={24:'RN',25:'PB',26:'PE',27:'AL',28:'SE'};
const NORONHA='2605459'; // já usa UTC−2; fica de fora da comparação
const cities=[];
for(let i=0;i<count;i++){
  let o=headerLength+i*recordLength;
  if(b[o]===0x2a)continue; // registro apagado
  o++;
  const r={};
  for(const f of fields){r[f.name]=utf8.decode(b.subarray(o,o+f.length)).trim();o+=f.length}
  if(!UFS[r.CD_UF]||r.SCT_LOCALI!=='Sede Municipal'||r.CD_MUN===NORONHA)continue;
  const lat=Number(r.LAT_LOCALI),lon=Number(r.LONG_LOCAL);
  if(!Number.isFinite(lat)||!Number.isFinite(lon))throw new Error('Coordenada inválida: '+r.NM_MUN);
  cities.push([Number(r.CD_MUN),r.NM_MUN,UFS[r.CD_UF],lat,lon]);
}
cities.sort((a,b)=>a[1].localeCompare(b[1],'pt-BR'));
const codes=new Set(cities.map(c=>c[0]));
if(codes.size!==cities.length)throw new Error('Município repetido na base.');
const expected={RN:167,PB:223,PE:184,AL:102,SE:75};
for(const [uf,n] of Object.entries(expected)){const got=cities.filter(c=>c[2]===uf).length;if(got!==n)throw new Error(uf+': esperado '+n+' municípios, encontrado '+got)}
await writeFile('data/cidades.json',JSON.stringify({fonte:'IBGE, Localidades do Brasil 2022 (sedes municipais, SIRGAS 2000)',campos:['codigo_ibge','nome','uf','latitude','longitude'],cidades:cities})+'\n','utf8');
console.log('Cidades gravadas:',cities.length);
