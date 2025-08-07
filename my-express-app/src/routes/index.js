// This file sets up the API routes for the application and connects them to the corresponding controller functions.

const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers } = require('../controllers/index');

// Route to create a new customer
router.post('/customers', createCustomer);

// Route to retrieve all customers
router.get('/customers', getCustomers);

module.exports = router;