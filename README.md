# @tscircuit/math-utils

This repository contains a collection of TypeScript utility functions for geometric calculations, primarily focused on line intersection and distance calculations.

## Features

- Line intersection detection
- Segment intersection detection
- Segment-rectangle intersection detection
- Point-to-segment distance calculation
- Orientation of points
- Distance between points

## Installation

```bash
bun add @tscircuit/math-utils
```

## Usage

Import the functions you need in your TypeScript project:

```typescript
import {
  doesLineIntersectLine,
  doSegmentsIntersect,
  pointToSegmentDistance,
} from "./src/index"

// Example usage
const point1 = { x: 0, y: 0 }
const point2 = { x: 5, y: 5 }
const point3 = { x: 0, y: 5 }
const point4 = { x: 5, y: 0 }

const intersects = doesLineIntersectLine([point1, point2], [point3, point4])
console.log("Lines intersect:", intersects)
```

## API Reference

| Function | Description |
| -------- | ----------- |
| `doesLineIntersectLine(line1, line2, options?)` | Determine if two lines intersect, optionally considering line thickness. |
| `doSegmentsIntersect(p1, q1, p2, q2)` | Check if two line segments intersect. |
| `doesSegmentIntersectRect(a, b, rect)` | Check if a segment intersects an axis-aligned rectangle. |
| `orientation(p, q, r)` | Calculate the orientation of three points. |
| `onSegment(p, q, r)` | Determine if point `q` lies on the segment `p`–`r`. |
| `pointToSegmentDistance(p, v, w)` | Minimum distance between a point and a segment. |
| `distance(p1, p2)` | Euclidean distance between two points. |
| `getSegmentIntersection(a, b, u, v)` | Intersection point of two segments or `null` if none. |
| `getBoundingBox(box)` | Compute the bounding box of a box. |
| `computeDistanceBetweenBoxes(boxA, boxB)` | Minimum distance between two boxes and the nearest points. |
| `clamp(value, min, max)` | Clamp a value between `min` and `max`. |
| `findNearestPointsBetweenBoxSets(setA, setB)` | Find nearest points between two sets of boxes. |
| `getUnitVectorFromPointAToB(a, b)` | Unit vector pointing from point A to B. |
| `getUnitVectorFromDirection(direction)` | Unit vector for the given cardinal direction. |
| `grid(options)` | Generate grid cell positions with spacing and offsets. |
| `segmentToSegmentMinDistance(a, b, u, v)` | Minimum distance between two line segments. |
| `segmentToBoundsMinDistance(a, b, bounds)` | Minimum distance from a segment to a bounds rectangle. |
| `segmentToBoxMinDistance(a, b, box)` | Minimum distance from a segment to a box. |
| `segmentToCircleMinDistance(a, b, circle)` | Minimum distance from a segment to a circle. |
| `pointToSegmentClosestPoint(p, a, b)` | Closest point on a segment to the given point. |
| `pointToBoxDistance(p, box)` | Minimum distance from a point to a box. |
| `pointToBoundsDistance(p, bounds)` | Minimum distance from a point to a bounds rectangle. |
| `midpoint(p1, p2)` | Midpoint between two points. |
| `distSq(p1, p2)` | Squared distance between two points. |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
