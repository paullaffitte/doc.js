#! /usr/bin/env node

const execa = require('execa');
const commander = require('commander');
const fs = require('fs').promises;
const path = require('path');
const prebuild = require('./prebuild');

function parseFormat(value) {
	const allowedFormats = [ 'pdf', 'html', 'md' ];

	if (!allowedFormats.includes(value)) {
		throw new Error(`Invalid format "${value}", should be one of ${allowedFormats.join(', ')}.`);
	}

	return value;
}

commander
	.option('-f, --format <extension>', 'output format', parseFormat)
	.option('-o, --output <filename>', 'output filename')
	.parse(process.argv);

async function buildMarkdown(documentName) {
	const files = await Promise.all(inputs.map(filename => fs.readFile(filename)));
	const content = files.reduce((acc, file) => acc + file.toString(), '');

	fs.writeFile(`${documentName}.md`, new Uint8Array(...files));
}

if (commander.args.length < 1)
	throw new Error('Missing filename');
if (!commander.format)
	commander.format = 'pdf';

const filename = commander.args[0];
const documentName = path.parse(filename).name;
const output = commander.output ? path.parse(commander.output) : {};

if (output.name && output.ext.length == 0)
	commander.output += '.' + commander.format;

prebuild(filename, output.name || documentName).then(documentFolder => {
	if (commander.format == 'md') {
		buildMarkdown(documentName);
	} else {
		execa('pandoc', [
			'build/prebuild.md',
			'-o', commander.output || `./build/${documentName}.${commander.format}`,
			'--from', 'markdown-markdown_in_html_blocks+raw_html+auto_identifiers+header_attributes',
			'-t', 'html5',
			'--css', `${documentFolder}/${documentName}.css`,
		])
		.then(() => fs.unlink('build/prebuild.md'))
		.catch(err => {
			console.error(err);
		});
	}
});
