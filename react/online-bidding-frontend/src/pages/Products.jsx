import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { getAllProducts, getAllCategories, updateProduct, deleteProduct, getBidsForProduct } from '../api';
import GavelIcon from '@mui/icons-material/Gavel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE = 'http://localhost:8080';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    expiryDate: '',
    sellerEmail: localStorage.getItem('email') || '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      console.log('Products from API:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBids = async (productId) => {
    try {
      const response = await getBidsForProduct(productId);
      if (response.data) {
        setBids(response.data);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      expiryDate: product.expiryDate,
      sellerEmail: product.sellerEmail,
    });
    setEditOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        id: selectedProduct.id,
        ...newProduct,
        price: parseFloat(newProduct.price),
        photoUrl: selectedProduct.photoUrl
      });
      setSuccess('Product updated successfully!');
      setEditOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(selectedProduct.id);
      setSuccess('Product deleted successfully!');
      setDeleteOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddOpen = () => {
    setAddOpen(true);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      expiryDate: '',
      sellerEmail: localStorage.getItem('email') || '',
    });
    setPhoto(null);
    setPhotoError('');
  };

  const handleAddClose = () => {
    setAddOpen(false);
    setPhotoError('');
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setPhotoError('Photo must be less than 2MB');
      setPhoto(null);
      return;
    }
    setPhoto(file);
    setPhotoError('');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.sellerEmail) {
      setPhotoError('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(newProduct)], { type: 'application/json' }));
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch(`${API_BASE}/products/add`, {
        method: 'POST',
        body: formData,
      });
      const msg = await res.text();
      if (res.ok) {
        setSuccess('Product added successfully!');
        fetchProducts();
        setAddOpen(false);
      } else {
        setPhotoError(msg || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setPhotoError('Failed to add product. Please try again.');
    }
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Products</Typography>
          <Button variant="contained" color="primary" onClick={handleAddOpen}>
            Add Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.photoUrl ? `${API_BASE}${product.photoUrl}` : 'https://via.placeholder.com/300x200'}
                  alt={product.name}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit Product">
                        <IconButton color="primary" onClick={() => handleEditClick(product)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Product">
                        <IconButton color="error" onClick={() => handleDeleteClick(product)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Category: {product.category}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Seller: {product.sellerEmail}
                  </Typography>
                  {!localStorage.getItem('isAdmin') && (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<GavelIcon />}
                      fullWidth
                      onClick={() => navigate(`/bidding/${product.id}`)}
                    >
                      Place Bid
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredProducts.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" textAlign="center">
                No products found
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Add Product Dialog */}
        <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Product</DialogTitle>
          <form onSubmit={handleAddProduct}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    inputProps={{ min: "0" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    type="date"
                    value={newProduct.expiryDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button variant="outlined" component="span" fullWidth>
                      Upload Photo
                    </Button>
                  </label>
                  {photo && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected: {photo.name}
                    </Typography>
                  )}
                  {photoError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {photoError}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Add Product
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Product</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                {selectedProduct && selectedProduct.photoUrl && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <img
                        src={`${API_BASE}${selectedProduct.photoUrl}`}
                        alt={selectedProduct.name}
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Product Image (cannot be changed)
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                    inputProps={{ step: "0.01", min: "0" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    type="number"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    inputProps={{ min: "0" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    type="date"
                    value={newProduct.expiryDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Products; 