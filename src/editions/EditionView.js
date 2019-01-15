import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BuildIcon from '@material-ui/icons/Build';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Schemes from '../schemes/Schemes';
import UserService from '../services/user.service';
import QueryService from '../services/query.service';

class EditionDetails extends React.Component {
  render() {
    const { edition } = this.props;

    return (
      <Card>
        <CardContent>
          <Typography variant="headline">{edition.name}</Typography>
          <Typography variant="caption">{edition.info}</Typography>
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <Typography variant="subheading" style={{ paddingRight: '1rem' }}>
              Начало
              <Typography>{new Date(edition.startDate).toLocaleDateString()}</Typography>
            </Typography>

            <Typography variant="subheading">
              Край
              <Typography>{new Date(edition.endDate).toLocaleDateString()}</Typography>
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
  }
}

class EditionView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      edition: {},
      isAdmin: UserService.isAdmin(),
      menuAnchor: null
    }

    this.closeMenu = () => {
      this.setState({ menuAnchor: null });
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    QueryService
      .get(`/editions/${this.props.match.params.id}`)
      .then(e => this.setState({ edition: e }));
  }

  render() {
    const { edition, isAdmin, menuAnchor } = this.state;

    return (
      <div className="container">
        {isAdmin && <Hidden smDown>
          <div className="spacing">
            <Button variant="contained" size="small" color="primary">Промяна</Button>
            <Button variant="contained" size="small" color="primary">Добави схема</Button>
            <Button variant="contained" size="small" color="primary">Чернова</Button>
            <Button variant="contained" size="small" color="primary">Публикуване</Button>
            <Button variant="contained" size="small" color="primary">Финализиране</Button>
            <Button variant="contained" size="small" color="primary">Изтриване</Button>
          </div>
        </Hidden>}


        {isAdmin && <Hidden mdUp>
          <Button
            aria-owns={menuAnchor ? 'admin-actions' : null}
            aria-haspopup="true"
            color="primary" size="small"
            onClick={(e) => this.setState({ menuAnchor: e.target })}
          >
            <BuildIcon />
          </Button>
          <Menu
            id="admin-actions"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={this.closeMenu}
          >
            <MenuItem onClick={this.closeMenu}>
              Промяна
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Добави схема
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Чернова
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Публикуване
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Финализиране
            </MenuItem>
            <MenuItem onClick={this.closeMenu}>
              Изтриване
            </MenuItem>
          </Menu>
        </Hidden>}

        <EditionDetails edition={edition} />

        <ExpansionPanel defaultExpanded={true}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="headline">Схеми</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Schemes editionId={edition.id} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default EditionView;