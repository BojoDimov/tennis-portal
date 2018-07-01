const DrawActions = require('./logic/drawActions');

let groups = [
  { team1: 'A1', team2: 'A2' },
  { team1: 'B1', team2: 'B2' },
  { team1: 'C1', team2: 'C2' },
  { team1: 'D1', team2: 'D2' },
  { team1: 'E1', team2: 'E2' }
];

groups = DrawActions._fill_groups(groups);
//console.log(groups);
let matches = DrawActions._draw_eliminations_from_groups(groups);
console.log(matches);

function get_winner(match) {
  return 0;
}

function order_groups(groups) {
  groups.forEach(group => {
    group.teams.forEach(team => {
      team.wins = group.matches.filter(m => get_winner(m) == team.teamId).length;

    });
  });
}