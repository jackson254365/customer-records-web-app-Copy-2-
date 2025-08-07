// src/controllers/index.js

const db = require('../db'); // Assuming db.js handles SQLite connection
const { validationResult } = require('express-validator');

// Function to create a new customer
const createCustomer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
        const result = await db.run('INSERT INTO customers (name, email) VALUES (?, ?)', [name, email]);
        res.status(201).json({ id: result.lastID, name, email });
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error });
    }
};

// Function to retrieve all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await db.all('SELECT * FROM customers');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers', error });
    }
};

// Function to retrieve a customer by ID
const getCustomerById = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await db.get('SELECT * FROM customers WHERE id = ?', [id]);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customer', error });
    }
};

// Exporting the controller functions
module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
};