import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <div id="footer-wrapper">
        <div id="footer" className="container">
          <header className="major">
            <h2>Euismod aliquam vehicula lorem</h2>
            <p>Lorem ipsum dolor sit amet consectetur et sed adipiscing elit. Curabitur vel sem sit<br />
              dolor neque semper magna lorem ipsum feugiat veroeros lorem ipsum dolore.</p>
          </header>
        </div>
        <div id="copyright" className="container">
          <ul className="menu">
            <li>&copy; Untitled. All rights reserved.</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
          </ul>
        </div>
      </div>
    )
  }
}