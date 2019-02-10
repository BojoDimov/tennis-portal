import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { BracketStatus } from '../../enums';

class SchemeDetailsActions extends React.Component {
  render() {
    const { scheme, enableViewLink } = this.props;
    return (
      <React.Fragment>
        {enableViewLink &&
          <Link to={`/schemes/${scheme.id}`}>
            <Button color="primary">Преглед</Button>
          </Link>}
        {scheme.bracketStatus == BracketStatus.GROUPS_DRAWN
          && <Link to={`/schemes/${scheme.id}/groups`}>
            <Button color="primary">Групи</Button>
          </Link>}
        {(scheme.bracketStatus == BracketStatus.ELIMINATION_DRAWN || scheme.bracketStatus == BracketStatus.ELIMINATION_END)
          && <React.Fragment>
            <Link to={`/schemes/${scheme.id}/elimination`}>
              <Button color="primary">Схема</Button>
            </Link>
            {scheme.hasGroupPhase
              && <Link to={`/schemes/${scheme.id}/groups`}>
                <Button color="primary">Групи</Button>
              </Link>}
          </React.Fragment>}
        {scheme.bracketStatus == BracketStatus.UNDRAWN
          && <React.Fragment>
            <Button color="primary">Записване</Button>
            <Button color="secondary">Отписване</Button>
          </React.Fragment>}
      </React.Fragment>
    );
  }
}

export default SchemeDetailsActions;