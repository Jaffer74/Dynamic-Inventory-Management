import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SortIcon from '@mui/icons-material/Sort';

const initialInventory = [
  { id: 1, name: 'Laptop', category: 'Electronics', quantity: 15, price: 1200 },
  { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 8, price: 250 },
  { id: 3, name: 'Monitor', category: 'Electronics', quantity: 5, price: 300 },
  { id: 4, name: 'Keyboard', category: 'Electronics', quantity: 20, price: 100 }
];

function InventoryManagement() {
  const [inventory, setInventory] = useState(initialInventory);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: ''
  });
  const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order

  const categories = [...new Set(inventory.map(item => item.category))];
  
  const filteredInventory = inventory
    .filter(item => !filter || item.category === filter)
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.quantity - b.quantity;
      return b.quantity - a.quantity;
    });

  const handleOpen = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData(item);
    } else {
      setEditItem(null);
      setFormData({ name: '', category: '', quantity: '', price: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      setInventory(inventory.map(item => 
        item.id === editItem.id ? { ...formData, id: item.id } : item
      ));
    } else {
      setInventory([...inventory, { ...formData, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Inventory Management</h1>
        <div>
          <FormControl style={{ minWidth: 120, marginRight: '10px' }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Item
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  Quantity
                  <Button 
                    size="small" 
                    onClick={toggleSortOrder}
                    startIcon={<SortIcon />}
                    style={{ marginLeft: '10px' }}
                  >
                    {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                  </Button>
                </div>
              </TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow 
                key={item.id}
                style={{ backgroundColor: item.quantity < 10 ? '#ffebee' : 'inherit' }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell style={{ color: item.quantity < 10 ? 'red' : 'inherit' }}>
                  {item.quantity}
                </TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    onClick={() => handleOpen(item)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(item.id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Category"
                required
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Button type="submit" variant="contained">
              {editItem ? 'Update' : 'Add'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InventoryManagement;
