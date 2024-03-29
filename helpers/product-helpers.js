var db = require('../config/connection');
var collection = require('../config/collections');
var objectId = require("mongodb").ObjectId

module.exports = {
  addProduct: (product, callback) => {
    db.get().collection('product').insertOne(product).then((data) => {
      callback(data.insertedId);
    })
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
      resolve(products)
    })
  },
  deleteProducts: (prodId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(prodId) }).then((response) => {
        resolve(response)
      })
    })
  },
  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
        resolve(product)
      })
    })
  },
  updateProduct: (prodId, proDetails) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.PRODUCT_COLLECTION)
        .updateOne({ _id: objectId(prodId) }, {
          $set: {
            Name: proDetails.Name,
            Category: proDetails.Category,
            description: proDetails.description,
            Price: proDetails.Price,
            // Price: proDetails.Price,
          }
        }).then((response) => {
          resolve()
        })
    })
  }
}  