#! /usr/bin/env node

const table = require('markdown-table');
const fs = require('fs').promises;
const mkdirp = require('mkdirp').sync;
const { revisions, ...doc } = require('../data/PLD');

const docArray = Object.keys(doc).map(key => [ key, doc[key] ]);
const docTable = table([ ["", ""], ...docArray ]);
const revisionsArray = revisions.map(({ date, version, authors, sections, comments }) => [ date, version, authors.join(), sections.join(), comments ]);
const revisionsTable = table([ ["", ""], ...revisionsArray ]);

const content = `
# ${doc.title}
###### Teksploit {#identifier .class .class key=value key=value}

## Description du document
${docTable}

${docTable}

${docTable}

${docTable}

${docTable}

[tek](#identifier)
[pld](#pld)

## Tableau de révisions
${revisionsTable}
`.slice(1);

mkdirp('./build');
fs.writeFile('./build/title_and_information.md', content);
