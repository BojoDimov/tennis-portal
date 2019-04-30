import React from 'react';

export default class Ranking extends React.Component {
  render() {
    return (
      <div class="wrapper">
        <section class="container">
          <section style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Ранглиста</h2>
              <i class="fas fa-list-ol"></i><i style={{ marginLeft: '1rem' }}>В системата няма достатъчно данни!</i>
            </div>
          </section>

        </section>
      </div>
    );
  }
}
