import React from 'react';
import { Link } from 'react-router-dom';
import { get, imgUrl } from '../services/fetch';

export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    }
  }

  componentDidMount() {
    get('/news').then(e => this.setState({ news: e }));
  }

  render() {
    return (
      <div class="wrapper">
        <section class="container">
          <header class="major">
            <h2>Новини</h2>
          </header>


          {this.state.news
            .map((_, i) => i % 3 == 0 ? this.state.news.slice(i, i + 3) : [])
            .filter(e => e.length)
            .map(arr => (
              <div className="row features">
                {arr.map((n, i) => (
                  <section className="col-4 col-12-narrower feature">
                    <div className={"image-wrapper" + (i == 0 ? " first" : "")}>
                      <Link to={`/news/${n.id}`} className="image featured">
                        <img style={{ maxHeight: '15rem', width: 'auto', maxWidth: '100%', margin: 'auto' }} src={imgUrl(n.fileId)} />
                      </Link>
                    </div>
                    <header>
                      <h2>{n.heading}</h2>
                    </header>
                    <p>{n.subject}</p>
                  </section>
                ))}
              </div>
            ))}


        </section>
      </div>
    );
  }
}