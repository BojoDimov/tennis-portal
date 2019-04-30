import * as Enums from './enums';

export default {
  CourtType: {
    [Enums.CourtType.CLAY]: 'клей',
    [Enums.CourtType.HARD]: 'твърда настилка',
    [Enums.CourtType.GRASS]: 'трева',
    [Enums.CourtType.INDOOR]: 'зала',
  },
  BackhandType: {
    [Enums.BackhandType.ONE]: 'с една ръка',
    [Enums.BackhandType.TWO]: 'с две ръце',
  },
  PlayStyle: {
    [Enums.PlayStyle.LEFT]: 'лява ръка',
    [Enums.PlayStyle.RIGHT]: 'дясна ръка'
  },
  Gender: {
    [Enums.Gender.FEMALE]: 'жена',
    [Enums.Gender.MALE]: 'мъж'
  }
};