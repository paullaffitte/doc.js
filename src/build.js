#! /usr/bin/env node

const execa = require('execa');
const commander = require('commander');
const fs = require('fs').promises;

function parseFormat(value) {
	const allowedFormats = [ 'pdf', 'html', 'md' ];

	if (!allowedFormats.includes(value)) {
		throw new Error(`Invalid format "${value}", should be one of ${allowedFormats.join(', ')}.`);
	}

	return value;
}

commander
	.option('-f, --format <extension>', 'output format', parseFormat)
	.parse(process.argv);

const inputs = [ 'build/title_and_information.md', 'data/advancement_reports.md' ];

async function buildMarkdown() {
	const files = await Promise.all(inputs.map(filename => fs.readFile(filename)));
	const content = files.reduce((acc, file) => acc + file.toString(), '');

	fs.writeFile('PLD.md', new Uint8Array(...files));
}

if (!commander.format)
	commander.format = 'pdf';

if (commander.format == 'md') {
	buildMarkdown();
} else {
	execa('pandoc', [
		...inputs,
		'-o', `./build/PLD.${commander.format}`,
		'--from', 'markdown+auto_identifiers+header_attributes',
		'-t', 'html5'
	]).catch(err => {
		console.error(err);
	});
}
