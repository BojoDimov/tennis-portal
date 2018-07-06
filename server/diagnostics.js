const express = require('express');
const router = express.Router();

const { SchemeEnrollments, EnrollmentQueues, TournamentSchemes, Users, Rankings } = require('./db');
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
      userId: i
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
      fullname: first[i] + " " + last[j],
      passwordHash: "asdasdasd",
      passwordSalt: "sadsadasd",
      birthDate: new Date(),
      telephone: "1312312",
      gender: "male"
    })
  }

  Users.bulkCreate(objects)
    .then(e => res.json(e))
    .catch(err => next(err, req, res, null));
}

const createRanking = (req, res) => {
  let count = req.query.count;
  let t = req.query.tournamentId;

  Users.findAll()
    .then(users => {
      let objects = [];
      for (let i = 0; i < count; i++) {
        objects.push({
          userId: users[i].id,
          points: Math.ceil(Math.random() * 1000) % 500,
          tournamentId: t
        });
      }
      return Rankings.bulkCreate(objects);
    })
    .then(e => res.json(e));
}

router.get('/createUsers', createUsers);
router.get('/createRanking', createRanking);
router.get('/createEnrollments', registerTeams);

module.exports = router;