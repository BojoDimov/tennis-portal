const express = require('express');
const router = express.Router();

const { SchemeEnrollments, EnrollmentQueues, TournamentSchemes, Users, Rankings, Teams, Sequelize } = require('./db');
let first = ['Петър', 'Мирослав', 'Евлоги', , 'Големан', 'Божидар', 'Даниел', 'Георги', 'Дилян', 'Борислав', 'Виктор', 'Крум', 'Мартин', 'Милен', 'Димитър', 'Симеон', 'Светослав', 'Веселин', 'Калин', 'Кристиан', 'Мариан', 'Богомил', 'Самуил', 'Тодор', 'Дарин', 'Сава', 'Маргарит', ' Пресиял', 'Павел', 'Бойко', 'Ангел', 'Асен', 'Анко', 'Янко', 'Янислав', 'Фотьо', 'Филип', 'Траян', 'Тишо'];
let last = ['Димитров', 'Чучуров', 'Гусарев', 'Карпузов', 'Георгиев', 'Измирлиев', 'Петров', 'Савов', 'Сомов', 'Томов', 'Тодоров', 'Тонев', 'Пашов', 'Конедарев', 'Молеров', 'Чакалов', 'Бакалов', 'Събев', 'Тоцев', 'Пърлев'];

const registerTeams = (req, res, next) => {
  let schemeId = req.query.schemeId;
  let count = req.query.count;
  let scheme = null;

  return TournamentSchemes
    .findById(schemeId)
    .then(scheme => {
      let enrollments = createEnrollments(schemeId, count);
      let e = [];
      if (scheme.schemeType == 'elimination')
        e = enrollments.slice(0, scheme.maxPlayerCount);
      else
        e = enrollments.slice(0, scheme.groupCount * scheme.teamsPerGroup);
      let q = enrollments.slice(e.length, enrollments.length);

      return Promise.all([
        SchemeEnrollments.bulkCreate(e),
        EnrollmentQueues.bulkCreate(q)
      ])
    })
    .then(e => res.json(e));
}

function createEnrollments(id, count) {
  let objects = [];
  for (let i = 1; i <= count; i++)
    objects.push({
      schemeId: id,
      teamId: i
    });
  return objects;
}

const createUsers = (req, res, next) => {
  let objects = [];
  let count = req.query.count;
  for (let k = 0; k < count; k++) {
    let i = Math.ceil((Math.random() * 10000000)) % first.length;
    let j = Math.ceil((Math.random() * 10000000)) % last.length;
    objects.push({
      email: "test_" + (k * 1000) + "@abv.bg",
      name: first[i] + " " + last[j],
      passwordHash: "asdasdasd",
      passwordSalt: "sadsadasd",
      birthDate: new Date(),
      telephone: "1312312",
      gender: "male"
    })
  }

  objects = objects.map(o => {

    return Teams.create({
      user1Id: -1,
      user1: o
    }, {
        include: ['user1']
      });
  });

  Promise.all(objects)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const createRanking = (req, res) => {
  let count = req.query.count;
  let t = req.query.tournamentId;

  Teams.findAll()
    .then(teams => {
      let objects = [];
      for (let i = 0; i < count; i++) {
        objects.push({
          teamId: teams[i].id,
          points: Math.ceil(Math.random() * 1000) % 500,
          tournamentId: t
        });
      }
      return Rankings.bulkCreate(objects);
    })
    .then(e => res.json(e));
}

const c = (req, res, next) => {
  Users.findAll()
    .then(users => {
      let rem = users.slice(0, req.query.count * 2);
      let teams = [];
      for (let i = 0; i < req.query.count; i += 2) {
        teams.push({
          user1Id: rem[i].id,
          user2Id: rem[i + 1].id
        });
      }

      return Teams.bulkCreate(teams);
    })
    .then(e => res.json(e));
}

const enrollDoubleTeams = (req, res, next) => {
  Teams.findAll({
    where: {
      [Sequelize.Op.not]: {
        user2Id: null
      }
    }
  })
    .then(teams => {
      let enrollments = teams.map(t => {
        return {
          teamId: t.id,
          schemeId: req.query.schemeId
        }
      });

      return TournamentSchemes
        .findById(req.query.schemeId)
        .then(scheme => {
          let e = [];
          if (scheme.schemeType == 'elimination')
            e = enrollments.slice(0, scheme.maxPlayerCount);
          else
            e = enrollments.slice(0, scheme.groupCount * scheme.teamsPerGroup);
          let q = enrollments.slice(e.length, enrollments.length);

          return Promise.all([
            SchemeEnrollments.bulkCreate(e),
            EnrollmentQueues.bulkCreate(q)
          ])
        });
    })
    .then(e => res.json(e));
}

router.get('/createUsers', createUsers);
router.get('/createRanking', createRanking);
router.get('/createEnrollments', registerTeams);
router.get('/createDoubleTeams', c);
router.get('/enrollDoubleTeams', enrollDoubleTeams);

module.exports = router;