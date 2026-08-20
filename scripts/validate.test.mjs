import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCatalogRows, parseGalleryCards, validateGalleryOrder } from './catalog-gallery.mjs';

const catalog = `
## Glance 系
| # | 名字 | 卡内标题 |
|---|------|---------|
| G1 | One | First card |
| G2 | Two | Second card |

## Next
`;

const gallery = `
<div class="card"><h2>First card</h2></div>
<div class="card wide"><h2>Second card · with detail</h2></div>
`;

test('catalog rows match gallery cards by ID and position', () => {
  const rows = parseCatalogRows(catalog, '## Glance 系', 'G');
  const cards = parseGalleryCards(gallery);
  assert.deepEqual(validateGalleryOrder(rows, cards, 'G', 'templates/glance-gallery.html'), []);
});

test('swapping two catalog IDs fails validation', () => {
  const swapped = catalog.replace('| G1 | One |', '| TEMP | One |')
    .replace('| G2 | Two |', '| G1 | Two |')
    .replace('| TEMP | One |', '| G2 | One |');
  const rows = parseCatalogRows(swapped, '## Glance 系', 'G');
  const failures = validateGalleryOrder(rows, parseGalleryCards(gallery), 'G', 'templates/glance-gallery.html');
  assert.ok(failures.some(message => message.includes('第 1 条应为 G1，实际为 G2')));
  assert.ok(failures.some(message => message.includes('第 2 条应为 G2，实际为 G1')));
});

test('swapping catalog rows fails the positional title check', () => {
  const rows = [
    { id: 'G1', title: 'Second card' },
    { id: 'G2', title: 'First card' },
  ];
  const failures = validateGalleryOrder(rows, parseGalleryCards(gallery), 'G', 'templates/glance-gallery.html');
  assert.equal(failures.filter(message => message.includes('标题')).length, 2);
});
