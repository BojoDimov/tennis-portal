const { initStats, getStatsFromMatch } = require('../match/match.functions');

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

  group.teams.forEach(groupTeam => initStats(teamsMap, groupTeam.teamId));
  group.matches && group.matches.forEach(match => getStatsFromMatch(teamsMap, match));

  group.teams.forEach(groupTeam => {
    groupTeam.stats = teamsMap[groupTeam.teamId];
    groupTeam.dataValues.stats = teamsMap[groupTeam.teamId]; //serialization fixup
  });
}

module.exports = { fixOrder, statsComparer, generateStats, getStatsFromMatch };