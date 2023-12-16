const Customer = require('../models/Customer');
const argon2 = require('argon2');

// [GET] api/customer
const read = async (req, res, next) => {
    try {
        let customers;
        customers = await Customer.find();
        return res.status(200).json({ success: true, customers });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/customer
const create = async (req, res, next) => {
    const { name, address, phone, password, avatar } = req.body;

    // Validate field
    if (!name || !address || !phone || !password) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        // check exist customer
        let customer;
        customer = await Customer.findOne({ phone });
        if (customer) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: 'phone already exists' });
        }

        const hash = await argon2.hash(password);

        const newCustomer = new Customer({ name, address, phone, password: hash, avatar });
        await newCustomer.save();
        return res.status(201).json({ success: true, customer: newCustomer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [GET] api/customer/:id
const readOne = async (req, res, next) => {
    const id = req.params.id;
    try {
        let customer;
        customer = await Customer.findOne({ id });
        return res.status(200).json({ success: true, customer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [PUT] api/customer/:id
const update = async (req, res, next) => {
    const id = Number(req.params.id);
    const bodyObj = req.body;
    const updateObj = {};

    Object.keys(bodyObj).forEach((key) => {
        if (bodyObj[key] !== undefined) {
            updateObj[key] = bodyObj[key];
        }
    });

    // Update customer
    try {
        const newCustomer = await Customer.findOneAndUpdate({ id }, updateObj, {
            new: true,
        });
        return res.status(200).json({ success: true, customer: newCustomer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/customer/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await Customer.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/customer/login
const login = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        let customer;
        customer = await Customer.findOne({ phone });
        if (!customer) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: 'phone incorrect' });
        }

        if (!(await argon2.verify(customer.password, password))) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: 'password incorrect' });
        }

        return res.status(200).json({ success: true, customer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [POST] api/customer/change-password
const changePassword = async (req, res) => {
    const { phone, currentPassword, newPassword } = req.body;

    if (!phone || !currentPassword) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        let customer;
        customer = await Customer.findOne({ phone });
        if (!customer) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: 'phone incorrect' });
        }

        if (!(await argon2.verify(customer.password, currentPassword))) {
            return res
                .status(401)
                .json({ success: false, status: 401, message: 'password incorrect' });
        }

        const hash = await argon2.hash(newPassword);

        const newCustomer = await Customer.findOneAndUpdate(
            { phone },
            {
                password: hash,
            },
            {
                new: true,
            }
        );

        return res.status(200).json({ success: true, customer: newCustomer });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { read, create, readOne, update, destroy, login, changePassword };
