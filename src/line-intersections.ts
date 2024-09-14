import type { Point } from "./common";

/**
 * Returns true if the two lines intersect.
 */
export function doesLineIntersectLine(
	[a1, a2]: [Point, Point],
	[b1, b2]: [Point, Point],
	{
		lineThickness = 0,
	}: {
		lineThickness?: number;
	} = {},
): boolean {
	if (lineThickness === 0) {
		return doSegmentsIntersect(a1, a2, b1, b2);
	}
	const minDist = segmentsDistance(a1, a2, b1, b2);
	return minDist <= lineThickness;
}

/**
 * Returns true if the two segments intersect.
 */
export function doSegmentsIntersect(
	p1: Point,
	q1: Point,
	p2: Point,
	q2: Point,
): boolean {
	const o1 = orientation(p1, q1, p2);
	const o2 = orientation(p1, q1, q2);
	const o3 = orientation(p2, q2, p1);
	const o4 = orientation(p2, q2, q1);

	// General case
	if (o1 !== o2 && o3 !== o4) {
		return true;
	}

	// Special Cases
	if (o1 === 0 && onSegment(p1, p2, q1)) return true;
	if (o2 === 0 && onSegment(p1, q2, q1)) return true;
	if (o3 === 0 && onSegment(p2, p1, q2)) return true;
	if (o4 === 0 && onSegment(p2, q1, q2)) return true;

	return false;
}

/**
 * Returns 0 if the points are colinear, 1 if they are clockwise, and 2 if they are counterclockwise.
 */
export function orientation(p: Point, q: Point, r: Point): number {
	const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	if (val === 0) return 0; // colinear
	return val > 0 ? 1 : 2; // clock or counterclock wise
}

/**
 * Returns true if q is on the segment p->r.
 */
export function onSegment(p: Point, q: Point, r: Point): boolean {
	return (
		q.x <= Math.max(p.x, r.x) &&
		q.x >= Math.min(p.x, r.x) &&
		q.y <= Math.max(p.y, r.y) &&
		q.y >= Math.min(p.y, r.y)
	);
}

/**
 * Returns the minimum distance between two segments.
 */
function segmentsDistance(a1: Point, a2: Point, b1: Point, b2: Point): number {
	// Handle degenerate cases: segments of zero length
	if (a1.x === a2.x && a1.y === a2.y) {
		return pointToSegmentDistance(a1, b1, b2);
	}
	if (b1.x === b2.x && b1.y === b2.y) {
		return pointToSegmentDistance(b1, a1, a2);
	}

	// Check if segments intersect
	if (doSegmentsIntersect(a1, a2, b1, b2)) {
		return 0;
	}

	// Compute the minimum distance between the segments
	const distances = [
		pointToSegmentDistance(a1, b1, b2),
		pointToSegmentDistance(a2, b1, b2),
		pointToSegmentDistance(b1, a1, a2),
		pointToSegmentDistance(b2, a1, a2),
	];

	return Math.min(...distances);
}

/**
 * Returns the minimum distance between a point and a segment.
 */
export function pointToSegmentDistance(p: Point, v: Point, w: Point): number {
	const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
	if (l2 === 0) return distance(p, v);

	let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
	t = Math.max(0, Math.min(1, t));

	const projection = {
		x: v.x + t * (w.x - v.x),
		y: v.y + t * (w.y - v.y),
	};

	return distance(p, projection);
}

/**
 * Returns the distance between two points.
 */
export function distance(p1: Point, p2: Point): number {
	const dx = p1.x - p2.x;
	const dy = p1.y - p2.y;
	return Math.sqrt(dx * dx + dy * dy);
}