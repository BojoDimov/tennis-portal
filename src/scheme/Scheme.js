import React, { Component } from 'react';

class Scheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [
        'Ivan Milev',
        'Bozhidar Dimov',
        'Miroslav Georgiev',
        'Milen Georgiev',
        'Martin Georgiev',
        'Raina Petrova',
        'Ralica Metodieva',
        'Dimiter Malinov',
        'Христина Тодорова',
        'Григор Димитров'
      ]
    };
  }
  render() {
    return <div className="margin">
      {this.getBrackets().map((bracket, index) =>
        <li key={index}>
          {Bracket(bracket)}
        </li>
      )}
    </div>;
  }

  getBrackets() {
    let brackets = [];
    for (let i = 0; i < this.state.players.length; i = i + 2) {
      brackets.push({
        player1: this.state.players[i],
        player2: this.state.players[i + 1]
      });
    }
    return brackets;
  }
}

function Bracket(bracket) {
  return <svg className="border" width="300" height="120" >
    <polygon points="10 40,35 15,120 15,120 40"
      fill="#FFF1D1" shapeRendering="optimizeQuality" />
    <rect x="10" y="40" width="280" height="60" strokeWidth="1.5" fill="#FFF1D1" shapeRendering="crispEdges" />
    <line x1="11" x2="119" y1="40" y2="40" stroke="black" shapeRendering="crispEdges" strokeWidth=".5" />
    {/* <line x1="10" x2="290" y1="70" y2="70" stroke="black" shape-rendering="crispEdges" /> */}
    {/* <text className="clickable" x="42" y="32" font-size="14" fill="#423C2C">14:25 pm</text> */}
    <TextData text="14:25 pm" />
    <text className="clickable" x="30" y="60" fontSize="14" fill="#423C2C">{bracket.player1}</text>
    <text className="clickable" x="30" y="90" fontSize="14" fill="#423C2C">{bracket.player2}</text>

    <text className="clickable" x="265" y="62" fontSize="20" fill="#423C2C">3</text>
    <text className="clickable" x="265" y="92" fontSize="20" fill="#423C2C">6</text>
    {/* <text className="clickable" x="10" y="20" font-size="20" fill="#423C2C">{bracket.player1}</text>
    <line x1="0" x2="200" y1="27.75" y2="27.75" stroke="black" stroke-width=".5" />
    <text className="clickable" x="10" y="50" font-size="20" fill="#423C2C">{bracket.player2}</text> */}
  </svg>;
}

class TextData extends Component {
  edit = false;
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }
  }

  render() {
    if (!this.state.editing)
      return <text onClick={() => this.changeState()}
        className="clickable" x="42" y="32" fontSize="14" fill="#423C2C">{this.props.text}</text>;
    else
      return <foreignObject x="42" y="18">
        <body xmlns="http://www.w3.org/1999/xhtml">
          <form>
            <span style={{ display: 'inline' }} onClick={() => this.changeState()}>zaaaaaaaaaaaaaaaaaaaa</span>
            <input type="time" style={{ display: 'inline-block' }} />
          </form>
        </body>
      </foreignObject>;
  }

  changeState() {
    this.setState({
      editing: !this.state.editing
    });
    console.log(this.state);
  }
}

class ObjectData extends Component {

}

export default Scheme;