import React from 'react';
import { Link } from 'react-router-dom';

export default class Footer extends React.Component {
  getUrl(url) {
    let result = "";
    for (let i = 0; i < this.props.level; i++)
      result += "../";
    return result + url
  }

  render() {
    return (
      <div id="footer-wrapper">
        <div id="footer" className="container">
          <header className="major" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a href="#" title="+359 883 326 235"><img src={this.getUrl("./images/phone-call.svg")} /></a>
            <a href="#">
              <img src={this.getUrl("images/youtube.svg")} />
            </a>
            <a href="https://www.instagram.com/smileeventsbg/" title="https://www.instagram.com/?hl=en">
              <img src={this.getUrl("images/instagram.svg")} />
            </a>
            <a href="https://web.facebook.com/pg/smileeventsbg/" title="https://web.facebook.com/pg/smileeventsbg/">
              <img src={this.getUrl("images/facebook.svg")} />
            </a>
            <a href="mailto:tournaments@smilevent.net" title="tournaments@smilevent.net">
              <img src={this.getUrl("images/envelope.svg")} />
            </a>
          </header>
          <ul className="menu" style={{ textAlign: 'center' }}>
            <li><a href="/contacts">За нас</a></li>
            <li><a href="/partners">Партньори</a></li>
            <li><a href="/faq">Регламент на турнирите</a></li>
            <li>&copy; SmileEventS. All rights reserved.</li>
          </ul>
          <ul className="menu" style={{ textAlign: 'center', paddingTop: '5rem' }}>
            <img className="fair-play" src={this.getUrl("images/fairplay.jpg")} />
          </ul>
        </div>
      </div>
    )
  }
}