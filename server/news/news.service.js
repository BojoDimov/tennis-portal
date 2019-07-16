const { News, sequelize } = require('../db');

class NewsService {
  get(id) {
    return News
      .findById(id, {
        include: [{ model: News, as: 'subsections' }],
        order: [['subsections', 'order', 'asc']]
      });
  }

  getAll(options) {
    return News
      .findAll({
        where: {
          parentId: null
        },
        order: ['createdAt', 'desc'],
        limit: options.limit,
        offset: options.limit
      });
  }

  create(model) {
    return News
      .create(model, { include: 'subsections' });
  }

  update(model) {
    return sequelize((trn) => {
      //The updated news must be root, or it will throw.
      //If you want to update subsection, you should update it through the root.
      return News
        .findOne({
          where: {
            id: model.id,
            parentId: null
          },
          include: [{ model: News, as: 'subsections' }]
        })
        .then(news => {
          if (!news)
            throw null;

          let added = model.subsections.filter(e => !e.id);
          let changed = model.subsections.filter(e => e.id);
          let deleted = news.subsections
            .filter(e => !model.subsections.find(ss => ss.id == e.id))
            .map(e => e.id);

          return Promise.all([
            //add subsections
            News.bulkCreate(added, { transaction: trn }),
            //update subsections
            changed.map(e => news.subsections.find(ss => ss.id == e.id).update(e, { transaction: trn })),
            //delete subsections
            News.destroy({ where: { id: deleted }, transaction: trn }),
            //update root news
            news.update(model, { transaction: trn }),
          ]);
        });
    });
  }

  delete(id) {
    return sequelize((trn) => {
      //We can delete only root news with this method.
      //If you want to delete subsection use update.
      return News
        .findOne({
          where: {
            id: model.id,
            parentId: null
          },
          include: [{ model: News, as: 'subsections' }]
        })
        .then(news => {
          if (!news)
            throw null;

          return News.destroy({
            where: {
              id: news.subsections.map(ss => ss.id)
            }
          });
        });
    });
  }
}

module.exports = new NewsService();