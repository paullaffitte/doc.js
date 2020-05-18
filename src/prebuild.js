#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').sync;
const handlebars = require('handlebars');
const yaml = require('yaml-js');

function loadSettings(input) {
	const fullpath = `${input.directory}/${input.name}${input.extension}`

	switch (input.extension) {
		case '.json':
			return require(fullpath);
		case '.yml':
		case '.yaml':
			return yaml.load(fs.readFileSync(fullpath));
		default:
			throw new Error(`Extension "${input.extension}" is not supported`)
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

module.exports = async (input, output) => {
	const { revisions, prebuild: prebuildPath, metadata, pdf } = loadSettings(input);
	const prebuild = prebuildPath ? require(`${input.directory}/${prebuildPath}`) : () => {};

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
		directory: input.directory
	};
	const view = {
		...baseView,
		data: await prebuild({
			...baseView,
			handlebars
		}),
	};

	const content = renderTemplate(input.directory + '/' + input.name + '.html', view);
	const header = renderTemplate(input.directory + '/header.html', view);
	const footer = renderTemplate(input.directory + '/footer.html', view);

	mkdirp(output.directory);
	fs.writeFileSync(output.filename, content);
	fs.writeFileSync(output.getPath(output.name + '.json'), JSON.stringify(view, null, '\t'));

	return {
		...pdf,
		header,
		footer,
	};
};
