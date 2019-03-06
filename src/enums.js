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
  PUBLISHED: 'published'
};

// export const SchemeType = {
//   GROUP: 'round-robin',
//   ELIMINATION: 'elimination'
// };

export const BracketStatus = {
  UNDRAWN: 'undrawn',
  GROUPS_DRAWN: 'groups-in-progress',
  GROUPS_END: 'groups-finished',
  ELIMINATION_DRAWN: 'elimination-in-progress',
  ELIMINATION_END: 'elimination-finished'
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
  ABK: 'abk',
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

export const StatisticsType = {
  MONTHLY: 'month',
  DAILY: 'day'
};

export const EnumLocalization = {
  // 'SchemeType': {
  //   [SchemeType.ELIMINATION]: 'Елиминации',
  //   [SchemeType.GROUP]: 'Групи'
  // },
  'BracketStatus': {
    [BracketStatus.UNDRAWN]: 'Неизтеглена схема',
    [BracketStatus.GROUPS_DRAWN]: 'Групова фаза',
    [BracketStatus.GROUPS_END]: 'Приключила групова фаза',
    [BracketStatus.ELIMINATION_DRAWN]: 'Елиминационна фаза',
    [BracketStatus.ELIMINATION_END]: 'Приключена схема'
  },
  'StatisticsType': {
    [StatisticsType.MONTHLY]: 'Месечна',
    [StatisticsType.DAILY]: 'Дневна'
  },
  'ReservationPayment': {
    [ReservationPayment.CASH]: 'В брой',
    [ReservationPayment.SODEXO]: 'Карта "Содексо"',
    [ReservationPayment.MULTISPORT]: 'Карта "Мултиспорт"',
    [ReservationPayment.ABK]: 'Абонаментна карта (АБК)',
    [ReservationPayment.SUBS_ZONE_1]: 'Отиграване на абонамент "ЗОНА 1"',
    [ReservationPayment.SUBS_ZONE_2]: 'Отиграване на абонамент "ЗОНА 2"'
  },
  'ReservationType': {
    [ReservationType.GUEST]: 'Гост',
    [ReservationType.USER]: 'Потребител',
    [ReservationType.SUBSCRIPTION]: 'Абонат',
    [ReservationType.COMPETITOR]: 'Съзтезатели',
    [ReservationType.TENNIS_SCHOOL]: 'Тенис училище',
    [ReservationType.ELDER_GROUP]: 'Група за възрастни',
    [ReservationType.TOURNAMENT]: 'Турнир',
    [ReservationType.SERVICE]: 'Неработещо игрище',
  },
  'CustomReservationType': {
    [ReservationType.USER]: 'Резервация',
    [ReservationType.SUBSCRIPTION]: 'Абонамент'
  },
  'SubscriptionType': {
    [SubscriptionType.ZONE_1]: 'ЗОНА 1',
    [SubscriptionType.ZONE_2]: 'ЗОНА 2'
  },
  'Status': {
    [Status.DRAFT]: 'чернова',
    [Status.PUBLISHED]: 'публикувано',
    [Status.FINALIZED]: 'приключено',
    [Status.INACTIVE]: 'неактивно'
  },
  'Gender': {
    [Gender.MALE]: 'Мъж',
    [Gender.FEMALE]: 'Жена'
  },
  'CourtType': {
    [CourtType.CLAY]: 'клей',
    [CourtType.HARD]: 'твърда настилка',
    [CourtType.GRASS]: 'трева',
    [CourtType.INDOOR]: 'на закрито'
  },
  'BackhandType': {
    [BackhandType.ONE]: 'с една ръка',
    [BackhandType.TWO]: 'с две ръце'
  },
  'PlayStyle': {
    [PlayStyle.LEFT]: 'лява ръка',
    [PlayStyle.RIGHT]: 'дясна ръка'
  }
};