# {{metadata.title}}
###### {{metadata.company}}

## Description du document
{{tables.metadata}}

## Tableau de révisions
{{tables.revisions}}

## Organigramme des livrables

## Cartes des livrables

## Stories
{{#data.cards}}
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
{{/data.cards}}

## Rapports d'avancement
{{data.advancement_reports}}

Généré le: {{data.date}}
