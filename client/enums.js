export const RouteTypeEnum = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  ADMIN: 'admin'
};

export const Gender = {
  MALE: 'male',
  FEMALE: 'female'
}

export const Status = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  FINALIZED: 'finalized',
  INACTIVE: 'inactive'
}

export const SchemeType = {
  GROUP: 'round-robin',
  ELIMINATION: 'elimination'
}

export const CourtType = {
  CLAY: 'clay',
  HARD: 'hard',
  GRASS: 'grass',
  INDOOR: 'indoor'
}

export const BackhandType = {
  ONE: '1h',
  TWO: '2h'
}

export const PlayStyle = {
  LEFT: 'left-handed',
  RIGHT: 'right-handed'
}

export const EnumLocalization = {
  'Status': {
    DRAFT: 'чернова',
    PUBLISHED: 'публикуван',
    FINALIZED: 'приключен',
    INACTIVE: 'неактивен'
  },
  'Gender': {
    MALE: 'Мъж',
    FEMALE: 'Жена'
  },
  'CourtType': {
    CLAY: 'клей',
    HARD: 'твърда настилка',
    GRASS: 'трева',
    INDOOR: 'на закрито'
  },
  'BackhandType': {
    ONE: 'с една ръка',
    TWO: 'с две ръце'
  },
  'PlayStyle': {
    LEFT: 'лява ръка',
    RIGHT: 'дясна ръка'
  }
};