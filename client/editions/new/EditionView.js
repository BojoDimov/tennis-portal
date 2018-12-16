import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { SchemeType } from '../../enums';
import EditionFormModal from './EditionFormModal';
import SchemeFormModal from '../../schemes/SchemeFormModal';
import DisplayImage from '../../components/DisplayImage';
import QueryService from '../../services/query.service';

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
        edition: this.state.edition,
        editionId: this.state.edition.id,
        singleTeams: true,
        maleTeams: false,
        femaleTeams: false,
        mixedTeams: false,
        schemeType: SchemeType.ELIMINATION,
        groupPhase: null,
        groupPhaseId: null,
        ageFrom: '',
        ageTo: '',
        maxPlayerCount: '',
        groupCount: '',
        teamsPerGroup: '',
        date: null,
        registrationStartDate: null,
        registrationEndDate: null,
        pPoints: 1,
        wPoints: 15,
        cPoints: 20
      }
    });
  }

  render() {
    const { edition, editionModel, schemeModel } = this.state;

    return (
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

        <div style={{ margin: '.5rem 0' }}>
          <Button variant="contained" color="primary" size="small" onClick={() => this.initSchemeModel()}>Добави схема</Button>
          <Button variant="contained" color="primary" size="small" style={{ marginLeft: '.3rem' }} onClick={() => this.setState({ editionModel: edition })}>Промяна</Button>
          <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '.3rem' }}>Изтриване</Button>
        </div>
        <Card>
          <CardContent>
            <Typography variant="headline">
              Турнир {edition.name}
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
      </div>
    );
  }
}

export default EditionView;