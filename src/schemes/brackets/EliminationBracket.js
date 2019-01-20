import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import './styles.scss';

import QueryService from '../../services/query.service';
import MatchFormModal from '../components/MatchFormModal';
const rounds = [[1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4], [1, 2], [1]];

class EliminationBracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchModel: null,
      matches: []
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService.get(`/schemes/${this.props.match.params.id}/matches/elimination`)
      .then(e => this.setState({ matches: e }));
  }

  render() {
    const { matchModel, matches } = this.state;
    return (
      <React.Fragment>
        {matchModel
          && <MatchFormModal
            model={matchModel}
            onChange={() => this.setState({ matchModel: null })}
            onClose={() => this.setState({ matchModel: null })}
          />}

        <div className="bracket">
          {matches.map((round, index) => {
            return (
              <div key={index} className="round">
                <ul className="list">
                  {round.map((match, i) => {
                    return (
                      <li className="item" key={i}>
                        <div className="match" onClick={() => this.setState({ matchModel: {} })} >
                          <Match />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </React.Fragment>
    );
  }
}

class Match extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Tooltip
          title="Въвеждане/промяна на резултат"
          placement="top-center"
          TransitionComponent={Zoom}
          enterDelay={0}
        >
          <Paper elevation={4} className="match-box">
            <div className="match-box-team">
              <Typography style={{ fontSize: '.8em' }} >Панайот Давидов</Typography>
              <Typography style={{ fontSize: '.8em' }} variant="caption">6 3 6</Typography>
            </div>
            <div className="match-box-team">
              <Typography style={{ fontSize: '.8em' }}>Виктория Петрова</Typography>
              <Typography style={{ fontSize: '.8em' }} variant="caption">3 6 4</Typography>
            </div>
          </Paper>
        </Tooltip>
      </React.Fragment>
    );
  }
}

export default EliminationBracket;