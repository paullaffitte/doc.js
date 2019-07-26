const fs = require('fs');

module.exports = (metadata, revisions) => {
	const folder = metadata.folder;

	return {
		advancement_reports: fs.readFileSync(`${folder}/advancement_reports.md`),
		date: new Date(),
	};
};
