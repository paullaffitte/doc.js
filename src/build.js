#! /usr/bin/env node

const execa = require('execa');
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const RenderPDF = require('chrome-headless-render-pdf');
const puppeteer = require('puppeteer');
const image2base64 = require('image-to-base64');
const prebuild = require('./prebuild');

function parseFormat(value) {
	const allowedFormats = [ 'pdf', 'html' ];

	if (!allowedFormats.includes(value)) {
		throw new Error(`Invalid format "${value}", should be one of ${allowedFormats.join(', ')}.`);
	}

	return value;
}

async function incorporateImagesAndStyle(html, css, margin) {
	const matches = html.matchAll(/<img[^>]*? src="([^"]*)"/g);
  const style = `
font-size: 8pt;
margin-left: calc(${margin.left} * 0.78);
margin-right: calc(${margin.right} * 0.78);
width: 100%;
height: calc(100% - 0.185in);`;

	for (const match of matches) {
		const imgTagWithBase64 = match[0].replace(match[1], `data:image/${match[1].split('.').pop()};base64,` + (await image2base64(match[1])));
		html = html.replace(match[0], imgTagWithBase64);
	}

	return `<style>${css || ''}</style><div style="${style}">${html}</div>`
}

async function html2Pdf(inputLocation, outputFilename, options) {
	const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { header, footer, margin } = options;
  const css = fs.existsSync(options.cssFilename) ? fs.readFileSync(options.cssFilename).toString() : '';

  await page.goto(inputLocation, { waitUntil: 'networkidle2' });
  await page.pdf({
  	path: outputFilename,
  	format: 'A4',
  	displayHeaderFooter: true,
  	printBackground: true,
  	headerTemplate: await incorporateImagesAndStyle(header, css, margin),
  	footerTemplate: await incorporateImagesAndStyle(footer, css, margin),
  	margin: {
  		top: margin.top,
  		bottom: margin.bottom,
  		left: margin.left,
  		right: margin.right,
  	}
  });

  await browser.close();
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

prebuild(filename, output.name || documentName).then((options) => {
	const cssFilename = `${options.documentFolder}/${documentName}.css`;
	const command = [
		'build/prebuild.md',
		'-o', output,
		'--from', 'markdown-markdown_in_html_blocks+raw_html+auto_identifiers+header_attributes',
		'-F', 'mermaid-filter',
		'-t', 'html5',
		'--metadata', `pagetitle=${documentName}`,
		'--css', cssFilename,
		'--standalone'
	];

	console.log('pandoc', command.join(' '));
	execa('pandoc', command)
	.then(() => {
		fs.unlinkSync('build/prebuild.md');
		if (commander.format == 'pdf') {
			const htmlPath = path.resolve(`${__dirname}/../${output}`);
			const outputFilename = [ parsedOutput.dir, '/', parsedOutput.name, '.pdf' ].join('');
			console.log('Generating pdf with puppeteer', outputFilename);
			html2Pdf(`file://${htmlPath}`, outputFilename, { ...options, cssFilename });
		}
	})
	.catch(err => console.error(err));
});
