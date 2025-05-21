const Category = require('../models/category');
const Product = require('../models/product');
const ProductImage = require('../models/productImage');

const getAllProducts = async (request, response,next) => {
    try {
        const products = await Product.findAll({
            where: {
                isDeleted: 0,
            },
            include: [
                {
                    model: ProductImage,
                    required: false,
                    as: 'images',
                    attributes: ['productId', 'url']
                },
                {
                    model: Category,
                    required:false,
                    as : 'categories',
                    attributes: ['id', 'name'],
                    through:{attributes:[]}
                }],
            // raw: true,
        });
        response.json(products);
        response.end();
    } catch (error) {
        next({status:404,message:'Error ->' + error});
    }
}

//  /product?id=20
const getProduct = async (request, response,next) => {
    const { id } = request.query;
    const productId = parseInt(id);
    let error = '';

    if (!Number.isNaN(productId)) {
        const product = await Product.findOne({
            attributes: ['id', 'price', 'name', 'description', 'quantity'],
            where: { id },
            include: [
            {
                model: ProductImage,
                required: false,
                as: 'images',
                attributes: ['productId', 'url']
            },
            {
                model: Category,
                required:false,
                as : 'categories',
                attributes: ['id', 'name'],
                through:{attributes:[]}
            }],
        })
        
        // product.setCategories([1,4,5]);
        if (product) {
            response.json(product); // location of ejs file in th view
            response.end();
        } else {
            error = `Product with id #${id} was not found`;
        }
    } else {
        error = 'Invalid product id passed';
    }
    if (error) {
        next({status:404,message:'Error ->' + error});
    }
}


module.exports = {
    getAllProducts,
    getProduct
}