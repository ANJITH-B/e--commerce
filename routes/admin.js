var express = require('express');
const { helpers } = require('handlebars');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products});
  })
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})
router.post('/add-product',(req,res)=>{
  //console.log(req.body);
  // console.log(req.files.image);

  productHelpers.addProduct(req.body,(insertedId)=>{
    let image=req.files.image
    //console.log(insertedId);
    image.mv('./public/product-images/'+insertedId+'.jpg',(err)=>{
      if(!err){
        res.render("admin/add-product");
        console.log('product added')
      }
      else{
        console.log(err);
      }
    }) 
  })
})

module.exports = router;
