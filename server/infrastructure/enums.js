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
    CASH: 'cash',
    COMPETITOR: 'competitor'
  },
  ReservationType: {
    GUEST: 'guest',
    TENNIS_SCHOOL: 'school',
    USER: 'user',
    COMPETITOR: 'competitor',
    ELDER_GROUP: 'elder',
    TOURNAMENT: 'tournament',
    SERVICE: 'service'
  }
}