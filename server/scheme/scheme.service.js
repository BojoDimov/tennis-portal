const {
  sequelize,
  Schemes,
  Editions,
  Matches,
  Groups,
  GroupTeams,
  Teams,
  Users,
  Rankings,
  Sets
} = require('../db');
const { BracketStatus } = require('../infrastructure/enums');
const Enrollments = require('../enrollment/enrollment.service');
const Bracket = require('./bracketFunctions');
const MatchService = require('../match/match.service');
const TeamService = require('../team/team.service');
const { getWinner, getStatsFromMatch } = require('../match/match.functions');

class SchemeService {
  async get(id) {
    return await Schemes.findById(id, {
      include: [
        {
          model: Editions,
          as: 'edition',
          include: ['tournament']
        },
        {
          model: Matches,
          as: 'matches',
          include: MatchService.matchesIncludes()
        }
      ],
      order: [
        [{ model: Matches, as: 'matches' }, 'round', 'desc'],
        [{ model: Matches, as: 'matches' }, 'match', 'desc'],
        [{ model: Matches, as: 'matches' }, { model: Sets, as: 'sets' }, 'order', 'asc']
      ]
    });
  }

  async create(model) {
    this.formatModel(model);
    this.validateModel(model);
    this.processModel(model);

    return await Schemes.create(model);
  }

  async update(scheme, model) {
    this.formatModel(model);
    this.validateModel(model);
    this.processModel(model);

    return await scheme.update(model);
  }

  async delete(id) {
    const scheme = await this.get(id);
    if (!scheme)
      throw { name: 'NotFound' };
    await Schemes.destroy({ where: { id: scheme.id } });
  }

  formatModel(model) {
    model.ageFrom = parseInt(model.ageFrom) || null;
    model.ageTo = parseInt(model.ageTo) || null;
    model.maxPlayerCount = parseInt(model.maxPlayerCount) || null;
    model.groupCount = parseInt(model.groupCount) || null;
    model.teamsPerGroup = parseInt(model.teamsPerGroup) || null;
    model.seed = parseInt(model.seed) || null;
  }

  validateModel(model) {

  }

  processModel(model) {
    if (model.hasGroupPhase)
      model.maxPlayerCount = model.groupCount * model.teamsPerGroup;
  }

  async previewEliminationPhase(scheme) {
    let teams = [];
    if (scheme.bracketStatus == BracketStatus.UNDRAWN && !scheme.hasGroupPhase)
      teams = Enrollments.getPlayers(scheme);
    else if (scheme.bracketStatus == BracketStatus.GROUPS_END) {
      const data = await MatchService.getGroupMatches(scheme);
      teams = data.reduce((acc, curr) => acc.concat(curr.teams), []);
      teams.sort((a, b) => a.order - b.order);
    }
    else
      throw { name: 'DomainActionError', error: 'invalidState' };

    return teams;
  }

  async drawEliminationPhase(scheme, teams) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      teams = teams.filter(team => team.order);
      scheme.bracketRounds = Math.ceil(Math.log2(teams.length));
      scheme.bracketStatus = BracketStatus.ELIMINATION_DRAWN;
      await scheme.save({ transaction });

      let matches = Bracket.drawEliminations(scheme, scheme.seed, teams);
      await Matches.bulkCreate(matches, { transaction });

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async drawGroupPhase(scheme) {
    if (scheme.bracketStatus != BracketStatus.UNDRAWN || !scheme.hasGroupPhase)
      throw { name: 'DomainActionError', error: 'invalidState' };

    let transaction;
    try {
      transaction = await sequelize.transaction();

      const teams = await Enrollments.getPlayers(scheme);
      scheme.bracketStatus = BracketStatus.GROUPS_DRAWN;
      await scheme.save({ transaction });
      for (const group of Bracket.drawGroups(scheme, scheme.seed, teams)) {
        await Groups.create(group, {
          include: [{ model: GroupTeams, as: 'teams' }],
          transaction
        });
      }

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async finishPhase(scheme) {
    if (scheme.bracketStatus == BracketStatus.GROUPS_DRAWN)
      scheme.bracketStatus = BracketStatus.GROUPS_END;
    else if (scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN) {
      scheme.bracketStatus = BracketStatus.ELIMINATION_END;
      scheme.finalId = scheme.matches[0].id;
    }
    else
      throw { name: 'DomainActionError', error: 'invalidState' };
    await scheme.save();
  }

  // async drawBracket(scheme, data) {
  //   let transaction;
  //   try {
  //     transaction = await sequelize.transaction();
  //     const teams = await Enrollments.getPlayers(scheme);

  //     if (scheme.bracketStatus == BracketStatus.UNDRAWN && scheme.hasGroupPhase) {
  //       //draw group phase
  //       scheme.bracketStatus = BracketStatus.GROUPS_DRAWN;
  //       await scheme.save({ transaction });
  //       for (const group of Bracket.drawGroups(scheme, scheme.seed, teams)) {
  //         await Groups.create(group, {
  //           include: [{ model: GroupTeams, as: 'teams' }],
  //           transaction
  //         });
  //       }
  //     }
  //     else if (scheme.bracketStatus == BracketStatus.UNDRAWN && !scheme.hasGroupPhase) {
  //       //draw elimination phase
  //       scheme.bracketStatus = BracketStatus.ELIMINATION_DRAWN;
  //       await scheme.save();
  //       let matches = Bracket.drawEliminations(scheme, scheme.seed, teams);
  //       await Matches.bulkCreate(matches, { transaction });
  //     }
  //     else if (scheme.bracketStatus == BracketStatus.GROUPS_END) {
  //       //draw elimination from groups
  //       const data = await MatchService.getGroupMatches(scheme);
  //       let groups = data.map(group => {
  //         return {
  //           team1: group.teams[0].team,
  //           team2: group.teams[1].team
  //         }
  //       });

  //       groups = Bracket.fillGroups(groups);
  //       const matches = Bracket.drawEliminationsFromGroups(groups, scheme.id);
  //       await Matches.bulkCreate(matches, { transaction });
  //       await scheme.update({ bracketStatus: BracketStatus.ELIMINATION_DRAWN }, { transaction });
  //     }
  //     else if (scheme.bracketStatus == BracketStatus.GROUPS_DRAWN)
  //       await scheme.update({ bracketStatus: BracketStatus.GROUPS_END }, { transaction });
  //     else if (scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN)
  //       await scheme.update({ bracketStatus: BracketStatus.ELIMINATION_END }, { transaction });
  //     else
  //       throw { name: 'DomainActionError', error: 'invalidState' };

  //     await transaction.commit();
  //   }
  //   catch (err) {
  //     await transaction.rollback();
  //     throw err;
  //   }
  // }

  async getScore(scheme) {
    if (scheme.bracketStatus != BracketStatus.ELIMINATION_END)
      throw { name: 'DomainActionError', error: {} };

    const matches = await Matches.findAll({
      where: {
        schemeId: scheme.id
      },
      include: MatchService.matchesIncludes(),
      order: [['round', 'desc'], ['match', 'desc']]
    });

    const teamStats = [];
    const teams = [];
    matches.forEach(match => getStatsFromMatch(teamStats, match));
    matches.forEach(match => {
      if (match.team1Id && !teams[match.team1Id])
        teams[match.team1Id] = {
          team: match.team1,
          score: scheme.pPoints,
          wonMatches: 0,
          totalMatches: 0,
          isWinner: false
        };

      if (match.team2Id && !teams[match.team2Id])
        teams[match.team2Id] = {
          team: match.team2,
          score: scheme.pPoints,
          wonMatches: 0,
          totalMatches: 0,
          isWinner: false
        };
    });

    for (let teamId in teamStats) {
      teams[teamId].score += teamStats[teamId].wonMatches * scheme.wPoints;
      teams[teamId].wonMatches += teamStats[teamId].wonMatches;
      teams[teamId].totalMatches += teamStats[teamId].totalMatches;
    }

    let tournamentWinner = null;
    let finale = matches.find(match => match.round == scheme.bracketSize);
    if (finale)
      tournamentWinner = finale.winnerId;//getWinner(finale);

    if (tournamentWinner) {
      teams[tournamentWinner].score += scheme.cPoints;
      teams[tournamentWinner].isWinner = true;
    }

    teams.sort((a, b) => b.score - a.score);
    return teams.filter(e => e);
  }

  async saveScore(scheme, scores) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const rankings = await Rankings.findAll({
        where: {
          tournamentId: scheme.edition.tournamentId
        }
      });

      for (let i = 0; i < scores.length; ++i) {
        const ranking = rankings.find(e => e.teamId == scores[i].team.id);
        const team = await Teams.findById(scores[i].team.id);
        if (!ranking)
          await Rankings.create({
            tournamentId: scheme.edition.tournamentId,
            teamId: scores[i].team.id,
            points: scores[i].score
          }, { transaction });
        else {
          ranking.points += scores[i].score;
          await ranking.save({ transaction });
        }

        team.wonMatches += scores[i].wonMatches;
        team.totalMatches += scores[i].totalMatches;
        team.wonTournaments += (scores[i].isWinner ? 1 : 0);
        team.totalTournaments += 1;
        TeamService.calculateCoefficients(team);
        await team.save({ transaction });
      }

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new SchemeService();