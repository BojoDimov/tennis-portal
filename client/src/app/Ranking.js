import React from 'react';
import Queries from '../services/queries';

export default class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ranking: []
    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    Queries.Ranking.get()
      .then(ranking => this.setState({ ranking }));
  }

  render() {
    return (
      <div className="wrapper">
        {/* <section class="container">
          <section style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Ранглиста</h2>
              <i class="fas fa-list-ol"></i><i style={{ marginLeft: '1rem' }}>В системата няма достатъчно данни!</i>
            </div>
          </section>

        </section> */}
        <section class="container">
          <section style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Ранглиста</h2>
            </div>
          </section>

        </section>


        <div className="container list">
          {this.state.ranking.map(this.getRanking)}
        </div>
      </div>
    );
  }

  getRanking(ranking, index) {
    return (
      <div className="button list-row" key={index}>
        <div style={{ marginRight: '1.5em' }}>
          #{index + 1}
        </div>
        <div style={{ flexGrow: 1 }}>
          <div>{ranking.team.user1.name}</div>
          {ranking.team.user2 && <div>{ranking.team.user2.name}</div>}
        </div>
        <div>
          {ranking.points} {ranking.points > 1 ? 'точки' : 'точка'}
        </div>
      </div>
    );
  }
}
