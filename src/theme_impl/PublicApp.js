import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import News from './News';
import Ranking from './Ranking';
import Partners from './Partners';
import Footer from './Footer';
import Auth from './Auth';
import LogoutEndpoint from './LogoutEndpoint';


export class PublicApp extends React.Component {
  render() {
    return (
      <div id="page-wrapper">
        <Header />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/news" component={News} />
          <Route path="/tournaments" component={null} />
          <Route path="/ranking" component={Ranking} />
          <Route path="/partners" component={Partners} />
          <Route path="/login" component={Auth} />
          <Route path="/logout" component={LogoutEndpoint} />
          <Route>
            <Redirect to="/home" />
          </Route>
        </Switch>
        <Footer />
      </div>
    );
  }
} 