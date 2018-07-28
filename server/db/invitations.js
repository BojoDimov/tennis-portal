module.exports = (db, Sequelize) => {
  const Invitations = db.define("Invitations");

  Invitations.associate = (models) => {
    models.Invitations.belongsTo(models.Users, {
      as: 'inviter',
      foreignKey: {
        name: 'inviterId',
        allowNull: false,
        unique: 'Invitations_Scheme_Inviter_Invited_UQ'
      }
    });

    models.Invitations.belongsTo(models.Users, {
      as: 'invited',
      foreignKey: {
        name: 'invitedId',
        allowNull: false,
        unique: 'Invitations_Scheme_Inviter_Invited_UQ'
      }
    });

    models.Invitations.belongsTo(models.TournamentSchemes, {
      as: 'scheme',
      foreignKey: {
        name: 'schemeId',
        allowNull: false,
        unique: 'Invitations_Scheme_Inviter_Invited_UQ'
      }
    });
  }

  return Invitations;
}