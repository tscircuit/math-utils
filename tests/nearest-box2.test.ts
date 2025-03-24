import { expect, test } from "bun:test"
import { findNearestPointsBetweenBoxSets } from "../src/nearest-box"
const reproData = {
  goalBoxesA: [
    {
      type: "rect",
      layers: ["top"],
      center: {
        x: -10,
        y: -5,
      },
      width: 0.1,
      height: 1,
      connectedTo: ["pcb_port_0"],
    },
    {
      center: {
        x: -10,
        y: -5.5,
        layer: "top",
        pcb_port_id: "pcb_port_0",
      },
      width: 0.01,
      height: 0.01,
      connectedTo: ["pcb_port_0"],
      layers: ["top"],
      type: "rect",
    },
  ],
  goalBoxesB: [
    {
      center: {
        x: -8,
        y: -4.5,
        layer: "top",
        pcb_port_id: "pcb_port_2",
      },
      width: 0.01,
      height: 0.01,
      connectedTo: ["pcb_port_2"],
      layers: ["top"],
      type: "rect",
    },
  ],
}

test("nearest-box2", () => {
  const { pointA, pointB, distance } = findNearestPointsBetweenBoxSets(
    reproData.goalBoxesA,
    reproData.goalBoxesB,
  )

  expect(distance).toBeCloseTo(1.94, 1)
})
