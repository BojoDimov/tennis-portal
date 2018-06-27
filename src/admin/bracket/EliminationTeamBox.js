import React from 'react';
import { Link } from 'react-router-dom';
import { ConfirmationButton } from '../Infrastructure';
import { post } from '../../services/fetch';


export class EliminationTeamBox extends React.Component {

  componentDidMount() {
    console.log(this.props.previousMatch);
  }

  render() {
    return (
      <div className="center team-label">
        {this.props.team ?
          <div>
            <Link to={`/users/${this.props.team.id}`}>
              {this.props.team.fullname}
            </Link>
          </div>
          : null
        }

        {this.props.previousMatch && this.props.previousMatch.team1 && this.props.previousMatch.team2 ?
          <MatchScore2 match={this.props.previousMatch} refresh={this.props.refresh} />
          : null
        }
      </div>
    );
  }
}


export class MatchScore2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMatchForm: false
    };
  }
  // render() {
  //   if (!this.props.match.team1Id || !this.props.match.team2)
  //     return null;
  //   else
  //     return (
  //       <div className="dropdown">
  //         <div className="button" onClick={() => this.setState({ showMatchForm: !this.state.showMatchForm })}>резултат</div>
  //         {this.state.showMatchForm ? <MatchScoreForm match={this.props.match} onChange={() => this.props.refresh()} /> : null}
  //       </div>
  //     );
  // }
  render() {
    return (
      <div className="dropdown">
        <Score sets={this.props.match.sets} />
        <div className="button" onClick={() => this.setState({ showMatchForm: !this.state.showMatchForm })}>резултат</div>
        {this.state.showMatchForm ? <MatchScoreForm match={this.props.match} onChange={() => { this.setState({ showMatchForm: false }); this.props.refresh(); }} /> : null}
      </div>
    );
  }
}

export class Score extends React.Component {
  render() {
    if (this.props.sets.length > 0)
      return <div className="button-group">
        {this.props.sets.map((set, i) => (
          <React.Fragment key={i}>
            <span>{(" " + set.team1).split('(')[0]}</span>
            <span>{(set.team2 + "").split('(')[0]}</span>
            <sup>{set.tiebreaker}</sup>
          </React.Fragment>
        ))}
      </div>
    else return null;
  }
}

export class MatchScoreForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sets: this.initSets(),
      withdraw: 0
    }
  }

  initSets() {
    let sets = [];
    for (let i = 0; i < 5; i++)
      sets.push({
        order: i + 1,
        team1: '',
        team2: '',
        disabled: true
      });

    sets[0].disabled = false;
    return sets;
  }

  componentDidMount() {
    let sets = this.state.sets;
    this.props.match.sets.forEach((set, i) => {
      set.disabled = false;
      sets[i] = set;
      if (i < sets.length - 1)
        sets[i + 1].disabled = false;
    });

    this.setState({ sets: sets, withdraw: this.props.match.withdraw });
  }

  handle_input(value, index, pos) {
    let sets = this.state.sets;
    sets[index]['team' + pos] = value;
    if (index < (5 - 1) && sets[index].team1 !== '' && sets[index].team2 !== '')
      //sets.slice(index + 1).forEach(set => set.disabled = false);
      sets[index + 1].disabled = false;

    // if (index < (5 - 1) && (sets[index].team1 === '' || sets[index].team2 === ''))
    //   sets.slice(index + 1).forEach(set => set.disabled = true);
    // sets[index + 1].disabled = true;

    this.setState({ sets: sets });
  }

  saveMatch() {
    post(`/matches/${this.props.match.id}/addResult`, { sets: this.state.sets, withdraw: this.state.withdraw })
      .then((res) => this.props.onChange(res));
  }

  render() {
    return (
      <div className="dropdown-content">
        <table className="match-result-table input-group">
          <thead>
            <tr>
              <th></th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>V</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.match.team1.fullname}</td>
              {this.state.sets.map((set, i) => (
                <td key={i}><input type="text" disabled={set.disabled} value={set.team1} onChange={(e) => this.handle_input(e.target.value, i, 1)} /></td>
              ))}
            </tr>
            <tr>
              <td>{this.props.match.team2.fullname}</td>
              {this.state.sets.map((set, i) => (
                <td key={i}><input type="text" disabled={set.disabled} value={set.team2} onChange={(e) => this.handle_input(e.target.value, i, 2)} /></td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="input-group">
          <div>Отказал се</div>
          <select value={this.state.withdraw} onChange={e => this.setState({ withdraw: e.target.value })}>
            <option value={0}>нямa</option>
            <option value={1}>{this.props.match.team1.fullname}</option>
            <option value={2}>{this.props.match.team2.fullname}</option>
          </select>
        </div>
        <ConfirmationButton className="button-block center" onChange={flag => flag ? this.saveMatch() : null}>
          Запис на резултата
              </ConfirmationButton>
        {/* <div className="button center" onClick={() => this.saveMatch()}>Запис на резултата</div> */}
      </div>
    );
  }
}