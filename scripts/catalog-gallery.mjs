export function parseCatalogRows(catalogSource, header, idPrefix) {
  const section = catalogSource.split(header)[1]?.split('\n## ')[0] ?? '';
  return [...section.matchAll(new RegExp(`^\\| (${idPrefix}\\d+) \\| [^|]+ \\| ([^|]+?) \\|`, 'gm'))]
    .map(([, id, title]) => ({ id, title: title.trim() }));
}

export function parseGalleryCards(gallerySource) {
  const starts = [...gallerySource.matchAll(/<div class="card[\s"]/g)].map(match => match.index);
  return starts.map((start, index) => {
    const end = starts[index + 1] ?? gallerySource.length;
    return gallerySource.slice(start, end).match(/<h2>([^<]+)<\/h2>/)?.[1].trim() ?? null;
  });
}

export function validateGalleryOrder(rows, cardTitles, idPrefix, file) {
  const failures = [];
  if (cardTitles.length !== rows.length) {
    failures.push(`${file} 有 ${cardTitles.length} 张卡片，catalog.md 有 ${rows.length} 条`);
  }

  rows.forEach(({ id, title }, index) => {
    const expectedId = `${idPrefix}${index + 1}`;
    if (id !== expectedId) {
      failures.push(`catalog.md 第 ${index + 1} 条应为 ${expectedId}，实际为 ${id}`);
    }

    const cardTitle = cardTitles[index];
    if (!cardTitle) {
      failures.push(`${file} 第 ${index + 1} 张卡片缺少 <h2>（对应 ${id}「${title}」）`);
    } else if (!cardTitle.includes(title) && !title.includes(cardTitle)) {
      failures.push(`${file} 第 ${index + 1} 张卡片标题「${cardTitle}」与 ${id}「${title}」不一致`);
    }
  });

  return failures;
}
