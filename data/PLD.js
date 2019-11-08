const fs = require('fs');
const inquirer = require('inquirer');
const { Gitlab } = require('gitlab');
const config = require('./config');

/*
ISSUE EXAMPLE:
le livrable - la catégorie
En tant que quelqu'un d'important, je veux faire quelque chose.

C'est important pour une personne importante de pouvoir faire quelque chose.
On ne devrai jamais sous estimer ceci.

- [x] Devenir quelqu'un d'important
- [ ] Faire quelque chose
*/

module.exports = async (metadata, revisions) => {
	const folder = metadata.folder;

	const api = new Gitlab({
		token: process.env.GITLAB_TOKEN,
	});

	const milestones = (await api.GroupMilestones.all(config.groupId))
		.map(({ id, iid, title, start_date }) => ({ id, iid, title, start_date }))
		.sort((a, b) => ('' + a.start_date).localeCompare(b.start_date))

	const { milestone } = await inquirer.prompt([{
		type: 'list',
		name: 'milestone',
		message: 'Select a milestone',
		choices: milestones.map(m => ({ name: m.title, value: m })),
	}]);

	const projectNamesByIds = {};
	const issues = (await api.Issues.all({ milestone: milestone.title, scope: 'all' }));
	const cards = (await Promise.all(issues.map(async ({ title, description, time_stats, project_id, labels, closed_at }) => {
		const timeEstimate = time_stats.time_estimate / (8 * 3600);

		if (!description || description.length == 0)
			return;

		description = description.split('\n');

		if (description.length < 3)
			return;

		const [ category, deliverable ] = description.shift().split(' - ').reverse();
		const [ story, user, goal ] = description.shift().match(/En tant que ([^,]*), je veux (.*)/) || [];

		if (!user || !story)
			return;

		description = description.join('\n');
		const dod = description.match(/- \[[x| ]\] ([^\n]*)/g).map(s => s.slice(6));
		dod.shift();
		description = description.match(/([\s\S]*?)- \[[x| ]\]/).pop().trim().replace('\n', '<br>');

		if (!deliverable && !projectNamesByIds[project_id])
			projectNamesByIds[project_id] = (await api.Projects.show(project_id)).name;

		return {
			title,
			description,
			deliverable: deliverable || projectNamesByIds[project_id],
			category,
			userStory: {
				user,
				goal,
			},
			dod,
			timeEstimate,
			status: labels.includes('Doing') ? 'doing' : (closed_at ? 'done' : 'todo')
		};
	}))).filter(Boolean);

	return {
		advancement_reports: fs.readFileSync(`${folder}/advancement_reports.md`),
		date: new Date(),
		cards,
	};
};
