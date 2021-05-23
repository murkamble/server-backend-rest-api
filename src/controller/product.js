const Product = require('../models/product');
const shortid = require('shortid');
const slugify = require('slugify');
const Category = require('../models/category');

exports.createProduct = (req, res) => {
    const {
        name, price, quantity, description, category, createdBy
    } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy: req.user._id
    });

    product.save(((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.status(201).json({ product });
        }
    }));

}


exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug })
    .select('_id type')
    .exec((error, category) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if(category){
            Product.find({ category: category._id})
            .exec((error, products) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if(category.type){
                    if (products.length > 0) {
                        res.status(200).json({
                            products,
                            productsByPrice: {
                                under6K: products.filter(product => product.price <= 6000),
                                under10K: products.filter(product => product.price > 5000 && product.price <= 10000 ),
                                under20K: products.filter(product => product.price > 10000 && product.price <= 20000 ),
                                under30K: products.filter(product => product.price > 20000 && product.price <= 30000 ),
                                under40K: products.filter(product => product.price > 30000 && product.price <= 40000 ),
                                above40K: products.filter(product => product.price > 40000 )
                            }
                        })
                    }
                }else{
                    res.status(200).json({ products });
                }
            })
        }
    });
}


// exports.getProductsBySlug = (req, res) => {
//     const { slug } = req.params;
//     Category.findOne({ slug: slug })
//         .select("_id type")
//         .exec((error, category) => {
//             if (error) {
//                 return res.status(400).json({ error });
//             }

//             if (category) {
//                 Product.find({ category: category._id }).exec((error, products) => {
//                     if (error) {
//                         return res.status(400).json({ error });
//                     }

//                     if (category.type) {
//                         if (products.length > 0) {
//                             res.status(200).json({
//                                 products,
//                                 priceRange: {
//                                     under6k: 6000,
//                                     under10k: 10000,
//                                     under20k: 20000,
//                                     under30k: 30000,
//                                     under40k: 40000,
//                                     above40k: 40000
//                                 },
//                                 productsByPrice: {
//                                     under6K: products.filter(product => product.price <= 6000),
//                                     under10K: products.filter(product => product.price > 5000 && product.price <= 10000),
//                                     under20K: products.filter(product => product.price > 10000 && product.price <= 20000),
//                                     under30K: products.filter(product => product.price > 20000 && product.price <= 30000),
//                                     under40K: products.filter(product => product.price > 30000 && product.price <= 40000),
//                                     above40K: products.filter(product => product.price > 40000)
//                                 },
//                             });
//                         }
//                     } else {
//                         res.status(200).json({ products });
//                     }
//                 });
//             }
//         });
// };


exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if (productId) {
        Product.findOne({ _id: productId }).exec((error, product) => {
            if (error) return res.status(400).json({ error });
            if (product) {
                res.status(200).json({ product });
            }
        });
    } else {
        return res.status(400).json({ error: "Params required" });
    }
};


// new update
exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
      Product.deleteOne({ _id: productId }).exec((error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      });
    } else {
      res.status(400).json({ error: "Params required" });
    }
  };
  
  exports.getProducts = async (req, res) => {
    const products = await Product.find({ createdBy: req.user._id })
      .select("_id name price quantity slug description productPictures category")
      .populate({ path: "category", select: "_id name" })
      .exec();
  
    res.status(200).json({ products });
  };
  