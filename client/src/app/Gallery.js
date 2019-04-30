import React from 'react'
import { Link } from 'react-router-dom';

import { createOpenModalEvent, createCloseModalEvent } from './Infrastructure';
import { get, imgUrl } from '../services/fetch';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../clientConfig.js')[env];


export default class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    }
  }

  componentDidMount() {
    get(`/gallery?tournamentId=${config.tournamentId}`)
      .then(e => this.setState({ images: e }));
  }

  render() {
    const { images } = this.state;

    return (
      <div class="wrapper">
        <section class="container">
          <header class="major">
            <h2>Галерия</h2>
          </header>

          {images
            .map((_, i) => i % 3 == 0 ? images.slice(i, i + 3) : [])
            .filter(e => e.length)
            .map(arr => (
              <div className="row features">
                {arr.map((n, i) => (
                  <section className="col-4 col-12-narrower feature">
                    <div className={"image-wrapper" + (i == 0 ? " first" : "")}
                      onClick={() => createOpenModalEvent(<ImageModal src={imgUrl(n.imageId)} />, () => null)}>
                      <span className="image featured" >
                        <img
                          style={{ maxHeight: '12rem', width: 'auto', margin: 'auto', cursor: 'pointer' }}
                          src={imgUrl(n.imageId)}
                        />
                      </span>
                    </div>
                  </section>
                ))}
              </div>
            ))}
        </section>
      </div>
    );
  }
}

class ImageModal extends React.Component {
  render() {
    const { src } = this.props;

    return (
      <div className="image-modal">
        <div className="img">
          <img src={src} />
          <span
            style={{ position: 'absolute', top: '5px', right: '10px', color: 'white', cursor: 'pointer' }}
            onClick={() => createCloseModalEvent()}
          >
            <i className="fa fa-times" ></i>
          </span>
        </div>
      </div>
    );
  }
}