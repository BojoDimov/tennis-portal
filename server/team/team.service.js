const { Teams, Users, sequelize } = require('../db');
const UserService = require('../user/user.service');

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

  get(userId) {
    return Teams.findOne({
      where: {
        user1Id: userId,
        user2Id: null
      }
    });
  }

  create(model) {
    return Teams.create(model);
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