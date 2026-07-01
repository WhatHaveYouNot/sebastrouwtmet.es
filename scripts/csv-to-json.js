import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const csvPath = join(__dirname, '../src/data/wedding-data.csv');
const jsonPath = join(__dirname, '../src/data/wedding-data.json');

const csv = readFileSync(csvPath, 'utf-8');
const rows = parse(csv, { columns: true, skip_empty_lines: true, delimiter: ',' });

const types = ['weekend', 'dag', 'avond'];
const raw = {};

for (const type of types) {
  raw[type] = {};
}

for (const row of rows) {
  const { section, key } = row;
  for (const type of types) {
    if (!raw[type][section]) raw[type][section] = {};
    raw[type][section][key] = (row[type] ?? '').trim();
  }
}

function buildProgram(sectionData) {
  const days = [];
  let dayIdx = 1;
  while (true) {
    const label = sectionData[`day_${dayIdx}_label`];
    if (!label) break;

    const items = [];
    let itemIdx = 1;
    while (true) {
      const titleKey = `day_${dayIdx}_${itemIdx}_title`;
      if (!(titleKey in sectionData)) break;
      const title = sectionData[titleKey];
      if (title) {
        items.push({
          time: sectionData[`day_${dayIdx}_${itemIdx}_time`] || '',
          title,
          detail: sectionData[`day_${dayIdx}_${itemIdx}_detail`] || '',
        });
      }
      itemIdx++;
    }

    if (items.length > 0) days.push({ label, items });
    dayIdx++;
  }
  return { days };
}

function buildLetter(sectionData) {
  return { text: (sectionData.text || '').replace(/\\n/g, '\n') };
}

function buildActs(sectionData) {
  return {
    title: sectionData.title || '',
    text: sectionData.text || '',
    email: sectionData.email || '',
  };
}

function buildFaq(sectionData) {
  const items = [];
  let i = 1;
  while (true) {
    const question = sectionData[`${i}_q`];
    const answer = sectionData[`${i}_a`];
    if (!question) break;
    if (question && answer) items.push({ question, answer });
    i++;
  }
  return { items };
}

const result = {};
for (const type of types) {
  const d = raw[type];
  result[type] = {
    header: d.header || {},
    letter: buildLetter(d.letter || {}),
    location: d.location || {},
    program: buildProgram(d.program || {}),
    acts: buildActs(d.acts || {}),
    gift: d.gift || {},
    faq: buildFaq(d.faq || {}),
    mc: d.mc || {},
    rsvp: d.rsvp || {},
  };
}

writeFileSync(jsonPath, JSON.stringify(result, null, 2));
console.log('✓ wedding-data.json written');
