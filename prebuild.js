#! /usr/bin/env node

const table = require('markdown-table');
const { revisions, ...doc } = require('./PLD');

const docArray = Object.keys(doc).map(key => [ key, doc[key] ]);
const docTable = table([ ["", ""], ...docArray ]);
const revisionsArray = revisions.map(({ date, version, authors, sections, comments }) => [ date, version, authors.join(), sections.join(), comments ]);
const revisionsTable = table([ ["", ""], ...revisionsArray ]);

console.log('## Description du document');
console.log(docTable);

console.log('\n## Tableau de révisions');
console.log(revisionsTable);