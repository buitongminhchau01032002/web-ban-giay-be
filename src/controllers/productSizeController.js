const ProductSize = require('../models/ProductSize');

// [POST] api/productSize
const create = async (req, res, next) => {
    const { product, size } = req.body;
    // Validate field
    if (!product || !size) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        const productSize = new ProductSize({
            product,
            size,
        });
        await productSize.save();

        return res.status(201).json({ success: true, productSize });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

// [DELETE] api/product-size/:id
const destroy = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed id' });
    }

    try {
        await ProductSize.delete({ id: req.params.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};

module.exports = { create, destroy };
