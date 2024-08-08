export function totalPoints(events) {
  let points = {};

  for (const event of events) {
    if (event.type === "point") {
      if (points[event.team]) {
        points[event.team] = points[event.team] + 1;
      } else {
        points[event.team] = 1;
      }
    } else if (event.type === "setEnd") {
      points = {};
    }
  }
  return points;
}
