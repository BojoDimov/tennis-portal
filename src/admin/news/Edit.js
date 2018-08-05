import React from 'react';
import { file, imgUrl, post, get } from '../../services/fetch';
import { ConfirmationButton } from '../Infrastructure';

export class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: '',
      subject: '',
      body: '',
      author: '',
      fileId: null,
      subsections: []
    }
  }

  componentDidMount() {
    let input = document.getElementById('newsImage');
    let self = this;
    input.addEventListener('change', e => {
      if (input.files[0])
        file(input.files[0]).then(e => this.setState({ fileId: e.id }));
    });

    get(`/news/${this.props.match.params.id}`)
      .then(e => this.setState(e));
  }

  save() {
    post(`/news/${this.props.match.params.id}`, this.state)
      .then(e => {
        this.props.onChange();
        this.props.history.push('/news')
      });
  }

  add() {
    this.setState({
      subsections: this.state.subsections.concat({
        heading: '',
        body: '',
        parentId: this.state.id
      })
    });
  }

  removeSection(index) {
    let ss = this.state.subsections;
    ss.splice(index, 1);
    this.setState({ subsections: ss });
  }


  update(what, where, newVal) {
    let subsections = this.state.subsections;
    subsections[where][what] = newVal;
    this.setState({ subsections: subsections });
  }

  render() {
    return (
      <div className="form-container">
        <h2 className="form-box">Промяна на новина</h2>
        <form style={{ width: '100%' }}>
          <div className="input-group">
            <label>Изображение</label>
            <input id="newsImage" type="file" accept=".jpg, .jpeg, .png" />
          </div>

          <div className="input-group" style={{ textAlign: 'center' }}>
            {this.state.fileId ? <img src={imgUrl(this.state.fileId)} style={{ maxHeight: '25rem', width: 'auto' }} /> : null}
          </div>

          <div className="input-group">
            <div>Заглавие</div>
            <input
              type="text"
              value={this.state.heading}
              onChange={e => this.setState({ heading: e.target.value })} />
          </div>

          <div className="input-group">
            <div title="показва се под снимката при списъци от новини и начален екран">Извадка</div>
            <textarea
              style={{ width: '100%', height: '7rem' }}
              value={this.state.subject}
              onChange={e => this.setState({ subject: e.target.value })} />
          </div>

          <div className="input-group">
            <div>Секция</div>
            <textarea
              style={{ width: '100%', height: '15rem' }}
              value={this.state.body}
              onChange={e => this.setState({ body: e.target.value })} />
          </div>

          {this.state.subsections.map((ss, i) => (
            <React.Fragment>
              <div className="input-group">
                <div>Заглавие</div>
                <input
                  type="text"
                  value={ss.heading}
                  onChange={e => this.update('heading', i, e.target.value)} />
              </div>

              <div className="input-group">
                <div>Секция</div>
                <textarea
                  style={{ width: '100%', height: '15rem' }}
                  value={ss.body}
                  onChange={e => this.update('body', i, e.target.value)} />
              </div>
              <div className="input-group" onClick={() => this.removeSection(i)}>
                <i className="button fa fa-times" ></i>
              </div>
            </React.Fragment>
          ))}

          <span style={{ marginRight: '.3rem' }} className="button" onClick={() => this.add()}>Добави раздел</span>
          <ConfirmationButton onChange={flag => flag ? this.save() : null} >
            Запиши
          </ConfirmationButton>
        </form>
      </div>
    );
  }
}