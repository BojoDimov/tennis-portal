const UserService = require('./user/user.service');
console.log(UserService);

var scra = { a: 1, b: 2, c: 3 };
function prr() {
  console.log(arguments);
}

//prr(scra.a, scra.b, scra.c);

const db = require('./db');
db.sequelize.sync({ force: false }).then(() => console.log('Db sync is finished!'));

// const errors = {
//   email: ['wazza'],
//   password: ['prr', 'scraa'],
//   confirmPassword: [],
//   firstName: [],
//   lastName: [],
//   telephone: [],
//   birthDate: [],
//   gender: [],
//   startedPlaying: [],
//   playStyle: [],
//   backhandType: [],
//   courtType: ['invalid']
// };

// let errCount = Object.keys(errors).reduce((curr, next) => curr + errors[next].length, 0);
// console.log(errCount);