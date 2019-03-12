const {
  sequelize,
  Schemes,
  Matches,
  Groups,
  GroupTeams,
  Teams,
  Users,
  Rankings
} = require('../db');
const { BracketStatus } = require('../infrastructure/enums');
const Enrollments = require('../enrollment/enrollment.service');
const Bracket = require('./bracketFunctions');
const MatchService = require('../match/match.service');
const { getWinner, getStatsFromMatch } = require('../match/match.functions');

class SchemeService {
  async get(id) {
    return await Schemes.findById(id, {
      include: [
        'edition'
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
    model.ageTo = parseInt(model.ageFrom) || null;
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

  async drawBracket(scheme) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const teams = await Enrollments.getPlayers(scheme);

      if (scheme.bracketStatus == BracketStatus.UNDRAWN && scheme.hasGroupPhase) {
        //draw group phase
        scheme.bracketStatus = BracketStatus.GROUPS_DRAWN;
        await scheme.save({ transaction });
        for (const group of Bracket.drawGroups(scheme, scheme.seed, teams)) {
          await Groups.create(group, {
            include: [{ model: GroupTeams, as: 'teams' }],
            transaction
          });
        }
      }
      else if (scheme.bracketStatus == BracketStatus.UNDRAWN && !scheme.hasGroupPhase) {
        //draw elimination phase
        scheme.bracketStatus = BracketStatus.ELIMINATION_DRAWN;
        await scheme.save();
        let matches = Bracket.drawEliminations(scheme, scheme.seed, teams);
        await Matches.bulkCreate(matches, { transaction });
      }
      else if (scheme.bracketStatus == BracketStatus.GROUPS_END) {
        //draw elimination from groups
        const data = await MatchService.getGroupMatches(scheme);
        const groups = data.map(group => {
          return {
            team1: group.teams[0].team,
            team2: group.teams[1].team
          }
        });

        Bracket.fillGroups(groups);
        const matches = Bracket.drawEliminationsFromGroups(groups, scheme.id);
        await Matches.bulkCreate(matches, { transaction });
        await scheme.update({ bracketStatus: BracketStatus.ELIMINATION_DRAWN }, { transaction });
      }
      else if (scheme.bracketStatus == BracketStatus.GROUPS_DRAWN)
        await scheme.update({ bracketStatus: BracketStatus.GROUPS_END }, { transaction });
      else if (scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN)
        await scheme.update({ bracketStatus: BracketStatus.ELIMINATION_END }, { transaction });
      else
        throw { name: 'DomainActionError', error: 'invalidState' };

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

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
          score: 1
        };

      if (match.team2Id && !teams[match.team2Id])
        teams[match.team2Id] = {
          team: match.team2,
          score: scheme.pPoints
        };
    });

    for (let teamId in teamStats) {
      teams[teamId].score += teamStats[teamId].wonMatches * scheme.wPoints;
    }

    let tournamentWinner = null;
    let finale = matches.find(match => match.match && match.round && (match.sets.length > 0 || match.withdraw));
    if (finale)
      tournamentWinner = getWinner(finale);

    if (tournamentWinner)
      teams[tournamentWinner].score += scheme.cPoints;

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