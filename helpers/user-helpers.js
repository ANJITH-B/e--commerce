var db = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { response } = require('../app');
// const { ObjectId } = require('mongodb');
var objectId = require("mongodb").ObjectId

module.exports = {

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data);
            }).catch((err) => { reject(err) })
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        // response.message = "login success"
                        resolve(response);
                    } else {
                        console.log("login failed incorrect password")
                        resolve({ status: false, message: "incorrect password !", loginErr: true })
                    }
                })
            } else {
                console.log("login failed user not found")
                resolve({ status: false, message: "Invalid email !", loginErr: true })

            }
        })
    },
    addToCart: (proId, userId) => {
        return new Promise(async (resolve, reject) => {
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            if (userCart) {
                console.log('Cart exists');
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId) },
                    {
                        $push: { products: objectId(proId) }
                    }
                ).then((response) => {
                    resolve()
                })

            } else {
                let cartObj = {
                    user: objectId(userId),
                    products: [objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        let: { proList: "$products" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$proList']
                                    }
                                }
                            }
                        ], 
                        as: 'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }

}