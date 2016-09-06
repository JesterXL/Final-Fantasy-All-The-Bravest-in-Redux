const BattleState = {
	WAITING: 'WAITING', // waiting for ATB gauge to fill
	READY: 'READY', // ATB gauge is filled, waiting for a turn
	DEFENDING: 'DEFENDING',
	ANIMATING: 'ANIMATING',
	RUNNING: 'RUNNING', // like READY in that you can run, but then stop and your ATB gauge is still full
	DEAD: 'DEAD'
};

export default BattleState;