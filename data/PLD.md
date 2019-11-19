<img id="title-logo" src="../data/Teksploit-logo.png">

# {{metadata.titre}} {#title}
## {{metadata.groupe}} {#sub-title}

## Description du document
<table id="metadata">
	<tbody>
	{{#each metadata}}
		<tr class="{{even_odd @index 0}} {{@key}}">
			<td class="key">{{@key}}</td>
			<td>{{this}}</td>
		</tr>
	{{/each}}
	</tbody>
</table>

## Tableau de révisions {#tdr}
<table id="revisions">
	<thead>
		<tr class="key">
			<th>Date</th>
			<th>Version</th>
			<th>Auteurs</th>
			<th>Sections</th>
			<th>Commentaires</th>
		</tr>
	</thead>
	<tbody>
	{{#each revisions}}
		<tr class="{{even_odd @index 0}}">
		{{#each this}}
			<td class="{{@key}}">{{this}}</td>
		{{/each}}
		</tr>
	{{/each}}
	</tbody>
</table>

## Table des matières {#toc}
- [Description du document](#description-du-document)
- [Tableau de révisions](#tdr)
- [1. Table des matières](#toc)
- [2. Organigramme des livrables](#organigramme-des-livrables)
- [3. Cartes des livrables](#cartes-des-livrables)
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
- [4. Rapports d'avancement](#rapports-davancement)

## 1. Organigramme des livrables

```{.mermaid format=svg}
graph TD
	A[{{metadata.groupe}}]
	{{#data.deliverables}}
	A --- {{index}}[{{index}} {{name}}]
	{{/data.deliverables}}
```

## 2. Cartes des livrables
{{#data.deliverableCards}}
<table id="carte-livrable-{{index}}" class="carte-livrable">
	<thead>
		<tr class="key">
			<th colspan="{{headCells.length}}">{{name}}</th>
		</tr>
		<tr class="even">
		{{#headCells}}
			<th>{{index}} {{name}}</th>
		{{/headCells}}
		</tr>
	</thead>
	<tbody>
	{{#rows}}
		<tr class="{{even_odd @index 1}}">
		{{#.}}
			<td>{{#story}} {{../index}}.{{index}} {{title}} {{/story}}</td>
		{{/.}}
		</tr>
	{{/rows}}
	</tbody>
</table>
{{/data.deliverableCards}}

## 3. Stories
{{#data.deliverables}}

### {{index}}. {{name}} { #story-livrable-{{index}} .story-livrable }
	{{#categories}}
		{{#stories}}
<table class="story-card {{status}}">
	<thead>
		<tr class="key">
			<th colspan="2" id="story-{{../../index}}.{{../index}}.{{index}}">{{../index}}.{{index}} {{title}}</th>
		</tr>
	</thead>
	<tbody>
		<tr class="even">
			<td class="bold">En tant que :</td>
			<td class="bold">Je veux :</td>
		</tr>
		<tr class="odd">
			<td>{{userStory.user}}</td>
			<td>{{userStory.goal}}</td>
		</tr>
		<tr class="even">
			<td colspan="2">
				<span class="bold">Description :</span><br>
				{{description}}
			</td>
		</tr>
		<tr class="odd">
			<td colspan="2">
				<span class="bold">Definition of done :</span><br>
				{{#dod}}
					<label><input type="checkbox" {{#done}}checked{{/done}}>{{definition}}</label><br>
				{{/dod}}
			</td>
		</tr>
		<tr class="even">
			<td class="bold">Charge estimée</td>
			<td>{{timeEstimate}} J/H</td>
		</tr>
	</tbody>
</table>
		{{/stories}}
	{{/categories}}
{{/data.deliverables}}

## 4. Rapports d'avancement
<div class="rapports-davancement">
{{data.advancement_reports}}
</div>
