#! /usr/bin/env node

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
	const folder = path.dirname(settingsPath);
	const prebuild = prebuildPath ? require(`${folder}/${prebuildPath}`) : () => {};

	metadataArray = Object.keys(metadata).map(name => {
		const rawValue = metadata[name];
		const value = Array.isArray(rawValue) ? rawValue.join(', ') : rawValue;
		return { name, value };
	});
	revisionsArray = revisions.map(({ date, version, authors, sections, comments }) => ({
		date,
		version,
		authors: authors ? authors.join(', ') : '',
		sections: sections ? sections.join(', ') : '',
		comments
	}));

	const baseView = {
		metadata,
		revisions,
		folder
	};
	const view = {
		...baseView,
		data: await prebuild({
			...baseView,
			handlebars
		}),
	};

	const content = renderTemplate(parsedSettingsPath.dir + '/' + parsedSettingsPath.name + '.md', view);
	const header = renderTemplate(parsedSettingsPath.dir + '/header.md', view);
	const footer = renderTemplate(parsedSettingsPath.dir + '/footer.md', view);

	mkdirp('./build');
	fs.writeFileSync('./build/prebuild.md', content);
	fs.writeFileSync(`./build/${outputName}.json`, JSON.stringify(view, null, '\t'));

	return {
		...pdf,
		folder,
		header,
		footer,
	};
};
