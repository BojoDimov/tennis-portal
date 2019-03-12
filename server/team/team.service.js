const { Teams, Users, sequelize } = require('../db');
const UserService = require('../user/user.service');
const { Gender } = require('../infrastructure/enums');

class TeamsService {
  getAll() {
    return Teams
      .findAll({
        include: [
          { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
          { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
        ]
      });
  }

  async get(id) {
    const team = await Teams.findById(id, {
      include: [
        { model: Users, as: 'user1', attributes: ['id', 'name', 'startedPlaying', 'playStyle', 'backhandType', 'courtType'] },
        { model: Users, as: 'user2', attributes: ['id', 'name', 'startedPlaying', 'playStyle', 'backhandType', 'courtType'] }
      ]
    });

    if (!team)
      throw { name: 'NotFound' };
    return team;
  }

  getUserTeam(userId) {
    return Teams.findOne({
      where: {
        user1Id: userId,
        user2Id: null
      },
      include: [
        { model: Users, as: 'user1', attributes: ['id', 'name', 'email', 'birthDate', 'gender'] },
        { model: Users, as: 'user2', attributes: ['id', 'name', 'email', 'birthDate', 'gender'] }
      ]
    });
  }

  async findOrCreate(model, transaction) {
    let user1Id = model.user1.id;
    let user2Id = (model.user2 || { id: null }).id;

    if (model.user2
      && model.user1.gender == Gender.FEMALE
      && model.user2.gender == Gender.MALE
    ) {
      let temp = user2Id;
      user2Id = user1Id;
      user1Id = temp;
    }

    const existingTeam = await Teams.findOne({
      where: { user1Id, user2Id },
      include: [
        { model: Users, as: 'user1', attributes: ['gender', 'birthDate'] },
        { model: Users, as: 'user2', attributes: ['gender', 'birthDate'] }
      ],
      transaction
    });

    if (existingTeam)
      return existingTeam;
    else {
      await Teams.create({ user1Id, user2Id }, { transaction });
      return await Teams.findOne({
        where: { user1Id, user2Id },
        include: [
          { model: Users, as: 'user1', attributes: ['gender', 'birthDate'] },
          { model: Users, as: 'user2', attributes: ['gender', 'birthDate'] }
        ],
        transaction
      });
    }
  }

  delete(id) {
    return sequelize.transaction((trn) => {
      return Teams
        .findById(id)
        .then(team => {
          if (!team)
            return;
          if (team.user1Id && team.user2Id)
            return Teams.destroy({ where: { id: id } });
          else return UserService.delete(team.user1Id);
        });
    });
  };
}

module.exports = new TeamsService();