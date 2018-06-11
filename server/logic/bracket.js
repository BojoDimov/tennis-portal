function get_order(positioned, count, max_count) {
  /** Returns mapping of the positions of teams in the order: positioned, normal, empty */

  let mapping = [];
  let Q = [{ start: 0, end: max_count - 1, base: 2 }];
  let placed = 0;
  if (placed < positioned) {
    mapping[0] = 0;
    placed++;
  }

  if (placed < positioned) {
    mapping[1] = max_count - 1;
    placed++;
  }

  while (placed < positioned) {
    let i = Q.shift();
    let middle = i.start + (i.end - i.start) / 2;
    let rank = get_next_rank(i.base, i.base * 2, positioned, mapping);
    mapping[rank] = Math.floor(middle) - (rank + 1) % 2;
    //mapping.push(Math.floor(middle) - 1);
    placed++;
    //i am inserting 2 mappings in one iteration thats why there is need of additional check
    if (placed == positioned) break;
    rank = get_next_rank(i.base, i.base * 2, positioned, mapping);
    mapping[rank] = Math.ceil(middle) + rank % 2;
    //mapping.push(Math.ceil(middle));
    placed++;
    Q.push({ start: i.start, end: Math.floor(middle), base: 2 * i.base });
    Q.push({ start: Math.ceil(middle), end: i.end, base: 2 * i.base });
  }

  //populate empty places
  let empty = [];
  for (let i = 0; i < max_count - count && i < mapping.length; i++) {
    if (mapping[i] % 2 == 0)
      empty.push(mapping[i] + 1);
    else
      empty.push(mapping[i] - 1);
  }

  // let remaining = [];
  // for (let i = 0; i < max_count; i++)
  //   if (mapping.indexOf(i) == -1 && empty.indexOf(i) == -1)
  //     remaining.push(i);

  let remaining = [];
  while (remaining.length + mapping.length + empty.length < max_count) {
    if (empty.length < max_count - count) {
      //in case empty_count > positioned_count
      //try to insert random team with one empty team as opponent
      //this way i diminish the probability of creating a match with 2 empty teams
      //note: match first opponent start always at even index
      let number = get_random(max_count);
      while (
        number % 2 != 0 ||
        mapping.indexOf(number) != -1 ||
        mapping.indexOf(number + 1) != -1 ||
        remaining.indexOf(number) != -1
      )
        number = get_random(max_count);

      remaining.push(number);
      empty.push(number + 1);
    } else {
      let number = get_random(max_count);
      while (
        mapping.indexOf(number) != -1 ||
        empty.indexOf(number) != -1 ||
        remaining.indexOf(number) != -1
      )
        number = get_random(max_count);

      remaining.push(number);
    }
  }

  //let ordering = mapping.concat(remaining);
  return { mapping, remaining, empty };
}

function build_matches(seed, teams_count, bracket_size) {
  let order = get_order(seed, teams_count, bracket_size);
  let matches = [];
  for (let i = 1; i <= bracket_size; i += 2)
    matches.push({
      team1: {
        id: i,
        name: '',
        seed: null
      },
      team2: {
        id: i + 1,
        name: '',
        seed: null
      }
    });

  order.mapping.forEach((pos, seed) => {
    let team = null;
    let match = matches[Math.floor(pos / 2)];
    if (pos % 2 == 0)
      team = match.team1;
    else
      team = match.team2;

    team.seed = seed + 1;
    team.name = 'seed';
  });

  order.remaining.forEach((pos, seed) => {
    let team = null;
    let match = matches[Math.floor(pos / 2)];
    if (pos % 2 == 0)
      team = match.team1;
    else
      team = match.team2;

    team.name = 'random';
  });

  order.empty.forEach((pos, seed) => {
    let team = null;
    let match = matches[Math.floor(pos / 2)];
    if (pos % 2 == 0)
      team = match.team1;
    else
      team = match.team2;

    team.name = 'bye';
  });

  return matches;
}

function get_random(max_count) {
  return Math.floor(Math.random() * 1000000) % max_count;
}

function get_next_rank(a, b, max, mapped) {
  let number = a + Math.floor(Math.random() * 1000000) % (b - a);
  while (mapped[number] || number >= max)
    number = a + Math.floor(Math.random() * 1000000) % (b - a);
  return number;
}

module.exports = { get_order, build_matches };