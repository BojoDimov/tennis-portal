module.exports = { _draw_eliminations, _draw_groups };

function _draw_groups(scheme, seed, enrollments) {
  //let bracket_size = scheme.groupCount * scheme.teamsPerGroup;
  let bracket_size = Math.ceil(enrollments.length / scheme.teamsPerGroup) * scheme.teamsPerGroup;
  let ordering = get_group_order(seed, bracket_size / scheme.teamsPerGroup, scheme.teamsPerGroup);
  let groups = [];

  for (let i = 0; i < bracket_size; i++) {
    let g = ordering[i];
    if (!groups[g])
      groups[g] = {
        schemeId: scheme.id,
        group: g,
        teams: []
      };

    if (i < enrollments.length)
      groups[g].teams.push({ teamId: enrollments[i].id, order: groups[g].teams.length + 1 });
    else
      groups[g].teams.push({ teamId: null, order: groups[g].teams.length + 1 });
  }

  return groups;
}

function _draw_eliminations(scheme, seed, enrollments) {
  let bracket_size = Math.pow(2, Math.ceil(Math.log2(enrollments.length)));
  let { mapping, remaining, empty } = get_order(seed, enrollments.length, bracket_size);
  let matches = [];

  for (let i = 1; i <= bracket_size / 2; i++)
    matches[i] = {
      schemeId: scheme.id,
      match: i,
      round: 1,
      team1Id: null,
      team2Id: null,
      seed1: null,
      seed2: null,
    };

  mapping.forEach((pos, s) => {
    let match = matches[Math.floor(pos / 2) + 1];
    if (pos % 2 == 0) {
      match.team1Id = enrollments[s].id;
      match.seed1 = s + 1;
    }
    else {
      match.team2Id = enrollments[s].id;
      match.seed2 = s + 1;
    }
  });

  remaining.forEach((pos, i) => {
    let match = matches[Math.floor(pos / 2) + 1];
    if (pos % 2 == 0)
      match.team1Id = enrollments[seed + i].id;
    else
      match.team2Id = enrollments[seed + i].id;
  });

  return matches.slice(1);
}

function get_group_order(seed, nGroups, nTeamsPerGroup) {
  let groups = [];
  for (let i = 0; i < seed; i++) {
    let group = Math.floor(Math.random() * 10000) % nGroups;
    while (groups.indexOf(group) != -1)
      group = Math.floor(Math.random() * 10000) % nGroups;
    groups.push(group);
  }

  let t = [];
  for (let i = 0; i < nGroups * nTeamsPerGroup - seed; i++) {
    let group = Math.floor(Math.random() * 10000) % nGroups;
    while (t.indexOf(group) != -1)
      group = Math.floor(Math.random() * 10000) % nGroups;
    groups.push(group);
    t.push(group);
    if (t.length == nGroups)
      t = [];
  }

  return groups;
}

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

function get_random(max_count) {
  return Math.floor(Math.random() * 1000000) % max_count;
}

function get_next_rank(a, b, max, mapped) {
  let number = a + Math.floor(Math.random() * 1000000) % (b - a);
  while (mapped[number] || number >= max)
    number = a + Math.floor(Math.random() * 1000000) % (b - a);
  return number;
}
