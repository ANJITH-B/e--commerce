var db = require('../config/connection');
var collection = require('../config/collections');
var objectId = require("mongodb").ObjectId

module.exports = {
  addProduct: (product, callback) => {
    //console.log(product);
    db.get().collection('product').insertOne(product).then((data) => {
      //console.log(data);
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
        .updateOne({ _id:objectId(prodId) }, {
          $set: {
            Name: proDetails.Name,
            // Price: proDetails.Price,
            Category: proDetails.Category,
            description: proDetails.description,
          }
        }).then((response) => {
          if (response.modifiedCount > 0) {
            resolve()
          } else {
            reject(new Error("No prouduct updated"))
          }
        })
    })
  }
}  