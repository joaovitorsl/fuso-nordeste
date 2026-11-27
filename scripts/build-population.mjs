// Baixa do IBGE a população do Censo 2022 de cada município de RN, PB, PE, AL e SE e os
// contornos simplificados dos cinco estados. Grava data/populacao.json e data/estados.json,
// que o build embute na página. Rodar só quando quiser atualizar esses dados.
import { readFile, writeFile } from 'node:fs/promises';

const UFS = [24, 25, 26, 27, 28];
const get = async url => {
  const r = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`IBGE respondeu ${r.status} para ${url}`);
  return r.json();
};

const { cidades } = JSON.parse(await readFile('data/cidades.json', 'utf8'));
const codes = new Set(cidades.map(c => c[0]));

// Tabela 4709 do SIDRA, variável 93: população residente, Censo 2022
const pop = await get(`https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[N3[${UFS.join(',')}]]`);
const populacao = {};
for (const s of pop[0].resultados[0].series) {
  const code = Number(s.localidade.id), n = Number(s.serie['2022']);
  if (codes.has(code)) populacao[code] = n; // Fernando de Noronha fica de fora, como na lista de cidades
}
const faltando = cidades.filter(c => !(c[0] in populacao)).map(c => c[1]);
if (faltando.length) throw new Error('Sem população para: ' + faltando.join(', '));

// Contornos de qualidade mínima; só os anéis externos do continente (Noronha fica de fora)
const estados = [];
for (const uf of UFS) {
  const geo = await get(`https://servicodados.ibge.gov.br/api/v3/malhas/estados/${uf}?formato=application/vnd.geo%2Bjson&qualidade=minima`);
  for (const f of geo.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const [outer] of polys) {
      if (outer.every(([lon]) => lon > -34.5)) continue;
      estados.push(outer.map(([lon, lat]) => [Math.round(lon * 1000) / 1000, Math.round(lat * 1000) / 1000]));
    }
  }
}

const total = Object.values(populacao).reduce((a, b) => a + b, 0);
await writeFile('data/populacao.json', JSON.stringify({ fonte: 'IBGE, Censo 2022, tabela 4709 (população residente)', total, populacao }) + '\n');
await writeFile('data/estados.json', JSON.stringify({ fonte: 'IBGE, malha de estados, qualidade mínima', aneis: estados }) + '\n');
console.log(`População de ${Object.keys(populacao).length} municípios (${total.toLocaleString('pt-BR')} pessoas) e ${estados.length} contornos gravados.`);
