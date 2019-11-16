const fs = require('fs');
const inquirer = require('inquirer');
const { Gitlab } = require('gitlab');
const config = require('./config');

/*
ISSUE EXAMPLE:
le livrable - la catégorie${Math.floor(Math.random() * 5)}
En tant que quelqu'un d'important, je veux faire quelque chose.

C'est important pour une personne importante de pouvoir faire quelque chose.
On ne devrai jamais sous estimer ceci.

- [x] Devenir quelqu'un d'important
- [ ] Faire quelque chose

Le contenu en dessous des DoD sera ignoré par le PLD.
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
	const stories = (await Promise.all(issues.map(async ({ title, description, time_stats, project_id, labels, closed_at }) => {
		const timeEstimate = time_stats.time_estimate / (8 * 3600);

		if (!description || description.length == 0)
			return;

		description = description.split('\n');

		if (description.length < 3)
			return;

		const [ category, deliverable ] = description.shift().split(' - ').reverse();
		const [ story, user, goal ] = description.shift().match(/En tant que ([^,]*), je veux (.*)/) || [];

		if (!user || !goal)
			return;

		description = description.join('\n');
		const dod = description.match(/- \[[x| ]\] ([^\n]*)/g).map(s => ({ definition: s.slice(6), done: s.slice(3, 4) == 'x' }));
		description = description.match(/([\s\S]*?)- \[[x| ]\]/).pop().trim().replace('\n', '<br>');

		if (!deliverable && !projectNamesByIds[project_id])
			projectNamesByIds[project_id] = (await api.Projects.show(project_id)).name;

		return {
			title,
			description,
			deliverable: deliverable || projectNamesByIds[project_id],
			category: category.replace(/\\$/, ''),
			userStory: {
				user,
				goal,
			},
			dod,
			timeEstimate,
			status: labels.includes('Doing') ? 'doing' : (closed_at ? 'done' : 'todo')
		};
	}))).filter(Boolean);

	let deliverables = {};
	let categories = [];

	stories.forEach(({ deliverable, category }) => {
		deliverables[deliverable] = {};
		categories.push({
			name: category,
			deliverable
		});
	});

	categories = [ ...new Set(categories) ].sort();
	categories.forEach(category => deliverables[category.deliverable][category.name] = []);
	deliverables.list = Object.keys(deliverables).sort();
	deliverables.list.forEach(deliverable => deliverables[deliverable].categories = Object.keys(deliverables[deliverable]).sort());
	stories.forEach(story => deliverables[story.deliverable][story.category].push(story));

	deliverables = deliverables.list.map((deliverable, i) => {
		return {
			name: deliverable,
			index: i + 1,
			categories: deliverables[deliverable].categories.map((category, i) => {
				return {
					name: category,
					index: i + 1,
					stories: deliverables[deliverable][category].sort().map((story, idx) => ({ ...story, index: idx + 1, categoryIndex: i + 1 }))
				};
			})
		};
	});

	const deliverableCards = deliverables.map(({ name, index, categories }) => {
		let rows = [];
		for (let i = 0; rows.length == 0 || rows[rows.length - 1].filter(({ story }) => story).length; i++) {
			rows.push(categories.map(({ index, stories }) => ({
				index,
				story: stories[i]
			})));
		}
		rows.pop();

		return {
			name,
			index,
			headCells: categories.map(({ name, index }) => ({ name, index })),
			rows,
		}
	});

	const date = new Date();
	const months = [ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre' ];
	const timezoneOffset = -Math.floor(date.getTimezoneOffset() / 60);

	return {
		advancement_reports: fs.readFileSync(`${folder}/advancement_reports.md`).toString(),
		date: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
		time: `${date.getHours()}h${date.getMinutes()} (GMT${timezoneOffset >= 0 ? ('+' + timezoneOffset) : timezoneOffset})`,
		currentYear: date.getFullYear(),
		deliverables,
		deliverableCards
	};
};
