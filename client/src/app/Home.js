import React from 'react';
import { Link } from 'react-router-dom';
import { get, imgUrl } from '../services/fetch';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    }
  }

  componentDidMount() {
    get('/news/featured')
      .then(e => this.setState({ news: e }));
  }

  render() {
    return (
      <React.Fragment>
        <div class="wrapper">
          <div class="container">
            <div class="row">
              {this.state.news.map(e => (
                <section class="col-6 col-12-narrower feature">
                  <div class="image-wrapper first">
                    <Link to={`/news/${e.id}`} class="image featured first">
                      {e.fileId ? <img style={{ maxHeight: '25rem', width: 'auto', maxWidth: '100%', margin: 'auto' }} src={imgUrl(e.fileId)} alt="" /> : null}
                    </Link>
                  </div>
                  <header>
                    <h2>{e.heading}</h2>
                  </header>
                  <p>{e.subject}</p>
                  <ul class="actions">
                    <li><Link to={`/news/${e.id}`} class="button">Преглед</Link></li>
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
        <div id="promo-wrapper">
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '50%', margin: 'auto' }}>
              <div>
                <img style={{ width: '4em' }} src="images/trophy.svg" />
                <div style={{ color: 'white', fontWeight: '700' }}>5</div>
                <div style={{ color: 'white', fontWeight: '700' }}>турнира</div>
              </div>

              <div style={{ marginLeft: '2em' }}>
                <img style={{ width: '4em' }} src="images/tennis-court.svg" />
                <div style={{ color: 'white', fontWeight: '700' }}>19</div>
                <div style={{ color: 'white', fontWeight: '700' }}>корта</div>
              </div>

              <div style={{ marginLeft: '2em' }}>
                <img style={{ width: '4em' }} src="images/hand-shake.svg" />
                <div style={{ color: 'white', fontWeight: '700' }}>5</div>
                <div style={{ color: 'white', fontWeight: '700' }}>спонсора</div>
              </div>
            </div>
            {/* <h2 style={{ color: 'white' }}>Neque semper magna et lorem ipsum adipiscing</h2> */}

          </section>
        </div>
      </React.Fragment>
    );
  }
}