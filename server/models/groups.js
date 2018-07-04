const { Groups } = require('../db');

/**
 * Order by wins, setsScore, gamesScore
 */
Groups.orderByStatistics = function (group) {
  group.teams = group.teams.map(team => {
    let statistics = group.matches.filter(match => match.team1Id == team.teamId
      || match.team2Id == team.teamId)
      .map(match => Matches.getMatchStatistics(match, team.teamId));

    team.wins = statistics.filter(s => s.isWinner).length;
    team.totalSets = statistics.reduce((acc, next) => acc + next.sets, 0);
    team.totalSetsWon = statistics.reduce((acc, next) => acc + next.setsWon, 0);
    team.totalGames = statistics.reduce((acc, next) => acc + next.games, 0);
    team.totalGamesWon = statistics.reduce((acc, next) => acc + next.gamesWon, 0);
    team.setsScore = (team.totalSets != 0 ? team.totalSetsWon / team.totalSets : 0);
    team.gamesScore = (team.totalGames != 0 ? team.totalGamesWon / team.totalGames : 0);

    return team;
  });

  group.teams.sort((t1, t2) => {
    if (t1.wins == t2.wins) {
      if (t1.setsScore == t2.setsScore)
        return t2.gamesScore - t1.gamesScore;
      else
        return t2.setsScore - t1.setsScore;
    }
    else return t2.wins - t1.wins;
  });
  return group;
}

module.exports = Groups;