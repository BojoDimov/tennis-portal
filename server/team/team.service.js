const { Teams, Users, sequelize } = require('../db');
const { Gender } = require('../infrastructure/enums');

class TeamsService {
  getAll(filter) {
    let options = {
      limit: (filter.limit | 25),
      offset: (filter.offset | 0),
      include: [
        { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
        { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
      ]
    };

    if (filter.searchTerm) {
      options.where = {
        [sequelize.Op.or]: {
          '$user1.name$': {
            [sequelize.Op.iLike]: '%' + filter.searchTerm + '%'
          },
          '$user2.name$': {
            [sequelize.Op.iLike]: '%' + filter.searchTerm + '%'
          },
          '$user1.email$': {
            [sequelize.Op.iLike]: '%' + filter.searchTerm + '%'
          },
          '$user2.email$': {
            [sequelize.Op.iLike]: '%' + filter.searchTerm + '%'
          }
        }
      }
    }

    return Teams.findAndCountAll(options);
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

  async update(id, model) {
    let entity = await Teams.findById(id);
    if (!entity)
      throw { name: 'NotFound' };
    else
      return await entity.update(model);
  }

  // delete(id) {
  //   return sequelize.transaction((trn) => {
  //     return Teams
  //       .findById(id)
  //       .then(team => {
  //         if (!team)
  //           return;
  //         if (team.user1Id && team.user2Id)
  //           return Teams.destroy({ where: { id: id } });
  //         else return UserService.delete(team.user1Id);
  //       });
  //   });
  // };
}

module.exports = new TeamsService();