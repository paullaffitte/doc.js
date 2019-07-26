#! /usr/bin/env node

const table = require('markdown-table');
const fs = require('fs').promises;
const mkdirp = require('mkdirp').sync;
const { revisions, ...doc } = require('../data/doc');

const docArray = Object.keys(doc).map(key => [ key, doc[key] ]);
const docTable = table([ ["", ""], ...docArray ]);
const revisionsArray = revisions.map(({ date, version, authors, sections, comments }) => [ date, version, authors.join(), sections.join(), comments ]);
const revisionsTable = table([ ["", ""], ...revisionsArray ]);

const content = `
# ${doc.title}
###### Title {#id .class .class key=value key=value}

## Document description
${docTable}

[identifier](#identifier)
[test](#identifier-2)

## Revisions
${revisionsTable}
`.slice(1);

mkdirp('./build');
fs.writeFile('./build/title_and_information.md', content);
