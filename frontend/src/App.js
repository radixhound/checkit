import React, { Component } from 'react';
import ProductTable from './ProductTable';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asin: "",
      product: {},
      previous_products: [],
      progress_message: false
    };
  }
  componentWillMount() {
    this.fetchProducts();
  }
  fetchProducts = () => {
    fetch(`http://localhost:3001/products`, {
        credentials: 'same-origin',
        opts: { method: 'GET' } })
    .then((response) => {
        response.json().then((json) => this.setState({ ...this.state, previous_products: json }));
    })
    .catch((error) => console.log(error));
  }
  handleChange = (event) => {
    this.setState({asin: event.target.value})
  }
  handleClick = (event) => {
    this.setState({...this.state, progress_message: `loading ${this.state.asin}...`})
    fetch(`http://localhost:3001/dp/${this.state.asin}`, {
        credentials: 'same-origin',
        opts: { method: 'GET' } })
    .then((response) => {
      if (response.status === 200) {
        response.json().then(this.displayFoundProduct)
      } else {
        this.setState({...this.state, progress_message: "Could not locate product :-("})
      }
    })
    .then(this.fetchProducts)
    .catch((error) => console.log(error));
  }
  displayFoundProduct = (json) => (
    this.setState({...this.state, product: json, progress_message: false})
  )
  render() {
    const { asin, product, previous_products, progress_message } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img className="Logo" src="checkitlogo.png"/>
          <h1>CheckIt</h1>
          <h2>Look up Amazon products by ASIN</h2>
        </header>
        <main>
          <section className="search_area">
            <label htmlFor="asin">Enter a product ASIN:</label>
            <input name="asin" type="text" value={asin} onChange={this.handleChange} />
            <button onClick={this.handleClick}>CheckIt!</button>
          </section>
          <section className="result_area">
            {this.state.progress_message ? <p> {progress_message} </p> : <ProductTable products={[product]}/>}
          </section>
          <section className="previous_results">
            <h3>Previously found products:</h3>
            <ProductTable products={previous_products}/>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
