import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Create } from './Create';
import { Edit } from './Edit';
import { get } from '../../services/fetch';

export class NewsRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    }
  }

  getData() {
    return get('/news')
      .then(e => this.setState({ news: e }));
  }

  componentDidMount() {
    return this.getData();
  }

  render() {
    return (
      <Switch>
        <Route path="/news/create" render={(props) => {
          return (
            <Create {...props} onChange={() => this.getData()} />
          );
        }} />

        <Route path='/news/:id/edit' render={(props) => <Edit onChange={() => this.getData()} {...props} />} />
        <Route exact path="/news" render={() => <NewsTable news={this.state.news} />} />
      </Switch>
    )
  }
}

export class NewsTable extends React.Component {
  render() {
    return (
      <div className="container">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>Новини</span>
                <Link to={`/news/create`}>
                  <span className="button-group">
                    <span className="button">добавяне</span>
                  </span>
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.news.map(t => (
              <tr key={t.id}>
                <td>
                  <Link to={`/news/${t.id}/edit`} >{t.heading}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
