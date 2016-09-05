import QuickSettings from 'quicksettings';

let unsubscribe;
let entitySettings;
let componentSettings;
let initiativeOrderSettings;
let monsterSettings;

export default function debugWindows(store)
{
	entitySettings = QuickSettings.create(810, 10, 'Debug Entities');
	entitySettings.addHTML('Entities', '<p>Waiting...</p>');
	entitySettings.overrideStyle('Entities', 'padding', '4px');

	componentSettings = QuickSettings.create(1020, 10, 'Debug Components');
	componentSettings.addHTML('Components', '<p>Waiting...</p>');
	componentSettings.setWidth(230);

	initiativeOrderSettings = QuickSettings.create(1260, 10, 'Debug Initiative');
	initiativeOrderSettings.addHTML('Characters', 'Waiting...');

	monsterSettings = QuickSettings.create(810, 340, 'Debug Initiative');
	monsterSettings.addHTML('Monsters', 'Waiting...');

	unsubscribe = store.subscribe(()=>
	{
		redraw(store);
	});

	redraw(store);
}

var entitiesToHTML = (entities) => '<ul style="padding-left: 16px;">' + _.map(entities, e => '<li>' + e + '</li>').join('') + '</ul>';
var componentsToHTML = (components) => '<ul style="padding-left: 16px;">' + _.map(components, c => '<li>' + c.type + '</li>').join('') + '</ul>';
var initiativeCharactersToHTML = (characters) => {
	return _.map(characters, (character)=>
	{
		var charHTML = '<p>';
		charHTML += '<b>Entity:</b>' + character.entity + '<br />';
		charHTML += '<b>Battle State:</b>' + character.battleState + '<br />';
		charHTML += '<b>Percentage:</b>' + character.percentage + '<br />';
		charHTML += '</p>';
		return charHTML;
	}).join('');
};
var monstersToHTML = (monsters) => {
	return _.map(monsters, (monster)=>
	{
		var html = '<p>';
		html += '<b>Percentage:</b>' + monster.percentage + '<br />';
		html += '<b>Hitpoints:</b>' + monster.hitPoints + '<br />';
		return html;
	}).join('');
};
function redraw(store)
{
	var state = store.getState();
	updateOnlyIfChanged(entitySettings, 'Entities', entitiesToHTML(state.entities));
	updateOnlyIfChanged(componentSettings, 'Components', componentsToHTML(state.components));
	
	var characters = _.filter(state.components, c => c.type === 'Character');
	updateOnlyIfChanged(initiativeOrderSettings, 'Characters', initiativeCharactersToHTML(characters));
	
	var monsters = _.filter(state.components, c => c.type === 'Character' && c.characterType === 'monster');
	updateOnlyIfChanged(monsterSettings, 'Monsters', monstersToHTML(monsters));

}

function updateOnlyIfChanged(setting, title, html)
{
	if(setting.getHTML(title) != html)
	{
		setting.setHTML(title, html);
	}
}
