import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';

let html=await readFile('worker/page.html','utf8');
function change(before,after){if(!html.includes(before))throw new Error('Trecho esperado ausente: '+before.slice(0,60));html=html.replaceAll(before,after)}
change('<!--MAPA-->',await readFile('worker/nordeste.svg','utf8'));
change('/*SUN_CALC_LIBRARY*/',await readFile('vendor/suncalc.js','utf8'));
change("fetch('/api/apoios',{cache:'no-store'})","fetch('./data/current.json',{cache:'no-store'})");
change("fetch('/api/historico',{cache:'no-store'})","fetch('./data/history.json',{cache:'no-store'})");
change('A coleta acontece enquanto alguém está com o painel aberto. Sem visitas, não há medições; linhas pontilhadas indicam intervalos maiores que 10 minutos. Dados com mais de 24 horas são resumidos por hora. Nenhum apoiador é identificado.','A coleta é feita periodicamente pelo GitHub, mesmo sem visitas, e pode atrasar. As linhas pontilhadas indicam intervalos maiores que 10 minutos. Os pontos mostram medições confirmadas, não o horário exato de cada apoio. Nenhum apoiador é identificado.');
change('O painel consulta a página pública da ideia no Senado a cada minuto enquanto está aberto. A leitura pode falhar ou atrasar; confira a fonte oficial. A contagem é nacional, não por estado.','O GitHub consulta periodicamente a página pública da ideia no Senado; a publicação pode atrasar ou falhar. O painel acompanha os dados publicados enquanto está aberto. A contagem é nacional, não por estado.');
change('Avisos no painel enquanto esta página estiver aberta. A consulta ocorre a cada minuto; novos apoios podem chegar juntos.','Avisos no painel enquanto esta página estiver aberta. Os dados do Senado são verificados periodicamente e podem chegar com atraso.');
change('Avisos no painel e no navegador enquanto esta página estiver aberta. A consulta ocorre aproximadamente a cada minuto.','Avisos no painel e no navegador enquanto esta página estiver aberta. Os dados oficiais são verificados periodicamente e podem atrasar.');
change(' · Consulta aproximadamente a cada minuto',' · Horário da última medição registrada');
const history=JSON.parse(await readFile('data/history.json','utf8'));
if(!Array.isArray(history.pontos)||!history.pontos.length)throw new Error('Não há medições verificadas para publicar.');
const latest=history.pontos.at(-1);
await mkdir('public/data',{recursive:true});
await writeFile('public/index.html',html,'utf8');
await copyFile('data/history.json','public/data/history.json');
await writeFile('public/data/current.json',JSON.stringify({apoios:latest.count,consultadoEm:new Date(latest.observed_at*1000).toISOString(),historicoDisponivel:true})+'\n','utf8');
await writeFile('public/.nojekyll','');
console.log('GitHub Pages gerado. Última medição:',latest.count);
