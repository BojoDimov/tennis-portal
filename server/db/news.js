module.exports = (db, Sequelize) => {
  const News = db.define("News", {
    heading: Sequelize.TEXT,
    subject: Sequelize.TEXT,
    body: Sequelize.TEXT,
    author: { type: Sequelize.STRING, allowNull: true }
  });

  News.associate = function (models) {
    models.News.belongsTo(models.News, {
      as: 'parent',
      foreignKey: {
        name: 'parentId',
        allowNull: true
      }
    });

    models.News.hasMany(models.News, {
      as: 'subsections',
      foreignKey: {
        name: 'parentId',
        allowNull: true
      }
    });

    models.News.belongsTo(models.Files, {
      as: 'image',
      foreignKey: {
        name: 'fileId',
        allowNull: true
      }
    });
  }

  return News;
}