# {{metadata.title}}
###### {{metadata.company}}

## Description du document
{{tables.metadata}}

## Tableau de révisions
{{tables.revisions}}

## Organigramme des livrables
{{#data.deliverables}}
### {{name}}
{{/data.deliverables}}

## Cartes des livrables
{{#data.deliverableCards}}
<table>
	<thead>
		<tr>
			<th colspan="{{headCells.length}}">{{name}}</th>
		</tr>
		<tr>
		{{#headCells}}
			<th>{{name}}</th>
		{{/headCells}}
		</tr>
	</thead>
	<tbody>
	{{#rows}}
		<tr>
		{{#.}}
			<td>{{story}}</td>
		{{/.}}
		<tr>
	{{/rows}}
	</tbody>
</table>
{{/data.deliverableCards}}

## Stories
{{#data.deliverables}}
### {{name}}
	{{#categories}}
#### {{name}}
		{{#stories}}
<table class="{{status}}">
	<thead>
		<tr>
			<th colspan="2">{{title}}</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>En tant que :</td>
			<td>Je veux :</td>
		</tr>
		<tr>
			<td>{{userStory.user}}</td>
			<td>{{userStory.goal}}</td>
		</tr>
		<tr>
			<td colspan="2">{{description}}</td>
		</tr>
		<tr>
			<td>Charge estimée</td>
			<td>{{timeEstimate}} J/H</td>
		</tr>
	</tbody>
</table>
		{{/stories}}
	{{/categories}}
{{/data.deliverables}}

## Rapports d'avancement
{{data.advancement_reports}}

Généré le: {{data.date}}