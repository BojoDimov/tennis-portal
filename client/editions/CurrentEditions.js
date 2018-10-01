import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  link: {
    textTransform: "none"
  }
});

class CurrentEditions extends React.Component {
  render() {
    const { editions, canDelete, onDelete, classes } = this.props;

    if (editions.length == 0)
      return <i>няма текущи турнири</i>

    return (
      <React.Fragment>
        <Hidden mdUp>
          <List component="nav" style={{ width: '100%' }}>
            {editions.map(edition => {
              return (
                <Link to={`/editions/${edition.id}`} key={edition.id} >
                  <ListItem button>
                    <ListItemText color="primary" primary={`${edition.name} (${edition.tournament.name})`} />
                  </ListItem>
                  <Divider />
                </Link>
              );
            })}
          </List>
        </Hidden>
        <Hidden smDown>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Лига</TableCell>
                <TableCell>Турнир</TableCell>
                <TableCell>Дата</TableCell>
                {canDelete && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {editions.map(edition => {
                return (
                  <TableRow key={edition.id}>
                    <TableCell>
                      <Link to={`/tournaments/${edition.tournament.id}`}>
                        <Button className={classes.link} color="primary"> {edition.tournament.name}</Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/editions/${edition.id}`}>
                        <Button className={classes.link} color="primary"> {edition.name}</Button>
                      </Link>
                    </TableCell>
                    <TableCell>baba qga</TableCell>
                    {canDelete && <TableCell>
                      <Button variant="text" color="primary" size="small"
                        style={{ color: 'darkred' }}
                        onClick={() => onDelete(edition.id)}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </TableCell>}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Hidden>
      </React.Fragment>
    );
  }
}

CurrentEditions.propTypes = {
  editions: PropTypes.array.isRequired
};

export default withStyles(styles)(CurrentEditions);//withWidth()(CurrentEditions);