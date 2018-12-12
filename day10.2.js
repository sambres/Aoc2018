const fs = require('fs');
const fn = require('./common/functional');
const runner = require('./common/runner');

const parseSigned = str =>
	str.startsWith('-') ? -1 * parseInt(str.slice(1)) : parseInt(str);

const format = data => {
	return data.split('\n').map(c => {
		const match = c.match(
			/position=< ?(-?\d+), +(-?\d+)> velocity=< ?(-?\d+), +(-?\d+)>/
		);

		return {
			x: parseSigned(match[2]),
			y: parseSigned(match[1]),
			vX: parseSigned(match[4]),
			vY: parseSigned(match[3]),
		};
	});
};

const printMatrix = points => {
	const max = points.reduce(
		(aggr, curr) => ({
			x: aggr.x > curr.x ? aggr.x : curr.x,
			y: aggr.y > curr.y ? aggr.y : curr.y,
		}),
		{ x: 0, y: 0 }
	);

	for (let i = 0; i < max.x + 1; i++) {
		let str = '';
		for (let j = 0; j < max.y + 1; j++) {
			const truc = points.find(p => p.x === i && p.y === j);
			if (truc) {
				str += '#';
			} else {
				str += '.';
			}
		}
		console.log(str);
	}
};

const getNewState = points => {
	return points.map(({ x, y, vX, vY }) => ({
		x: x + vX,
		y: y + vY,
		vX,
		vY,
	}));
};

const manDist = (p1, p2) => Math.abs(p2.y - p1.y) + Math.abs(p2.x - p1.x)

const areTheyAllTouching = points => {
	for (let i = 0; i < points.length ; i++) {
		let touching = false
		// let minDist = 10
		for (let j = 1; j < points.length ; j++) {
			if(i === j) continue
			// minDist = manDist(points[i], points[j]) < minDist ? manDist(points[i], points[j]) : minDist 
			if(manDist(points[i], points[j]) <= 2) {
				touching = true
				break;
			}
		}
		// console.log(i, minDist, touching)
		if(!touching) return false
	}
	return true
}

const compute = points => {
	let state = points;

	let i = 0
	while(!areTheyAllTouching(state)) {

		state = getNewState(state);
		i++
	}
	return i;
};


runner.run('10', format, compute);
