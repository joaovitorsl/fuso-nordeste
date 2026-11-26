import { readFile, writeFile, mkdir } from 'node:fs/promises';

const url='https://www12.senado.leg.br/ecidadania/visualizacaoideia?id=258092';
const file='data/history.json';
let response, lastError;
for(let attempt=1;attempt<=3;attempt++){
  try{
    response=await fetch(url,{headers:{'accept':'text/html','user-agent':'FusoNordeste/1.0 (monitoramento publico de ideia legislativa)'},signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new Error('Senado indisponível: HTTP '+response.status);
    break;
  }catch(error){lastError=error;response=null;console.error('Tentativa '+attempt+' falhou:',error.message);if(attempt<3)await new Promise(resolve=>setTimeout(resolve,5000));}
}
if(!response)throw new Error('Não foi possível consultar o Senado após três tentativas.',{cause:lastError});
const html=await response.text();
const match=html.match(/<span\s+class=["']contabilizacao["'][^>]*>\s*([\d.]+)\s*<\/span>\s*apoios confirmados/i);
if(!match)throw new Error('A contagem não foi encontrada na página do Senado.');
const count=Number(match[1].replace(/\./g,''));
if(!Number.isSafeInteger(count)||count<0)throw new Error('Contagem inválida.');
let data;
try{data=JSON.parse(await readFile(file,'utf8'))}catch(error){if(error.code!=='ENOENT')throw error;data={pontos:[]}}
if(!Array.isArray(data.pontos)||data.pontos.some(p=>!Number.isSafeInteger(p.count)||!Number.isSafeInteger(p.observed_at)))throw new Error('Histórico inválido; nenhum dado foi alterado.');
const now=Math.floor(Date.now()/1000),latest=data.pontos.at(-1);
if(!latest||count!==latest.count||now-latest.observed_at>=3600){
  data.pontos.push({bucket:Math.floor(now/60),count,observed_at:now});
  await mkdir('data',{recursive:true});
  await writeFile(file,JSON.stringify(data,null,2)+'\n','utf8');
  console.log('Medição oficial registrada:',count);
}else console.log('Sem mudança desde o registro recente:',count);
