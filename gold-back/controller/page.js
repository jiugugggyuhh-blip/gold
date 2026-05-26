const productmodel = require("../model/product");

exports.products = async (req, res) => {
    try {
        const Product = await productmodel.find({})
        res.json({ data: Product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
