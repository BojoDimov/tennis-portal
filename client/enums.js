export const ApplicationMode = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin'
};

export const RouteTypeEnum = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  ADMIN: 'admin'
};

export const Gender = {
  MALE: 'male',
  FEMALE: 'female'
};

export const Status = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  FINALIZED: 'finalized',
  INACTIVE: 'inactive'
};

export const SchemeType = {
  GROUP: 'round-robin',
  ELIMINATION: 'elimination'
};

export const CourtType = {
  CLAY: 'clay',
  HARD: 'hard',
  GRASS: 'grass',
  INDOOR: 'indoor'
};

export const BackhandType = {
  ONE: '1h',
  TWO: '2h'
};

export const PlayStyle = {
  LEFT: 'left-handed',
  RIGHT: 'right-handed'
};

export const ReservationPayment = {
  CASH: 'cash',
  SODEXO: 'sodexo',
  MULTISPORT: 'multisport',
  COMPETITOR: 'competitor'
}

export const ReservationType = {
  GUEST: 'guest',
  TENNIS_SCHOOL: 'school',
  USER: 'user',
  COMPETITOR: 'competitor',
  ELDER_GROUP: 'elder',
  TOURNAMENT: 'tournament',
  SERVICE: 'service',
  SUBSCRIPTION: 'subscription'
};

export const EnumLocalization = {
  'ReservationPayment': {
    CASH: 'В брой',
    SODEXO: 'Карта "Судексо"',
    MULTISPORT: 'Карта "Мултиспорт"',
    COMPETITOR: 'Съзтезател'
  },
  'ReservationType': {
    GUEST: 'Гост',
    TENNIS_SCHOOL: 'Тенис училище',
    USER: 'Потребител',
    COMPETITOR: 'Съзтезател',
    ELDER_GROUP: 'Групи за възрастни',
    TOURNAMENT: 'Турнир',
    SERVICE: 'Служебен час',
    SUBSCRIPTION: 'Абонамент'
  },
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