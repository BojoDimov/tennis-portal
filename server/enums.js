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
    PAYMENT_ACCEPTED: 'payment'
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
  }
}