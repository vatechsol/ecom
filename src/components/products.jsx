import * as React from 'react';
import Compress from 'compress.js';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Modal, TextField, Box } from '@mui/material';

const columns = (handleDelete, handleEdit) => [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'ProductName', headerName: 'Product Name', width: 130 },
  { field: 'Category', headerName: 'Category', width: 130 },
  { field: 'Brand', headerName: 'Brand', width: 160 },
  { field: 'Price', headerName: 'Price', width: 100 },
  { field: 'description', headerName: 'Description', width: 160 },
  { field: 'type', headerName: 'Type', width: 160 },
  { field: 'outOfStock', headerName: 'Out Of Stock', width: 160 },
  {
    field: 'image',
    headerName: 'Image',
    width: 160,
    renderCell: (params) => (
      <img src={params.value} alt="product" style={{ width: '100%', height: 'auto' }} />
    ),
  },
  {
    field: 'delete',
    headerName: 'Delete',
    width: 160,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="error"
        onClick={() => handleDelete(params.row.id)}
      >
        Delete
      </Button>
    ),
  },
  {
    field: 'edit',
    headerName: 'Edit',
    width: 100,
    renderCell: (params) => (
      <Button variant="contained" onClick={() => handleEdit(params.row)}>
        Edit
      </Button>
    ),
  },
];

// Modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ProductTable() {
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [formData, setFormData] = React.useState({
    id: '',
    ProductName: '',
    Category: '',
    Brand: '',
    Price: '',
    description: '',
    type: '',
    outOfStock: '',
    image: '', // For storing the base64 image string
  });

  const paginationModel = { page: 0, pageSize: 5 };

  const handleOpen = () => {
    setEditMode(false);
    setFormData({
      id: '',
      ProductName: '',
      Category: '',
      Brand: '',
      Price: '',
      description: '',
      type: '',
      outOfStock: '',
      image: '',
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compress = new Compress();
      const resizedImage = await compress.compress([file], {
        size: 2, // Set the max size in MB
        quality: 0.75, // Adjust the quality
        maxWidth: 800, // Adjust image width (resize)
        maxHeight: 600, // Adjust image height
      });
  
      const base64Image = resizedImage[0].data;
      setFormData({
        ...formData,
        image: `data:image/${resizedImage[0].ext};base64,${base64Image}`,
      });
    }
  };

  const handleSubmit = () => {
    const product = editMode ? formData : { ...formData, id: rows.length + 1 };
  
    fetch("http://localhost:8000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Server error');
        }
        // Check if the response is JSON or plain text
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json(); // Parse as JSON if content type is JSON
        } else {
          return response.text(); // Parse as text otherwise
        }
      })
      .then((data) => {
        console.log('Response from server:', data);
        const updatedRows = editMode
          ? rows.map((row) => (row.id === product.id ? product : row))
          : [...rows, product];
  
        // Update localStorage and state with the new or edited product
        localStorage.setItem('products', JSON.stringify(updatedRows));
        setRows(updatedRows);
        handleClose();
      })
      .catch((err) => console.error('Failed to submit product:', err));
  };
  
  const handleDelete = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    localStorage.setItem('products', JSON.stringify(updatedRows));
    setRows(updatedRows);
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setFormData(product);
    setOpen(true);
  };

  // Load from localStorage if available
  React.useEffect(() => {
    
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setRows(JSON.parse(storedProducts));
    }
  }, []);

  return (
    <div>
      {/* Container for Add Product Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4, marginTop: 4 }}>
        <Button variant="contained" disableElevation onClick={handleOpen}>
          Add Product
        </Button>
      </Box>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns(handleDelete, handleEdit)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Modal for adding/editing product */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
          <TextField
            label="Product Name"
            name="ProductName"
            fullWidth
            margin="normal"
            value={formData.ProductName}
            onChange={handleInputChange}
          />
          <TextField
            label="Category"
            name="Category"
            fullWidth
            margin="normal"
            value={formData.Category}
            onChange={handleInputChange}
          />
          <TextField
            label="Brand"
            name="Brand"
            fullWidth
            margin="normal"
            value={formData.Brand}
            onChange={handleInputChange}
          />
          <TextField
            label="Price"
            name="Price"
            fullWidth
            margin="normal"
            value={formData.Price}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            label="Type"
            name="type"
            fullWidth
            margin="normal"
            value={formData.type}
            onChange={handleInputChange}
          />
          <TextField
            label="Out of Stock"
            name="outOfStock"
            fullWidth
            margin="normal"
            value={formData.outOfStock}
            onChange={handleInputChange}
          />

          {/* Image Upload Input and Submit Button aligned side by side */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, paddingBottom:2}}>
            <Button variant="contained" component="label" sx={{ mr: 2 }}>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>

            <Button variant="contained" onClick={handleSubmit}>
              {editMode ? 'Update' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}