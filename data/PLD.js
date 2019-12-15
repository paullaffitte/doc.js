const fs = require('fs');
const inquirer = require('inquirer');
const { Gitlab } = require('gitlab');
const config = require('./config');
const handlebars = require('handlebars');
const chalk = require('chalk');

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

handlebars.registerHelper('even_odd', (conditional, invert) => (conditional % 2) == parseInt(invert) ? 'even' : 'odd');
Array.prototype.toString = function() {
	return this.join(', ');
}

const _console = { warn: console.warn, error: console.error }
console.info = (...args) => console.log(chalk.blue(...args));
console.warn = (...args) => _console.warn(chalk.yellow(...args));
console.error = (...args) => _console.error(chalk.red(...args));

function showTimeEstimations(stories) {
	if (stories.length == 0) {
		console.warn('There is no story make statistics.');
		return;
	}

	const statBase = { estimate: 0, spent: 0, dods: 0, dodsDone: 0 };
	const assignees = stories.reduce((acc, { assignee }) => ({ ...acc, [assignee]: statBase }), {});
	const makeTotal = (acc, { timeEstimate, timeSpent, assignee, dod }) => ({
		estimate: acc.estimate + timeEstimate,
		spent: acc.spent + timeSpent,
		dods: acc.dods + dod.length,
		dodsDone: acc.dodsDone + dod.filter(({ done }) => done).length,
	});
	const totalTimeEstimation = stories.reduce((acc, story) => ({
		...acc,
		[story.assignee]: makeTotal(acc[story.assignee], story),
		Total: makeTotal({ ...statBase, ...acc.Total }, story)
	}), assignees);

	console.info(`${totalTimeEstimation.Total.estimate} jours estimés, soit ${totalTimeEstimation.Total.estimate / config.members} jours par personne.`);

	const percentage = (progression, total) => Math.floor(progression / total * 100) + '%';
	const assigneeTable = Object.entries(totalTimeEstimation)
		.map(([ name, {estimate, spent, dods, dodsDone} ]) => ({
			name,
			estimate,
			spent,
			dods,
			dodsDone,
			timeProgression: percentage(spent, estimate),
			dodsProgression: percentage(dodsDone, dods),
		}))
		.sort((a, b) => b.estimate - a.estimate)

	console.table(assigneeTable);
}

module.exports = async (metadata, revisions, folder) => {
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
	const stories = (await Promise.all(issues.map(async ({ title, description, time_stats, project_id, labels, closed_at, assignee }) => {
		const timeEstimate = time_stats.time_estimate / (8 * 3600);
		const timeSpent = time_stats.total_time_spent / (8 * 3600);

		if (!description || description.length == 0) {
			console.warn(`Issue "${title}" is missing a description.`);
			return;
		}

		description = description.split('\n');

		if (description.length < 3) {
			console.warn(`Issue "${title}" is not parsable.`);
			return;
		}

		const [ category, deliverable ] = description.shift().split(' - ').reverse();
		const [ story, user, goal ] = description.shift().match(/En tant que ([^,]*), je veux (.*)/) || [];

		if (!user || !goal) {
			console.warn(`Issue "${title}" is not parsable.`);
			return;
		}

		if (timeEstimate == 0) {
			console.warn(`Issue "${title}" has no time estimate.`);
		}

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
			timeSpent,
			status: closed_at ? 'done' : (labels.includes('Doing') ? 'doing' : 'todo'),
			assignee: assignee ? assignee.name : 'Personne'
		};
	}))).filter(Boolean);

	showTimeEstimations(stories);

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
					stories: deliverables[deliverable][category].sort().map((story, i) => ({ ...story, index: i + 1 }))
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

	const advancement_reports = fs.readFileSync(`${folder}/advancement_reports.md`)
		.toString()
		.split('---')
		.map((report, index, reports) => {
			report = report.trim().split('\n');
			return {
				index: reports.length - index - 1,
				title: report.shift().replace(/^###\s*/, ''),
				content: report.join('\n')
			}
		});

	return {
		advancement_reports,
		date: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
		time: `${date.getHours()}h${date.getMinutes()} (GMT${timezoneOffset >= 0 ? ('+' + timezoneOffset) : timezoneOffset})`,
		currentYear: date.getFullYear(),
		deliverables,
		deliverableCards
	};
};
