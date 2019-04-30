import React from 'react';
import { get, imgUrl } from '../services/fetch';

export default class NewsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: null
    }
  }

  componentDidMount() {
    get(`/news/${this.props.match.params.id}`)
      .then(e => this.setState({ news: e }));
  }

  parse(section) {
    let result = section.match(/((http)|(https)|(www)).*\//);
    if (result) {
      section = section.slice(0, result.index - 1) +
        '\n' +
        result[0] +
        '\n' +
        section.slice(result.index + result[0].length);
    }

    return section.split('\n').map((l, i) => {
      if (l.match(/((http)|(https)|(www)).*\//))
        return <a key={i} href={l}>{l}</a>;
      else return (
        <React.Fragment key={i}>
          {l}
          <br />
        </React.Fragment>
      );
    });
  }

  render() {
    return (
      <div className="wrapper">
        <div className="container" id="main">
          {this.state.news ?
            <React.Fragment>
              <article id="content">
                {this.state.news.fileId ?
                  <img style={{ maxHeight: '25rem', width: 'auto', maxWidth: '100%', float: 'left', marginRight: '2rem' }}
                    src={imgUrl(this.state.news.fileId)}
                    alt="" /> : null}

                <header style={{ alignSelf: 'flex-end' }}>
                  <h2>{this.state.news.heading}</h2>
                </header>
                {this.state.news.body.split('\n\n').map((p, i) => (
                  <p key={i}>{this.parse(p)}</p>
                ))}
              </article>
              {this.state.news.subsections.map((sub, i) => (
                <article id="content" key={i}>


                  <header>
                    <h3>{sub.heading}</h3>
                  </header>
                  {sub.fileId ?
                    <div style={{ textAlign: 'center' }}>

                      <img style={{ width: 'auto', maxWidth: '100%', marginTop: '1rem' }}
                        src={imgUrl(sub.fileId)}
                        alt="" />
                    </div> : null}

                  {/* <p>{sub.body.split('\n').slice(0, -1).map(l => <React.Fragment>{l}<br /></React.Fragment>)}</p> */}
                  <p>{this.parse(sub.body)}</p>
                </article>
              ))}
            </React.Fragment> : null}
        </div>
      </div>
    );
  }
}