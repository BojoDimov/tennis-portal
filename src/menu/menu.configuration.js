import BuildRoundedIcon from '@material-ui/icons/BuildRounded';
import ViewQuiltRoundedIcon from '@material-ui/icons/ViewQuiltRounded';
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded';
import PersonIcon from '@material-ui/icons/Person';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

export const desktopRoutes = [
  { id: 1, to: '/schedule', name: 'График', Icon: CalendarTodayIcon },
  { id: 2, to: '/editions', name: 'Турнири', faIcon: 'trophy' }
];

export const adminRoutes = [
  { id: 4, to: '/admin/users', name: 'Потребители', Icon: PersonIcon },
  { id: 5, to: '/admin/seasons', name: 'Сезони', Icon: WbSunnyRoundedIcon },
  { id: 6, to: '/admin/courts', name: 'Кортове', Icon: ViewQuiltRoundedIcon },
  { id: 7, to: '/admin/statistics', name: 'Справки', Icon: AssessmentIcon }
];

export const tournamentAdditional = [
  { id: 8, to: '/players', name: 'Играчи', faIcon: 'user-friends' },
  { id: 9, to: '/leagues', name: 'Ранглисти', faIcon: 'list-ol' },
  //{ id: 10, to: '/champions', name: 'Шампиони', faIcon: 'medal' },
];

export const userRoutes = [
  { id: 3, to: '/account', name: 'Профил', Icon: PersonIcon }
];