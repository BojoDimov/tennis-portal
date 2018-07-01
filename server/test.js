const DrawActions = require('./logic/drawActions');
const MatchActions = require('./logic/matchActions');
const getDrawData = require('./controllers/schemes')._get_draw_data;

const { TournamentSchemes, db } = require('./sequelize.config');

let groups = [
  { team1: 'A1', team2: 'A2' },
  { team1: 'B1', team2: 'B2' },
  { team1: 'C1', team2: 'C2' },
  { team1: 'D1', team2: 'D2' },
  { team1: 'E1', team2: 'E2' }
];

groups = DrawActions._fill_groups(groups);
let matches = DrawActions._draw_eliminations_from_groups(groups);

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


TournamentSchemes
  .findById(4)
  .then(scheme => getDrawData(scheme, null, false))
  .then(draw => {
    let simpleStats = draw.data[0].teams.map(team => {
      let statistics = draw.data[0].matches.filter(match => match.team1Id == team.teamId
        || match.team2Id == team.teamId)
        .map(match => MatchActions.getMatchStatistics(match, team.teamId));

      team.wins = statistics.filter(s => s.isWinner).length;
      team.totalSets = statistics.reduce((acc, next) => acc + next.sets, 0);
      team.totalSetsWon = statistics.reduce((acc, next) => acc + next.setsWon, 0);
      team.totalGames = statistics.reduce((acc, next) => acc + next.games, 0);
      team.totalGamesWon = statistics.reduce((acc, next) => acc + next.gamesWon, 0);
      team.setsScore = (team.totalSets != 0 ? team.totalSetsWon / team.totalSets : 0);
      team.gamesScore = (team.totalGames != 0 ? team.totalGamesWon / team.totalGames : 0);

      return {
        name: team.User.fullname,
        teamId: team.teamId,
        wins: team.wins,
        totalSets: team.totalSets,
        totalSetsWon: team.totalSetsWon,
        setsScore: team.setsScore,
        totalGames: team.totalGames,
        totalGamesWon: team.totalGamesWon,
        gamesScore: team.gamesScore
      }
    });

    // If compareFunction(a, b) is greater than 0, sort b to an index 
    // lower than a, i.e.b comes first.
    simpleStats.sort((t1, t2) => {
      if (t1.wins == t2.wins) {
        if (t1.setsScore == t2.setsScore)
          return t2.gamesScore - t1.gamesScore;
        else
          return t2.setsScore - t1.setsScore;
      }
      else return t2.wins - t1.wins;
    });
    console.log(simpleStats);
  });