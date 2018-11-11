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
  SODEXO: 'sodexo',
  MULTISPORT: 'multisport',
  CASH: 'cash',
  SUBS_ZONE_1: 'zone1',
  SUBS_ZONE_2: 'zone2'
}

export const ReservationType = {
  GUEST: 'guest',
  USER: 'user',
  SUBSCRIPTION: 'subscription',
  COMPETITOR: 'competitor',
  ELDER_GROUP: 'elder',
  TENNIS_SCHOOL: 'school',
  TOURNAMENT: 'tournament',
  SERVICE: 'service',
};

export const SubscriptionType = {
  ZONE_1: 'zone1',
  ZONE_2: 'zone2'
};

export const EnumLocalization = {
  'ReservationPayment': {
    CASH: 'В брой',
    SODEXO: 'Карта "Содексо"',
    MULTISPORT: 'Карта "Мултиспорт"',
    SUBS_ZONE_1: 'Абонамент "ЗОНА 1"',
    SUBS_ZONE_2: 'Абонамент "ЗОНА 2"'
  },
  'ReservationType': {
    GUEST: 'Гост',
    USER: 'Потребител',
    SUBSCRIPTION: 'Абонат',
    COMPETITOR: 'Съзтезатели',
    TENNIS_SCHOOL: 'Тенис училище',
    ELDER_GROUP: 'Група за възрастни',
    TOURNAMENT: 'Турнир',
    SERVICE: 'Неработещо игрище',
  },
  'CustomReservationType': {
    USER: 'Резервация',
    SUBSCRIPTION: 'Абонамент'
  },
  'SubscriptionType': {
    ZONE_1: 'ЗОНА 1',
    ZONE_2: 'ЗОНА 2'
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