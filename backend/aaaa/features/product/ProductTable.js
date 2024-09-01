import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, toggleRecommended, toggleBestSeller, changePage, changeRowsPerPage } from './productSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, TablePagination } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';

const ProductTable = () => {
  const dispatch = useDispatch();
  const { products, page, rowsPerPage, totalItems, status } = useSelector(state => state.product);

  useEffect(() => {
    dispatch(fetchProducts({ page, rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleRecommendedToggle = (id) => {
    dispatch(toggleRecommended(id));
  };

  const handleBestSellerToggle = (id) => {
    dispatch(toggleBestSeller(id));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(changePage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(changeRowsPerPage(parseInt(event.target.value, 10)));
    dispatch(changePage(1));
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Recommended</TableCell>
              <TableCell>Best Seller</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === 'loading' ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>SAR {product.price}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isRecommended}
                      onChange={() => handleRecommendedToggle(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isBestseller}
                      onChange={() => handleBestSellerToggle(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <Edit />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalItems}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProductTable;
