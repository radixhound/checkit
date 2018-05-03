import React from 'react';

/**
 * ProductRow is used by ProductTable to render rows
 */
const ProductRow = ({product}) => (
  <tr key={product.asin}>
    <td>{product.title}</td>
    <td>{product.rating}</td>
    <td>{product.rank}</td>
    <td>{product.asin}</td>
  </tr>
);

/**
 * ProductTable is a super simple html table for diplaying simple
 * amazon product information.
 */
const ProductTable = ({products}) => (
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Rating</th>
        <th>Rank</th>
        <th>ASIN</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product, i) => <ProductRow key={i} product={product}/>)}
    </tbody>
  </table>
);

export default ProductTable;
