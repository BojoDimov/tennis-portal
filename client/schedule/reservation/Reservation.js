import React from 'react';

import { ApplicationMode } from '../../enums';
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

    if (mode == ApplicationMode.ADMIN)
      return <AdminReservation {...this.props} />;

    else if (this.state.userId && (!reservation.id || reservation.customerId == this.state.userId))
      return <UserReservation {...this.props} />;

    else
      return <GuestReservation {...this.props} />;
  }
}

export default Reservation;