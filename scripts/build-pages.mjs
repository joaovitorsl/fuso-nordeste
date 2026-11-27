import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';

let html=await readFile('worker/page.html','utf8');
function change(before,after){if(!html.includes(before))throw new Error('Trecho esperado ausente: '+before.slice(0,60));html=html.replaceAll(before,()=>after)}
change('/*SUN_CALC_LIBRARY*/',await readFile('vendor/suncalc.js','utf8'));
const cidades=JSON.parse(await readFile('data/cidades.json','utf8'));
if(!Array.isArray(cidades.cidades)||cidades.cidades.length<700)throw new Error('Lista de cidades incompleta.');
change("/*CIDADES*/{cidades:[[2611606,'Recife','PE',-8.0632,-34.8711]]}",JSON.stringify({cidades:cidades.cidades}));
const history=JSON.parse(await readFile('data/history.json','utf8'));
if(!Array.isArray(history.pontos)||!history.pontos.length)throw new Error('Não há medições verificadas para publicar.');
const latest=history.pontos.at(-1);
await mkdir('public/data',{recursive:true});
await writeFile('public/index.html',html,'utf8');
await copyFile('data/history.json','public/data/history.json');
await writeFile('public/data/current.json',JSON.stringify({apoios:latest.count,consultadoEm:new Date(latest.observed_at*1000).toISOString(),historicoDisponivel:true})+'\n','utf8');
await writeFile('public/.nojekyll','');
console.log('GitHub Pages gerado. Última medição:',latest.count);
