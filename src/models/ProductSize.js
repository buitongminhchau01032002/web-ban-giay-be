const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const ProductSizeSchema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            require: true,
        },
        size: {
            type: Number,
            require: true,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        saledQuantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

ProductSizeSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
ProductSizeSchema.plugin(AutoIncrement, { id: 'product_sizes', inc_field: 'id' });

module.exports = mongoose.model('product_sizes', ProductSizeSchema);
