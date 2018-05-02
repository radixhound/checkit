import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {asin: "", product: {}, loading: false};
  }
  componentWillMount() {
  }
  handleClick = (event) => {
    this.setState({...this.state, loading: true})
    fetch(`http://localhost:3001/dp/${this.state.asin}`, {
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
          <h1>CheckIt</h1>
          <h2>Look up Amazon products by ASIN</h2>
        </header>
        <main>
          <label for="asin">Enter a product ASIN:</label>
          <input name="asin" type="text" value={asin} onChange={this.handleChange} />
          <button onClick={this.handleClick}>CheckIt!</button>
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
        </main>
      </div>
    );
  }
}

export default App;
