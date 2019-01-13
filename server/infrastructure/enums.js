module.exports = {
  Status: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    FINALIZED: 'finalized',
    INACTIVE: 'inactive'
  },
  SchemeType: {
    GROUP: 'round-robin',
    ELIMINATION: 'elimination'
  },
  Gender: {
    MALE: 'male',
    FEMALE: 'female'
  },
  EmailType: {
    REGISTER: 'register',
    UNREGISTER: 'unregister',
    RECOVERY: 'recovery',
    ACTIVATION: 'activation',
    CUSTOM: 'custom',
    PAYMENT_ACCEPTED: 'payment',
    NOTIFICATION: '_notification',
  },
  CourtType: {
    CLAY: 'clay',
    HARD: 'hard',
    GRASS: 'grass',
    INDOOR: 'indoor'
  },
  BackhandType: {
    ONE: '1h',
    TWO: '2h'
  },
  PlayStyle: {
    LEFT: 'left-handed',
    RIGHT: 'right-handed'
  },
  PaymentStatus: {
    UNPAID: 'unpaid',
    PENDING: 'pending',
    PAID: 'paid'
  },
  TournamentTaxes: {
    SINGLE: 25,
    DOUBLE: 30
  },
  ReservationPayment: {
    SODEXO: 'sodexo',
    MULTISPORT: 'multisport',
    ABK: 'abk',
    CASH: 'cash',
    SUBS_ZONE_1: 'zone1',
    SUBS_ZONE_2: 'zone2'
  },
  ReservationType: {
    GUEST: 'guest',
    USER: 'user',
    SUBSCRIPTION: 'subscription',

    COMPETITOR: 'competitor',
    ELDER_GROUP: 'elder',
    TENNIS_SCHOOL: 'school',
    TOURNAMENT: 'tournament',
    SERVICE: 'service'
  },
  SubscriptionType: {
    ZONE_1: 'zone1',
    ZONE_2: 'zone2'
  },
  EmailType: {
    REGISTRATION: 'registration',
    PASSWORD_RECOVERY: 'recovery',
    RESERVATION_CANCELED: 'reservation_cancel'
  },
  EmailStatus: {
    UNSENT: 'unsent',
    PENDING: 'pending',
    SENT: 'sent',
    FAILED: 'failed'
  },
  StatisticsType: {
    MONTHLY: 'month',
    DAILY: 'day'
  }
}