#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp').sync;
const handlebars = require('handlebars');
const yaml = require('yaml-js');
const glob = require("glob")

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

async function copyAssets(source, destination, assets={}) {
	const globAsync = (pattern, options) => new Promise((resolve, reject) => glob(pattern, options, (err, matches) => {
		if (err) reject(err);
		resolve(matches);
	}));
	const multiMatch = async patterns => (await Promise.all(patterns.map(pattern => globAsync(pattern, { cwd: source })))).flat();
	const unique = array => Array.from(new Set(array));
	const copyFile = fs.promises.copyFile;

	const [includes, excludes] = await Promise.all([
		multiMatch(assets.includes || []),
		multiMatch(assets.excludes || [])
	].map(async paths => [
    ...(await paths),
    ...(await multiMatch((await paths).map(path => path + '/**'))),
	]));
	const assetsPaths = unique(includes.filter(path => !excludes.includes(path) && !path.startsWith('..')));
	const directories = unique(assetsPaths.map(path => path.split('/').slice(0, -1).join('/')).filter(Boolean));

	directories.forEach(dir => mkdirp(destination + '/' + dir));
	await Promise.all(assetsPaths
		.filter(path => !directories.includes(path))
		.map(path => copyFile(source + '/' + path, destination + '/' + path)));
}

module.exports = async (input, output, onCommand) => {
	const { revisions, prebuild: prebuildPath, metadata, assets, pdf } = loadSettings(input);
	const prebuild = prebuildPath ? require(`${input.directory}/${prebuildPath}`) : () => {};
	const commander = onCommand(prebuild.onCommand);

	copyAssets(input.directory, output.directory, assets);

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
			handlebars,
			commander,
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
