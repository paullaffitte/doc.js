#! /usr/bin/env node

const execa = require('execa');
const commander = require('commander');
const fs = require('fs').promises;
const path = require('path');
const RenderPDF = require('chrome-headless-render-pdf');
const prebuild = require('./prebuild');

function parseFormat(value) {
	const allowedFormats = [ 'pdf', 'html' ];

	if (!allowedFormats.includes(value)) {
		throw new Error(`Invalid format "${value}", should be one of ${allowedFormats.join(', ')}.`);
	}

	return value;
}

// TODO check pandoc version >=2.7.x

commander
	.option('-f, --format <extension>', 'output format', parseFormat)
	.option('-o, --output <filename>', 'output filename')
	.parse(process.argv);

if (commander.args.length < 1)
	throw new Error('Missing filename');
if (!commander.format)
	commander.format = 'pdf';

const filename = commander.args[0];
const documentName = path.parse(filename).name;
const output = commander.output || `./build/${documentName}.html`;
const parsedOutput = path.parse(output);

if (output.name && output.ext.length == 0)
	commander.output += '.html';

prebuild(filename, output.name || documentName).then(documentFolder => {
	const command = [
		'build/prebuild.md',
		'-o', output,
		'--from', 'markdown-markdown_in_html_blocks+raw_html+auto_identifiers+header_attributes',
		'-F', 'mermaid-filter',
		'-t', 'html5',
		'--metadata', `pagetitle=${documentName}`,
		'--css', `${documentFolder}/${documentName}.css`,
		'--standalone'
	];

	console.log('pandoc', command.join(' '));
	execa('pandoc', command)
	.then(() => {
		fs.unlink('build/prebuild.md');
		if (commander.format == 'pdf') {
			const htmlPath = path.resolve(`${__dirname}/../${output}`);
			const pdfOutput = [ parsedOutput.dir, '/', parsedOutput.name, '.pdf' ].join('');
			console.log('Generating pdf with google-chrome', pdfOutput);
			RenderPDF.generateSinglePdf(`file://${htmlPath}`, pdfOutput, { includeBackground: true });
		}
	})
	.catch(err => console.error(err));
});
