const { getWinner } = require('../match/match.functions');

async function fixOrder(group, transaction) {
  generateStats(group);
  group.teams.sort(statsComparer);

  for (let i = 0; i < group.teams.length; i++) {
    group.teams[i].order = i + 1;
    await group.teams[i].save({ transaction });
  }
}

function statsComparer(gt1, gt2) {
  const t1MatchScore = gt1.stats.wonMatches / (gt1.stats.totalMatches || 1),
    t2MatchScore = gt2.stats.wonMatches / (gt2.stats.totalMatches || 1),
    t1SetScore = gt1.stats.wonSets / (gt1.stats.totalSets || 1),
    t2SetScore = gt2.stats.wonSets / (gt2.stats.totalSets || 1),
    t1GameScore = gt1.stats.wonGames / (gt1.stats.totalGames || 1),
    t2GameScore = gt2.stats.wonGames / (gt2.stats.totalGames || 1);

  if (t1MatchScore == t2MatchScore) {
    if (t1SetScore == t2SetScore)
      return t2GameScore - t1GameScore;
    else
      return t2SetScore - t1SetScore;
  }
  else return t2MatchScore - t1MatchScore;
}

function generateStats(group) {
  const teamsMap = [];

  initStats = () => ({
    wonMatches: 0,
    totalMatches: 0,
    wonSets: 0,
    totalSets: 0,
    wonGames: 0,
    totalGames: 0
  });

  group.teams.forEach(groupTeam => teamsMap[groupTeam.teamId] = initStats());
  group.matches && group.matches.forEach(match => {
    const winner = getWinner(match);
    if (!winner)
      return;

    const setsCount = match.sets.length;
    const gamesCount = match.sets.reduce((acc, current) => acc + current.team1 + current.team2, 0);

    //won matches
    teamsMap[winner].wonMatches++;

    //total matches
    teamsMap[match.team1Id].totalMatches++;
    teamsMap[match.team2Id].totalMatches++;

    //won sets
    teamsMap[match.team1Id].wonSets += match.sets.filter(set => set.team1 > set.team2).length;
    teamsMap[match.team2Id].wonSets += match.sets.filter(set => set.team2 > set.team1).length;

    //total sets
    teamsMap[match.team1Id].totalSets += setsCount;
    teamsMap[match.team2Id].totalSets += setsCount;

    //won games
    teamsMap[match.team1Id].wonGames +=
      match.sets.reduce((acc, current) => acc + current.team1, 0);
    teamsMap[match.team2Id].wonGames +=
      match.sets.reduce((acc, current) => acc + current.team2, 0);

    //total games
    teamsMap[match.team1Id].totalGames += gamesCount;
    teamsMap[match.team2Id].totalGames += gamesCount;
  });

  group.teams.forEach(groupTeam => {
    groupTeam.stats = teamsMap[groupTeam.teamId];
    groupTeam.dataValues.stats = teamsMap[groupTeam.teamId]; //serialization fixup
  });
}

module.exports = { fixOrder, statsComparer, generateStats };