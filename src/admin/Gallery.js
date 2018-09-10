import React from 'react';
import { get, post, file, imgUrl } from '../services/fetch';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      fileId: null
    }
  }

  componentDidMount() {
    let input = document.getElementById('newsImage');
    const { id } = this.props.match.params;

    input.addEventListener('change', e => {
      if (input.files[0])
        file(input.files[0])
          .then(e => this.setState({ fileId: e.id }))
          .then(() => post(`/gallery`, { tournamentId: id, imageId: this.state.fileId }))
          .then(e => this.setState({ images: [e].concat(this.state.images) }));
    });

    get(`/gallery?tournamentId=${id}`)
      .then(e => this.setState({ images: e }));
  }

  removeImage(index) {
    get(`/gallery/${this.state.images[index].id}/remove`)
      .then(() => {
        let images = this.state.images;
        images.splice(index, 1);
        return this.setState({ images: images });
      });
  }

  render() {
    return (
      <div className="form-container">
        <h2 className="form-box center">Галерия</h2>
        <div className="input-group">
          <label>Изображение</label>
          <input id="newsImage" type="file" accept=".jpg, .jpeg, .png" />
        </div>

        {this.state.images.map((img, index) => {
          return (
            <div
              className="input-group"
              style={{ textAlign: 'center' }}
              key={index}
            >
              <img src={imgUrl(img.imageId)} style={{ maxHeight: '25rem', width: 'auto', verticalAlign: 'top' }} />
              <span onClick={() => this.removeImage(index)}>
                <i className="button fa fa-times" ></i>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Gallery;