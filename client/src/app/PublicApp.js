import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import News from './News';
import NewsView from './NewsView';
import Ranking from './Ranking';
import Partners from './Partners';
import Footer from './Footer';
import Auth from './Auth';
import LogoutEndpoint from './LogoutEndpoint';
import Editions from './Editions';
import Schemes from './Schemes';
import SchemeView from './SchemeView';
import SchemeBracketView from './SchemeBracketView';
import User from './User';
import InviteTeammate from './InviteTeammate';
import Invitations from './Invitations';
import Contacts from './Contacts';
import Faq from './Faq';
import Accommodation from './Accommodation';
import Gallery from './Gallery';
import Recovery from './Recovery';
import Activation from './Activation';
import PaymentPending from './PaymentPending';
import PaymentsTest from './PaymentsTest';
import { ModalHolder } from './Infrastructure';
import '../css/styles.css';


export class PublicApp extends React.Component {
  render() {
    return (
      <div id="page-wrapper">
        <ModalHolder />
        <Header />
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/news/:id" component={NewsView} />
          <Route path="/news" component={News} />
          <Route path="/users/:id" component={User} />
          <Route path="/editions/:id/*" render={props =>
            <Redirect to={`/editions/${props.match.params.id}`} />
          } />
          <Route path="/editions/:id" render={(params) => <Schemes {...params} />} />
          <Route path="/editions" component={Editions} />
          <Route path="/schemes/:id/invite" component={InviteTeammate} />
          <Route path="/invitations" render={(params) => <Invitations {...params} />} />
          <Route path="/schemes/:id" component={SchemeView} />
          <Route path="/bracket/:id" component={SchemeBracketView} />
          <Route path="/ranking" component={Ranking} />
          <Route path="/partners" component={Partners} />
          <Route path="/login" component={Auth} />
          <Route path="/logout" component={LogoutEndpoint} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/accommodation" component={Accommodation} />
          <Route path="/faq" component={Faq} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/recovery" render={(params) => <Recovery {...params} />} />
          <Route path="/activation" render={(params) => <Activation {...params} />} />
          <Route path="/payments/:id/pending" render={(params) => <PaymentPending {...params} />} />
          <Route path="/payments/:id/test" render={(params) => <PaymentsTest {...params} />} />
          <Route>
            <Redirect to="/home" />
          </Route>
        </Switch>
        <Switch>
          <Route path="/*/*/*" render={(params) => <Footer {...params} level={2} />} />
          <Route path="/*/*" render={(params) => <Footer {...params} level={1} />} />
          <Route path="/*" render={(params) => <Footer {...params} level={0} />} />
        </Switch>
      </div>
    );
  }
} 