import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {asin: "", product: {}, loading: false};
  }
  componentWillMount() {
  }
  handleBlur = (event) => {
    this.setState({...this.state, loading: true})
    fetch(`http://localhost:3001/dp/${event.target.value}`, {
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept-Encoding': 'gzip', // FIXME: solve the gzip issue for moar speed?
         },
        opts: { method: 'GET' } })
    .then((response) => {
      response.json().then((json) => this.setState({...this.state, product: json, loading: false}));
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
          <label>Enter a product ASIN:</label>
          <input type="text" value={asin} onChange={this.handleChange} onBlur={this.handleBlur}/>
        </header>
        {this.state.loading ? <p> loading {asin} ... </p>
        : <table>
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
        }
      </div>
    );
  }
}

export default App;
