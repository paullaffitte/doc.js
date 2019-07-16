#! /usr/bin/env node

const table = require('markdown-table');
const { revisions, ...doc } = require('./doc.json');

const docArray = Object.keys(doc).map(key => [ key, doc[key] ]);
const docTable = table([ ["", ""], ...docArray ]);
const revisionsArray = revisions.map(({ date, version, authors, sections, comments }) => [ date, version, authors.join(), sections.join(), comments ]);
const revisionsTable = table([ ["", ""], ...revisionsArray ]);

console.log('## Document description');
console.log(docTable);

console.log('\n## Revisions');
console.log(revisionsTable);
