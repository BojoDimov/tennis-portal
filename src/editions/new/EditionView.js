import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';

import { Status, ApplicationMode } from '../../enums';
import EditionFormModal from './EditionFormModal';
import SchemeFormModal from '../../schemes/SchemeFormModal';
import SchemeDetails from '../../schemes/components/SchemeDetails';
import SchemeDetailsActions from '../../schemes/components/SchemeDetailsActions';
import DisplayImage from '../../components/DisplayImage';
import QueryService from '../../services/query.service';
import UserService from '../../services/user.service';

class EditionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edition: {
        tournament: {},
        schemes: []
      },
      editionModel: null,
      schemeModel: null
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

  initSchemeModel() {
    this.setState({
      schemeModel: {
        status: Status.DRAFT,
        edition: this.state.edition,
        editionId: this.state.edition.id,
        singleTeams: true,
        maleTeams: false,
        femaleTeams: false,
        mixedTeams: false,
        hasGroupPhase: false,
        ageFrom: '',
        ageTo: '',
        maxPlayerCount: '',
        groupCount: '',
        teamsPerGroup: '',
        date: null,
        registrationStart: null,
        registrationEnd: null,
        pPoints: 1,
        wPoints: 15,
        cPoints: 20
      }
    });
  }

  render() {
    const { edition, editionModel, schemeModel } = this.state;
    const { classes } = this.props;

    return (
      <UserService.WithApplicationMode>
        {mode => (
          <div className="container">
            {editionModel
              && <EditionFormModal
                model={editionModel}
                onChange={() => {
                  this.setState({ editionModel: null });
                  this.getData();
                }}
                onClose={() => this.setState({ editionModel: null })}
              />}

            {schemeModel
              && <SchemeFormModal
                model={schemeModel}
                onChange={() => {
                  this.setState({ schemeModel: null });
                  this.getData();
                }}
                onClose={() => this.setState({ schemeModel: null })}
              />}

            {mode == ApplicationMode.ADMIN && <div style={{ margin: '.5rem 0' }}>
              <Button variant="contained" color="primary" size="small" onClick={() => this.initSchemeModel()}>Добави схема</Button>
              <Button variant="contained" color="primary" size="small" style={{ marginLeft: '.3rem' }} onClick={() => this.setState({ editionModel: edition })}>Промяна</Button>
              <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '.3rem' }}>Изтриване</Button>
            </div>}

            <Card>
              <CardContent>
                <Typography variant="headline">
                  {edition.name}
                </Typography>
                <Typography variant="caption">{edition.info}</Typography>

                <Typography variant="caption" style={{ marginTop: '1rem' }}>Лига</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {edition.tournament.thumbnail
                    && <DisplayImage image={edition.tournament.thumbnail} style={{ maxWidth: '50px', marginRight: '.5rem' }} />}
                  <Link to={`/tournaments/${edition.tournament.id}`}>
                    <Typography variant="body2">{edition.tournament.name}</Typography>
                  </Link>
                </div>

                <div style={{ display: 'flex', marginTop: '1rem' }}>
                  <Typography variant="caption" style={{ paddingRight: '1rem' }}>
                    Начало
              <Typography>{moment(edition.startDate).format('DD.MM.YYYY')}</Typography>
                  </Typography>

                  <Typography variant="caption">
                    Край
              <Typography>{moment(edition.endDate).format('DD.MM.YYYY')}</Typography>
                  </Typography>
                </div>
              </CardContent>
            </Card>

            <div className={classes.schemesRoot}>
              {edition.schemes.map(scheme => {
                const actions = <SchemeDetailsActions scheme={scheme} enableViewLink />;
                return <SchemeDetails
                  scheme={scheme}
                  actions={actions}
                  CardProps={{
                    className: classes.schemesItem
                  }} />
              })}
            </div>
          </div>
        )}
      </UserService.WithApplicationMode>
    );
  }
}

const styles = (theme) => ({
  schemesRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '.3rem'
  },
  schemesItem: {
    width: '49.5%',
    marginBottom: '.3rem',
    paddingBottom: '0',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  }
});

export default withStyles(styles)(EditionView);