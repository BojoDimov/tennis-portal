import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class SchemeDetailsActions extends React.Component {
  render() {
    const { scheme, enableViewLink } = this.props;
    return (
      <React.Fragment>
        {enableViewLink &&
          <Link to={`/schemes/${scheme.id}`}>
            <Button color="primary">Преглед</Button>
          </Link>}
        <Link to={`/schemes/${scheme.id}/elimination`}>
          <Button color="primary">Схема</Button>
        </Link>
        <Button color="primary">Записване</Button>
        <Button color="secondary">Отписване</Button>
      </React.Fragment>
    );
  }
}

export default SchemeDetailsActions;