import * as Enums from '../enums';
import * as UserService from './user';
import { get } from './fetch';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../clientConfig.js')[env];

const Queries = {
  Editions: {
    get: () => {
      return Promise
        .all([
          get(`/editions?tournamentId=${config.tournamentId}&status=${Enums.Status.PUBLISHED}`),
          get(`/editions?tournamentId=${config.tournamentId}&status=${Enums.Status.FINALIZED}`)
        ])
        .then(([published, finalized]) => published.concat(finalized))
        .then(editions => editions.map(e => {
          e.schemes = e.schemes
            .filter(s => (s.status === Enums.Status.PUBLISHED
              || s.status === Enums.Status.FINALIZED)
              && s.schemeType === Enums.SchemeType.ELIMINATION)
            .map(scheme => {
              if (scheme.groupPhase && scheme.groupPhase.status === Enums.Status.PUBLISHED)
                return scheme.groupPhase;
              else return scheme;
            });
          return e;
        }));
    }
  },
  Schemes: {
    get: (editionId) => {
      const user = UserService.getUser();
      return Promise
        .all([
          get(`/editions/${editionId}`),
          user ? get(`/users/${user.id}/enrolled`) : Promise.resolve({ enrolled: [], queue: [] })
        ])
        .then(([edition, { enrolled, queue }]) => {
          return {
            schemes: edition.schemes
              .filter(s =>
                (s.status === Enums.Status.PUBLISHED
                  || s.status === Enums.Status.FINALIZED)
                && s.schemeType === Enums.SchemeType.ELIMINATION)
              .map(scheme => {
                if (scheme.groupPhase && scheme.groupPhase.status === Enums.Status.PUBLISHED)
                  return scheme.groupPhase;
                else return scheme;
              }),
            edition: edition,
            enrolled: enrolled.concat(queue)
          }
        });
    },
    getById: (schemeId) => {
      const user = UserService.getUser();
      const userQuery = user ? 'userId=' + user.id : '';
      return get(`/schemes/${schemeId}/collect?${userQuery}`)
    }
  }
}

export default Queries;
