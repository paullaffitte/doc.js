# {{metadata.title}}
###### {{metadata.company}}

## Description du document
{{tables.metadata}}

## Tableau de révisions {#tdr}
{{tables.revisions}}

## Table des matières {#toc}
- [Description du document](#description-du-document)
- [Tableau de révisions](#tdr)
- [Table des matières](#toc)
- [Organigramme des livrables](#organigramme-des-livrables)
- [Cartes des livrables](#cartes-des-livrables)
{{#data.deliverableCards}}
	- [{{name}}](#carte-livrable-{{index}})
{{/data.deliverableCards}}
- [Stories](#stories)
{{#data.deliverables}}
	- [{{index}} {{name}}](#story-livrable-{{index}})
	{{#categories}}
		- {{index}} {{name}}
		{{#stories}}
			- [{{index}} {{title}}](#story-{{../../index}}.{{../index}}.{{index}})
		{{/stories}}
	{{/categories}}
{{/data.deliverables}}
- [Rapports d'avancement](#rapports-davancement)

## Organigramme des livrables

```{.mermaid format=svg}
graph TD
	A[{{metadata.company}}]
	{{#data.deliverables}}
	A --- {{index}}[{{index}} {{name}}]
	{{/data.deliverables}}
```

## Cartes des livrables
{{#data.deliverableCards}}
<table id="carte-livrable-{{index}}">
	<thead>
		<tr>
			<th colspan="{{headCells.length}}">{{name}}</th>
		</tr>
		<tr>
		{{#headCells}}
			<th>{{index}} {{name}}</th>
		{{/headCells}}
		</tr>
	</thead>
	<tbody>
	{{#rows}}
		<tr>
		{{#.}}
			<td>{{#story}} {{../index}}.{{index}} {{title}} {{/story}}</td>
		{{/.}}
		</tr>
	{{/rows}}
	</tbody>
</table>
{{/data.deliverableCards}}

## Stories
{{#data.deliverables}}

### {{index}} {{name}} { #story-livrable-{{index}} .story-livrable }
	{{#categories}}
		{{#stories}}
<table class="{{status}}">
	<thead>
		<tr>
			<th colspan="2" id="story-{{../../index}}.{{../index}}.{{index}}">{{../index}}.{{index}} {{title}}</th>
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
			<td colspan="2">
				Definition of done :<br>
				{{#dod}}
					<label><input type="checkbox" {{#done}}checked{{/done}}>{{definition}}</label><br>
				{{/dod}}
			</td>
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
<div class="rapports-davancement">
{{data.advancement_reports}}
</div>
