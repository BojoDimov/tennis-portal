module.exports = { drawEliminations, drawGroups, fillGroups, drawEliminationsFromGroups };

function fillGroups(groups) {
  //playerPerGroup
  const ppg = 2;
  //groupCount
  const gc = groups.length;
  //bracketSize
  const bs = gc * ppg;
  //dummyGroupCount
  const dgc = (Math.pow(2, Math.ceil(Math.log2(bs))) - bs) / ppg;
  //distance between 2 dummy groups
  const dist = Math.floor(gc / dgc);

  //i am filling the dummy groups reversed because i want them to be at the end of the draw
  let result = [];
  let counter = 0;
  for (let i = groups.length - 1; i >= 0; i--) {
    if (counter < dgc && i % dist == 0) {
      result.push({
        team1: null,
        team2: null
      });
      counter++;
    }

    result.push(groups[i]);
  }

  //reverse reverse
  result.reverse();

  //fix order
  result.forEach((g, i) => g.order = i);
  return result;
}

function drawEliminationsFromGroups(groups, schemeId) {
  let matches = [];
  for (let i = 0; i < groups.length / 2; i++) {
    matches.push({
      schemeId,
      team1Id: groups[i].team1 ? groups[i].team1.id : null,
      team2Id: groups[groups.length - i - 1].team2 ? groups[groups.length - i - 1].team2.id : null,
      match: matches.length + 1,
      round: 1
    })
  }

  for (let i = 0; i < groups.length / 2; i++) {
    matches.push({
      schemeId,
      team2Id: groups[i].team2 ? groups[i].team2.id : null,
      team1Id: groups[groups.length - i - 1].team1 ? groups[groups.length - i - 1].team1.id : null,
      match: matches.length + 1,
      round: 1
    })
  }

  return matches;
}

function drawGroups(scheme, seed, enrollments) {
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

function drawEliminations(scheme, seed, enrollments) {
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
      match.team1Id = enrollments[mapping.length + i].id;
    else
      match.team2Id = enrollments[mapping.length + i].id;
  });

  matches = matches.slice(1);

  //Handle default wins from bye's
  let secondRound = [];
  matches.forEach(match => {
    if (match.team1Id && match.team2Id)
      return;
    let defaultWinner = match.team1Id || match.team2Id;
    let existingMatch = secondRound.find(e => e.match == Math.ceil(match.match / 2));

    if (!existingMatch) {
      existingMatch = {
        schemeId: match.schemeId,
        round: 2,
        match: Math.ceil(match.match / 2)
      };
      secondRound.push(existingMatch);
    }

    if (existingMatch.match % 2 == 0)
      existingMatch.team2Id = defaultWinner;
    else
      existingMatch.team1Id = defaultWinner;
  });
  matches.push(...secondRound);

  return matches;
}

function get_group_order(seed, nGroups, nTeamsPerGroup) {
  if (seed > nGroups)
    seed = nGroups;

  let groups = [];
  let t = [];
  for (let i = 0; i < seed; i++) {
    let group = Math.floor(Math.random() * 10000) % nGroups;
    while (groups.indexOf(group) != -1)
      group = Math.floor(Math.random() * 10000) % nGroups;
    groups.push(group);
    t.push(group);
    if (t.length == nGroups)
      t = [];
  }


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
  if (positioned > count)
    positioned = count;

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