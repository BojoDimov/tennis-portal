import React from 'react';

import { ApplicationMode, ReservationType } from '../../enums';
import UserService from '../../services/user.service';
import AdminReservation from './AdminReservation';
import UserReservation from './UserReservation';
import GuestReservation from './GuestReservation';

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: (UserService.getUser() || { id: null }).id
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mode != this.props.mode)
      this.setState({ userId: (UserService.getUser() || { id: null }).id });
  }

  render() {
    const { reservation, mode } = this.props;
    const available = reservation.hour <= reservation.court.workingHoursEnd - 1
      && reservation.hour >= reservation.court.workingHoursStart;

    if (!available)
      return <GuestReservation {...this.props} available={available} />;

    else if (mode == ApplicationMode.ADMIN)
      return <AdminReservation {...this.props} />;

    else if (!this.state.userId
      || (reservation.customerId && reservation.customerId != this.state.userId)
      || reservation.type == ReservationType.SERVICE)
      return <GuestReservation {...this.props} available={available} />;

    else
      return <UserReservation {...this.props} available={available} />;
  }
}

export default Reservation;