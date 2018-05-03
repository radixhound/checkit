import React, { Component } from 'react';
import './App.css';

const ProductRow = ({product}) => (
  <tr key={product.asin}>
    <td>{product.title}</td>
    <td>{product.rating}</td>
    <td>{product.rank}</td>
  </tr>
);

const ProductTable = ({products}) => (
  <table>
    <thead>
      <tr><th>Title</th><th>Rating</th><th>Rank</th></tr>
    </thead>
    <tbody>
      {products.map((product, i) => <ProductRow key={i} product={product}/>)}
    </tbody>
  </table>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asin: "",
      product: {},
      previous_products: [],
      loading: false
    };
  }
  componentWillMount() {
    this.fetchProducts();
  }
  fetchProducts = () => {
    fetch(`http://localhost:3001/products`, {
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
         },
        opts: { method: 'GET' } })
    .then((response) => {
      response.json().then((json) => this.setState({ ...this.state, previous_products: json }));
    })
    .catch((error) => console.log(error));
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
    .then(this.fetchProducts)
    .catch((error) => console.log(error));
  }
  handleChange = (event) => {
    this.setState({asin: event.target.value})
  }
  render() {
    const { asin, product, previous_products } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img className="Logo" src="checkitlogo.png" width="100px"/>
          <h1>CheckIt</h1>
          <h2>Look up Amazon products by ASIN</h2>
        </header>
        <main>
          <section className="search_area">
            <label htmlFor="asin">Enter a product ASIN:</label>
            <input name="asin" type="text" value={asin} onChange={this.handleChange} />
            <button onClick={this.handleClick}>CheckIt!</button>
            {this.state.loading ? <p> loading {asin} ... </p> : <ProductTable products={[product]}/>}
          </section>
          <section className="previous_results">
            <ProductTable products={previous_products}/>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
