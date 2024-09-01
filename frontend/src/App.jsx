import React from 'react';
import { ProductProvider } from './context/ProductContext';
import ProductTable from './components/ProductTable';
import { Container } from '@mui/material';

function App() {
  return (
    <ProductProvider>
      <Container>
        <ProductTable />
      </Container>
    </ProductProvider>
  );
}

export default App;
