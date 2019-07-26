#! /usr/bin/env node

const table = require('markdown-table');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').sync;
const mustache = require('mustache');

module.exports = async filename => {
	const settingsPath = path.isAbsolute(filename) ? filename : path.resolve(filename);
	const { revisions, prebuild: prebuildPath, template: templatePath, metadata } = require(settingsPath);
	const documentFolder = path.dirname(settingsPath);
	const prebuild = prebuildPath ? require(`${documentFolder}/${prebuildPath}`) : () => {};

	const metadataArray = Object.keys(metadata).map(key => [ key, metadata[key] ]);
	const metadataTable = table([ ["", ""], ...metadataArray ]);
	const revisionsArray = revisions.map(({ date, version, authors, sections, comments }) => [ date, version, authors.join(), sections.join(), comments ]);
	const revisionsTable = table([ ["", ""], ...revisionsArray ]);

	const parsedSettingsPath = path.parse(settingsPath);

	mustache.escape = text => text;
	metadata.folder = documentFolder;
	const template = fs.readFileSync(templatePath ? ('./data/' + templatePath) : (parsedSettingsPath.dir + '/' + parsedSettingsPath.name + '.md')).toString();
	const content = mustache.render(template, {
		metadata,
		data: (await prebuild(metadata, revisions)),
		tables: {
			metadata: metadataTable,
			revisions: revisionsTable,
		}
	}).trim() + '\n';

	mkdirp('./build');
	fs.writeFileSync('./build/prebuild.md', content);
};
