#! /usr/bin/env node

const table = require('markdown-table');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').sync;
const handlebars = require('handlebars');
const yaml = require('yaml-js');

function loadSettings(parsedPath) {
	const fullpath = `${parsedPath.dir}/${parsedPath.name}${parsedPath.ext}`

	switch (parsedPath.ext) {
		case '.json':
			return require(fullpath);
		case '.yml':
		case '.yaml':
			return yaml.load(fs.readFileSync(fullpath));
		default:
			throw new Error(`Extension "${parsedPath.ext}" is not supported`)
	}
}

function loadTemplate(filename) {
	if (!fs.existsSync(filename))
		return '';

	return fs.readFileSync(filename).toString();
}

function renderTemplate(filename, view) {
	const template = loadTemplate(filename);
	return handlebars.compile(template)(view).trim();
}

module.exports = async (filename, outputName) => {
	const settingsPath = path.isAbsolute(filename) ? filename : path.resolve(filename);
	const parsedSettingsPath = path.parse(settingsPath);
	const { revisions, prebuild: prebuildPath, metadata, pdf } = loadSettings(parsedSettingsPath);
	const documentFolder = path.dirname(settingsPath);
	const prebuild = prebuildPath ? require(`${documentFolder}/${prebuildPath}`) : () => {};

	const metadataArray = Object.keys(metadata).map(key => [ key, Array.isArray(metadata[key]) ? metadata[key].join(', ') : metadata[key] ]);
	const metadataTable = table([ ["", ""], ...metadataArray ]);
	const revisionsArray = revisions.map(({ date, version, authors, sections, comments }) => [ date, version, authors ? authors.join(', ') : '', sections ? sections.join(', ') : '', comments ]);
	const revisionsTable = table([ ["", ""], ...revisionsArray ]);

	metadata.folder = documentFolder;

	const view = {
		metadata,
		data: (await prebuild(metadata, revisions)),
		tables: {
			metadata: metadataTable,
			revisions: revisionsTable,
		}
	};

	const content = renderTemplate(parsedSettingsPath.dir + '/' + parsedSettingsPath.name + '.md', view);
	const header = renderTemplate(parsedSettingsPath.dir + '/header.md', view);
	const footer = renderTemplate(parsedSettingsPath.dir + '/footer.md', view);

	mkdirp('./build');
	fs.writeFileSync('./build/prebuild.md', content);
	view.tables = {
		metadata: metadataArray,
		revisions: revisionsArray,
	};
	fs.writeFileSync(`./build/${outputName}.json`, JSON.stringify(view, null, '\t'));

	return {
		...pdf,
		documentFolder,
		header,
		footer,
	};
};
