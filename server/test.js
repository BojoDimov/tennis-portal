let first = ['Петър', 'Мирослав', 'Божидар', 'Даниел', 'Георги', 'Дилян', 'Борислав', 'Виктор', 'Крум', 'Мартин', 'Милен', 'Димитър', 'Симеон', 'Светослав', 'Веселин', 'Калин', 'Кристиан', 'Мариан', 'Богомил', 'Самуил', 'Тодор'];
let last = ['Димитров', 'Чучуров', 'Гусарев', 'Карпузов', 'Георгиев', 'Измирлиев', 'Петров', 'Савов', 'Сомов', 'Томов', 'Тодоров', 'Тонев', 'Пашов', 'Конедарев', 'Молеров', 'Чакалов', 'Бакалов', 'Събев', 'Тоцев', 'Пърлев'];

const { db, Rankings } = require('./sequelize.config');
const Users = db.import(__dirname + '/db/users.js');
let objects = [];
let count = 200;

for (let k = 0; k < count; k++) {
  let i = Math.ceil((Math.random() * 10000000)) % first.length;
  let j = Math.ceil((Math.random() * 10000000)) % last.length;
  objects[k] = {
    email: "test_" + k + "@abv.bg",
    fullname: first[i] + " " + last[i],
    passwordHash: "asdasdasd",
    passwordSalt: "sadsadasd",
    age: 23,
    telephone: "1312312",
    gender: "male"
  }
}

// Users.bulkCreate(objects)
//   .then(res => {
//     console.log('Created ' + res.length + " users")
//     process.exit();
//   });


Users.findAll()
  .then(users => {
    let rankings = users.map(user => {
      return {
        userId: user.id,
        tournamentId: 1,
        points: Math.ceil(Math.random() * 500) % 500
      }
    });
    Rankings.bulkCreate(rankings)
      .then(res => console.log('Created ' + rankings.length + ' rankings for tournament 1'));
  });