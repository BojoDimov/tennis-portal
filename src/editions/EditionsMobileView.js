import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-timezone';

import DisplayImage from '../components/DisplayImage';

class EditionsMobileView extends React.Component {
  // render() {
  //   const { editions } = this.props;
  //   return (
  //     <List style={{ width: '100%' }}>
  //       {editions.map(edition => {
  //         return (
  //           <div style={{ padding: '.5rem 0', borderBottom: '1px solid lightgrey' }}>
  //             <div style={{ display: 'flex' }}>
  //               <Link to={`/editions/${edition.id}`}>
  //                 <Typography variant="display2" style={{ marginRight: '.5rem' }}>{edition.name}</Typography>
  //               </Link>

  //               <Link to={`/tournaments/${edition.tournamentId}`}>
  //                 <Typography variant="display2">{edition.tournament.name}</Typography>
  //               </Link>
  //             </div>

  //             <Typography variant="caption">{edition.info}</Typography>

  //             <Typography>
  //               {moment(edition.startDate).format('DD.MM.YYYY')}
  //               -
  //                 {moment(edition.endDate).format('DD.MM.YYYY')}
  //             </Typography>
  //           </div>
  //         );
  //       })}
  //     </List>
  //   );
  // }

  render() {
    const { editions } = this.props;
    return (
      <List>
        {editions.map((edition, index) => {
          return (
            <React.Fragment>
              <EditionTile edition={edition} />
              {index != editions.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    );
  }
}

class EditionTile extends React.Component {
  render() {
    const { edition } = this.props;

    return (
      <div style={{
        padding: '1em',
        display: 'flex',
        position: 'relative',
        backgroundImage: 'radial-gradient(547px at 6.8% 40.8%, rgb(254, 255, 255) 0%, #f47521ab  98.6%)',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        {/* {edition.tournament.thumbnail
          && <DisplayImage image={edition.tournament.thumbnail} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: '.4' }} />} */}
        <div style={{ display: 'flex', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative' }}>
            {edition.tournament.thumbnail
              && <DisplayImage image={edition.tournament.thumbnail} style={{ maxWidth: '150px', maxHeight: '150', borderRadius: '5px' }} />}
            <div style={{
              position: 'absolute', top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <Typography style={{ color: 'whitesmoke', fontWeight: 700, fontSize: '1.358em' }}>15</Typography>
              <Typography style={{ color: 'whitesmoke', fontWeight: 700, fontSize: '1.358em' }}>МАР</Typography>
            </div>
          </div>
          <Typography color="secondary" style={{ fontSize: '.8rem', fontWeight: 700, width: '100%' }} align="center">ПРИКЛЮЧИЛ</Typography>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '0 0 0 1em', justifyContent: 'space-between' }}>
          <Typography variant="headline">{edition.name} {edition.tournament.name}</Typography>
          <Typography variant="caption">{edition.info}</Typography>
          <Typography style={{ fontWeight: 700 }}>Победител/и</Typography>
          <Typography>Мартин Петров</Typography>
          <Typography>Яна Георгиева</Typography>
        </div>
      </div>
    );
  }
}

export default EditionsMobileView;