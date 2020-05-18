#! /usr/bin/env node

const commander = require('commander');
const fs = require('fs');
const path = require('path');
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
	const css = options.headerAndFooterCss ? fs.readFileSync(options.headerAndFooterCss).toString() : '';

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

const cwd = process.cwd();
commander
	.option('-f, --format <extension>', 'output format', parseFormat)
	.option('-o, --output <directory>', 'output directory')
	.option('-t, --title <title>', 'document title (do not include the extension)')
	.parse(process.argv);

if (commander.args.length < 1)
	throw new Error('Missing filename');
if (!commander.format)
	commander.format = 'pdf';

function getFileInfo(filename) {
	const fullpath = path.resolve(filename);
	const { dir, ext, base, name } = path.parse(fullpath);
	return {
		filename: fullpath,
		directory: dir,
		extension: ext,
		name,
		getPath: subpath => `${dir}/${subpath}`,
	};
}

const input = getFileInfo(commander.args[0]);
const output = getFileInfo(`${commander.output || (cwd + '/build')}/${commander.title || input.name}.html`)
process.chdir(input.directory);

prebuild(input, output).then((options) => {
	if (commander.format == 'pdf') {
		const outputFilename = `${output.directory}/${output.name}.pdf`
		console.log('Generating pdf with puppeteer', outputFilename);
		html2Pdf(`file://${output.filename}`, outputFilename, options);
	}
});
