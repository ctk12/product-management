import React, { useContext, useState } from 'react';
import { ProductContext } from '../context/ProductContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  TablePagination,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 'calc(100vh - 40%)',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  boxShadow: 4,
  p: 4,
};

const styleForm = {
  width: 500,
  height: 350,
  bgcolor: 'background.paper',
  border: '1px solid gray',
  boxShadow: 4,
  p: 4,
  margin: '20px 0',
};

const ProductTable = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditValue(null);
  };

  const {
    products,
    status,
    page,
    rowsPerPage,
    totalItems,
    setPage,
    setRowsPerPage,
    toggleRecommended,
    toggleBestSeller,
    deleteProduct,
    updateProduct,
    addProduct,
  } = useContext(ProductContext);

  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleEdit = (data) => {
    setEditValue(data);
    setIsEdit(true);
    handleOpen();
  }

  const handleAdd = () => {
    if (!editValue) {
      alert(`Fields are required!`);
      return;
    }

    const editValueKeys = Object.keys(editValue);

    const keys = ["name", "description", "price", "status"];
    for (let key of keys) {
      if (!editValueKeys.includes(key) || !editValue[key]) {
        alert(`Field ${key} is required!`);
        return;
      }
      if (key === "price" && editValue[key] && !isNumeric(editValue[key])) {
        alert(`Field ${key} is required numeric value`);
        return;
      }
    }

    addProduct(editValue);
    setEditValue(null);
    alert("Product Added");
  }

  const handleSave = () => {
    if (!editValue) {
      alert(`Fields are required!`);
      return;
    }

    for (let key in editValue) {
      if (!editValue[key]) {
        alert(`Field ${key} is required!`);
        return;
      }
      if (key === "price" && editValue[key] && !isNumeric(editValue[key])) {
        alert(`Field ${key} is required numeric value`);
        return;
      }
    }

    const data = {...editValue};
    delete data["id"];
    updateProduct(editValue.id, data);
    handleClose();
    alert("Product Updated");
  }

  return (
    <>
      <Box sx={styleForm}>
          <Typography id="modal-modal-title" marginBottom="20px" variant="h6" component="h2">
            Add Product
          </Typography>

            <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="outlined-required1"
                label="Name"
                value={!isEdit && editValue && editValue?.name ? editValue.name : ""}
                onChange={(e) => {
                  const name = e.target.value;
                  if (editValue) {
                    setEditValue({ ...editValue, name });
                  } else {
                    setEditValue({ name });
                  }
                }}
              />
               <TextField
                required
                id="outlined-required1"
                label="Description"
                value={!isEdit && editValue && editValue?.description ? editValue.description : ""}
                onChange={(e) => {
                  const description = e.target.value;
                  if (editValue) {
                    setEditValue({ ...editValue, description });
                  } else {
                    setEditValue({ description });
                  }
                }}
              />
              <TextField
                required
                id="outlined-required1"
                label="Price"
                value={!isEdit && editValue && editValue?.price ? editValue.price : ""}
                onChange={(e) => {
                  const price = e.target.value;
                  if (editValue) {
                    setEditValue({ ...editValue, price });
                  } else {
                    setEditValue({ price });
                  }
                }}
              />
             <div>
             <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label1">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Status"
                  value={!isEdit && editValue && editValue?.status ? editValue.status : ""}
                  onChange={(e) => {
                    const status = e.target.value;
                    if (editValue) {
                      setEditValue({ ...editValue, status });
                    } else {
                      setEditValue({ status });
                    }
                  }}
                >
                  <MenuItem value="active">active</MenuItem>
                  <MenuItem value="inactive">inactive</MenuItem>
                </Select>
              </FormControl>
             </div>
            </div>
            </Box>
          
          <Stack spacing={7} direction="row" marginLeft="10px" marginTop="20px">
            <Button variant="contained" onClick={handleAdd}>Add</Button>
          </Stack>
        </Box>


    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Status</TableCell>
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
              <>
              {products && products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    {product.price}
                  </TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isRecommended}
                      onChange={() => toggleRecommended(product._id, product.isRecommended)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isBestseller}
                      onChange={() => toggleBestSeller(product._id, product.isBestseller)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit({
                      id: product._id, 
                      name: product.name, 
                      description: product.description,
                      price: product.price,
                      status: product.status,
                    })}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => confirm(`are your sure to delete ${product.name} product?`) ? deleteProduct(product._id) : {}}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalItems > 0 && (
         <TablePagination
         component="div"
         count={totalItems}
         page={page - 1}
         onPageChange={handleChangePage}
         rowsPerPage={rowsPerPage}
         onRowsPerPageChange={handleChangeRowsPerPage}
       />
      )}
    </Paper>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" marginBottom="20px" variant="h6" component="h2">
            Edit Product
          </Typography>

          {isEdit && editValue && (
            <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="outlined-required"
                label="Name"
                defaultValue={editValue.name}
                onChange={(e) => {
                  const name = e.target.value;
                  if (editValue) {
                    setEditValue({ ...editValue, name });
                  } else {
                    setEditValue({ name });
                  }
                }}
              />
               <TextField
                required
                id="outlined-required"
                label="Description"
                defaultValue={editValue.description}
                onChange={(e) => {
                  const description = e.target.value;
                  if (editValue) {
                    setEditValue({ ...editValue, description });
                  } else {
                    setEditValue({ description });
                  }
                }}
              />
              <TextField
                required
                id="outlined-required"
                label="Price"
                defaultValue={editValue.price}
                onChange={(e) => {
                  const price = e.target.value;
                  if (editValue) {
                    setEditValue({ ...editValue, price });
                  } else {
                    setEditValue({ price });
                  }
                }}
              />
             <div>
             <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={editValue.status}
                  label="Status"
                  onChange={(e) => {
                    const status = e.target.value;
                    if (editValue) {
                      setEditValue({ ...editValue, status });
                    } else {
                      setEditValue({ status });
                    }
                  }}
                >
                  <MenuItem value="active">active</MenuItem>
                  <MenuItem value="inactive">inactive</MenuItem>
                </Select>
              </FormControl>
             </div>
            </div>
            </Box>
          )}
          
          <Stack spacing={7} direction="row" marginLeft="10px" marginTop="20px">
            <Button variant="contained" onClick={handleSave}>Save</Button>
            <Button variant="outlined" onClick={handleClose}>Close</Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ProductTable;
