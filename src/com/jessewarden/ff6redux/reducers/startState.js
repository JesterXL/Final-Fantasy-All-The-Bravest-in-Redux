export var startState = {
	gameLoop: {
		now: performance.now(),
		running: false
	},
	players: [],
	monsters: [],
	playerWhoseTurnItIs: noPlayer,
	monsterWhoseTurnItIs: noMonster
};

export const noPlayer = "-1";
export const noMonster = {};
