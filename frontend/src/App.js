import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {asin: "", product: {}};
  }
  componentWillMount() {
  }
  handleBlur = (event) => {
    fetch("http://localhost:3001/dp/B002QYW8LW", {
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept-Encoding': 'gzip',
         },
        opts: { method: 'GET' } })
    .then((response) => {
      debugger;
      response.json().then((json) => this.setState({ asin: this.state.asin, product: json}));
    })
    .catch((error) => console.log(error));
  }
  handleChange = (event) => {
    this.setState({asin: event.target.value})
  }
  render() {
    const { asin, product } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <input type="text" value={asin} onChange={this.handleChange} onBlur={this.handleBlur}/>
        </header>
        <table>
          <thead>
            <tr><th>Title</th><th>Rating</th><th>Rank</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{product.title}</td>
              <td>{product.rating}</td>
              <td>{product.rank}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
