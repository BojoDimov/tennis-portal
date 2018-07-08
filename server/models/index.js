const Matches = require('./matches');
const Groups = require('./groups');
const Draws = require('./draws');
const Users = require('./users');
const Enrollments = require('./enrollments');
const Rankings = require('./rankings');
const {
  EnrollmentQueues,
  SchemeEnrollments,
  GroupTeams,
  Logs,
  Tokens,
  Sets,
  Tournaments,
  TournamentEditions,
  TournamentSchemes
} = require('../db');

module.exports = {
  Tournaments, TournamentEditions, TournamentSchemes, Rankings,
  Matches, Sets, Groups, GroupTeams, Draws,
  Enrollments,
  Tokens, Users, Logs
}
//removed export of them because their usage is anti-pattern: use Enrollments instead
//SchemeEnrollments, EnrollmentQueues,