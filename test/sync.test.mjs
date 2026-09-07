// Tests for the sync merge logic. Run: node test/sync.test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const page = await (await chromium.launch({ executablePath: CHROME })).newPage();
await page.goto('file://' + new URL('../index.html', import.meta.url).pathname);

const call = (fn, ...args) =>
  page.evaluate(([f, a]) => window.__coffee[f](...a), [fn, args]);

const e = (id, updated, extra = {}) =>
  ({ id, ts: '2026-09-01T08:00:00.000Z', name: 'Latte', mg: 77, deleted: false, updated, ...extra });

let passed = 0;
async function test(name, fn) {
  await fn();
  console.log('  ok  ' + name);
  passed++;
}

// --- mergeEntries ---
await test('takes rows only the server has', async () => {
  const out = await call('mergeEntries', [], [e('a', 100)]);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 'a');
});

await test('keeps rows only this device has', async () => {
  const out = await call('mergeEntries', [e('a', 100)], []);
  assert.deepEqual(out.map(r => r.id), ['a']);
});

await test('newer server row wins', async () => {
  const out = await call('mergeEntries', [e('a', 100, { mg: 63 })], [e('a', 200, { mg: 95 })]);
  assert.equal(out.length, 1);
  assert.equal(out[0].mg, 95);
});

await test('newer local row wins', async () => {
  const out = await call('mergeEntries', [e('a', 300, { mg: 63 })], [e('a', 200, { mg: 95 })]);
  assert.equal(out[0].mg, 63);
});

await test('a tie keeps the local copy', async () => {
  const out = await call('mergeEntries', [e('a', 100, { mg: 63 })], [e('a', 100, { mg: 95 })]);
  assert.equal(out[0].mg, 63);
});

await test('a remote delete beats an older local row', async () => {
  const out = await call('mergeEntries', [e('a', 100)], [e('a', 200, { deleted: true })]);
  assert.equal(out[0].deleted, true);
});

await test('a local delete is not resurrected by a stale server row', async () => {
  const out = await call('mergeEntries', [e('a', 500, { deleted: true })], [e('a', 100)]);
  assert.equal(out[0].deleted, true);
});

await test('unions both sides without duplicating', async () => {
  const out = await call('mergeEntries', [e('a', 1), e('b', 1)], [e('b', 9), e('c', 1)]);
  assert.deepEqual(out.map(r => r.id).sort(), ['a', 'b', 'c']);
});

// --- rowsToPush ---
await test('pushes rows the server lacks', async () => {
  const out = await call('rowsToPush', [e('a', 100)], []);
  assert.deepEqual(out.map(r => r.id), ['a']);
});

await test('does not push rows the server already matches', async () => {
  const out = await call('rowsToPush', [e('a', 100)], [e('a', 100)]);
  assert.deepEqual(out, []);
});

await test('does not push rows the server has newer', async () => {
  const out = await call('rowsToPush', [e('a', 100)], [e('a', 400)]);
  assert.deepEqual(out, []);
});

await test('pushes local deletes', async () => {
  const out = await call('rowsToPush', [e('a', 900, { deleted: true })], [e('a', 100)]);
  assert.equal(out.length, 1);
  assert.equal(out[0].deleted, true);
});

// --- normalise ---
await test('fills in defaults for pre-sync entries', async () => {
  const out = await call('normalise', { id: 7, ts: '2026-09-01T08:00:00.000Z', name: 'Espresso', mg: 63 });
  assert.equal(out.id, '7');
  assert.equal(out.deleted, false);
  assert.equal(out.updated, Date.parse('2026-09-01T08:00:00.000Z'));
});

console.log('\n' + passed + ' passing');
process.exit(0);
