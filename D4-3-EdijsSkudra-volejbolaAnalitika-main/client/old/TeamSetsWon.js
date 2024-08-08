export function totalSets(events) {
  let sets = 1;
  for (const event of events) {
    if (event.type === "setEnd") {
      sets += 1;
    }
  }
  return sets;
}

export function teamSetsWon(events) {
  let sets = {};

  for (const event of events) {
    if (event.type === "setEnd") {
      if (sets[event.team]) {
        sets[event.team] = sets[event.team] + 1;
      } else {
        sets[event.team] = 1;
      }
    }
  }
  return sets;
}
