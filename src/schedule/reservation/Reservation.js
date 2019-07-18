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
      user: null
    };
  }

  setUser() {
    UserService.getAuthenticatedUser()
      .then(user => this.setState({ user }));
  }

  componentDidMount() {
    this.setUser();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mode != this.props.mode)
      this.setUser();
  }

  render() {
    const { reservation, mode } = this.props;
    const { user } = this.state;

    const available = reservation.hour <= reservation.court.workingHoursEnd - 1
      && reservation.hour >= reservation.court.workingHoursStart;

    if (!available)
      return <GuestReservation {...this.props} available={available} />;

    if (mode == ApplicationMode.ADMIN)
      return <AdminReservation {...this.props} />;

    if (mode == ApplicationMode.GUEST)
      return <GuestReservation {...this.props} available={available} />

    if (user && user.isTrainer && reservation.type == ReservationType.COMPETITOR)
      return <UserReservation {...this.props} />

    if (!reservation.id)
      return <UserReservation {...this.props} />

    if (reservation.customerId && user && reservation.customerId == user.id)
      return <UserReservation {...this.props} />

    return <GuestReservation {...this.props} available={available} />;
  }
}

export default Reservation;