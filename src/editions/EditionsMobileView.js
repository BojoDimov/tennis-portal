import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-timezone';

class EditionsMobileView extends React.Component {
  render() {
    const { editions } = this.props;
    return (
      <List style={{ width: '100%' }}>
        {editions.map(edition => {
          return (
            <div style={{ padding: '.5rem 0', borderBottom: '1px solid lightgrey' }}>
              <div style={{ display: 'flex' }}>
                <Link to={`/editions/${edition.id}`}>
                  <Typography variant="display2" style={{ marginRight: '.5rem' }}>{edition.name}</Typography>
                </Link>

                <Link to={`/tournaments/${edition.tournamentId}`}>
                  <Typography variant="display2">{edition.tournament.name}</Typography>
                </Link>
              </div>

              <Typography variant="caption">{edition.info}</Typography>

              <Typography>
                {moment(edition.startDate).format('DD.MM.YYYY')}
                -
                  {moment(edition.endDate).format('DD.MM.YYYY')}
              </Typography>
            </div>
          );
        })}
      </List>
    );
  }
}

export default EditionsMobileView;