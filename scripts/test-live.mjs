import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const page = await readFile('worker/page.html', 'utf8');
const match = page.match(/async function readCurrent\(\)\{[\s\S]*?\r?\n\}\r?\n(?=let timer,)/);
assert.ok(match, 'Função de consulta não encontrada na página.');

function reader(fetch) {
  return vm.runInNewContext(`(${match[0].trim()})`, {
    fetch,
    AbortSignal: { timeout: () => undefined },
  });
}

let calls = [];
let read = reader(async url => {
  calls.push(url);
  return { ok: true, text: async () => '<span class="contabilizacao">1.248</span> apoios confirmados' };
});
let result = await read();
assert.equal(result.apoios, 1248);
assert.equal(result.aoVivo, true);
assert.equal(calls.length, 1);

calls = [];
read = reader(async url => {
  calls.push(url);
  if (url.startsWith('https://')) throw new Error('indisponível');
  return { ok: true, json: async () => ({ apoios: 236, consultadoEm: '2026-11-26T00:00:00Z' }) };
});
result = await read();
assert.equal(result.apoios, 236);
assert.equal(result.aoVivo, false);
assert.equal(calls.length, 2);

read = reader(async () => { throw new Error('indisponível'); });
await assert.rejects(read());
console.log('Consulta ao vivo e recuperação por registro salvo verificadas.');
