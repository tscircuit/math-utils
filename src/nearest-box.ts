import type { Point } from "./common";

export type Box = { center: Point; width: number; height: number };
export type BoxSet = Box[];

export type GridCell = { boxes: Box[] };

export function getBoundingBox(box: Box) {
	const halfWidth = box.width / 2;
	const halfHeight = box.height / 2;
	return {
		minX: box.center.x - halfWidth,
		maxX: box.center.x + halfWidth,
		minY: box.center.y - halfHeight,
		maxY: box.center.y + halfHeight,
	};
}

export function computeDistanceBetweenBoxes(
	boxA: Box,
	boxB: Box,
): { distance: number; pointA: Point; pointB: Point } {
	const a = getBoundingBox(boxA);
	const b = getBoundingBox(boxB);

	const dx = Math.max(a.minX - b.maxX, b.minX - a.maxX, 0);
	const dy = Math.max(a.minY - b.maxY, b.minY - a.maxY, 0);

	const pointA: Point = { x: 0, y: 0 };
	const pointB: Point = { x: 0, y: 0 };

	if (dx === 0 && dy === 0) {
		// Boxes overlap
		return { distance: 0, pointA: boxA.center, pointB: boxB.center };
	}

	// Compute the closest points on the edges
	pointA.x = clamp(boxA.center.x, b.minX, b.maxX);
	pointA.y = clamp(boxA.center.y, b.minY, b.maxY);

	pointB.x = clamp(boxB.center.x, a.minX, a.maxX);
	pointB.y = clamp(boxB.center.y, a.minY, a.maxY);

	const distance = Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
	return { distance, pointA, pointB };
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function findNearestPointsBetweenBoxSets(
	boxSetA: BoxSet,
	boxSetB: BoxSet,
): { pointA: Point; pointB: Point; distance: number } {
	// Determine grid parameters
	const allBoxes = [...boxSetA, ...boxSetB];
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	let avgWidth = 0;
	let avgHeight = 0;

	for (const box of allBoxes) {
		const bbox = getBoundingBox(box);
		minX = Math.min(minX, bbox.minX);
		minY = Math.min(minY, bbox.minY);
		maxX = Math.max(maxX, bbox.maxX);
		maxY = Math.max(maxY, bbox.maxY);
		avgWidth += box.width;
		avgHeight += box.height;
	}

	avgWidth /= allBoxes.length;
	avgHeight /= allBoxes.length;

	// Define grid cell size
	const cellSize = Math.max(avgWidth, avgHeight);

	const gridWidth = Math.ceil((maxX - minX) / cellSize);
	const gridHeight = Math.ceil((maxY - minY) / cellSize);

	// Initialize grid
	const grid: GridCell[][] = Array.from({ length: gridWidth }, () =>
		Array.from({ length: gridHeight }, () => ({ boxes: [] })),
	);
	// Assign boxes from Set B to grid cells
	for (const box of boxSetB) {
		const bbox = getBoundingBox(box);
		const startX = Math.floor((bbox.minX - minX) / cellSize);
		const endX = Math.floor((bbox.maxX - minX) / cellSize);
		const startY = Math.floor((bbox.minY - minY) / cellSize);
		const endY = Math.floor((bbox.maxY - minY) / cellSize);

		for (let x = startX; x <= endX; x++) {
			for (let y = startY; y <= endY; y++) {
				grid[x][y].boxes.push(box);
			}
		}
	}

	let minDistance = Number.POSITIVE_INFINITY;
	let nearestPointA: Point = { x: 0, y: 0 };
	let nearestPointB: Point = { x: 0, y: 0 };

	// Process boxes in Set A
	for (const boxA of boxSetA) {
		const bboxA = getBoundingBox(boxA);
		const startX = Math.floor((bboxA.minX - minX) / cellSize);
		const endX = Math.floor((bboxA.maxX - minX) / cellSize);
		const startY = Math.floor((bboxA.minY - minY) / cellSize);
		const endY = Math.floor((bboxA.maxY - minY) / cellSize);

		// Consider neighboring cells as well
		for (let x = startX - 1; x <= endX + 1; x++) {
			if (x < 0 || x >= gridWidth) continue;
			for (let y = startY - 1; y <= endY + 1; y++) {
				if (y < 0 || y >= gridHeight) continue;

				const cell = grid[x][y];
				for (const boxB of cell.boxes) {
					const { distance, pointA, pointB } = computeDistanceBetweenBoxes(
						boxA,
						boxB,
					);
					if (distance < minDistance) {
						minDistance = distance;
						nearestPointA = pointA;
						nearestPointB = pointB;
					}
				}
			}
		}
	}

	return {
		pointA: nearestPointA,
		pointB: nearestPointB,
		distance: minDistance,
	};
}
