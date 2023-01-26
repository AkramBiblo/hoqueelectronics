const express = require('express');
const router = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
router.use(cookieParser())
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

router.get('/', (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products LIMIT 30`
    con.query(sql, (err, result) => {
      res.render('home', {
        message: result,
        title: 'Laptop, Computer accessories, Gaming PC'
      })
    })
  })
})
router.get('/gallery', (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products ORDER BY Id DESC`
    con.query(sql, (err, result) => {
      res.render('gallery', {
        message: result,
        title: 'Laptop, Computer accessories, Gaming PC'
      })
    })
  })
})
router.get('/services', (req, res) => {
  res.render('services', {title: 'Services'})
})
router.get('/about', (req, res) => {
  res.render('about', {title: 'About'})
})
router.get('/contact', (req, res) => {
  res.render('contact', {title: 'Contact'})
})
router.get('/toptech2022admin', (req, res) => {
  res.render('admin', {title: 'admin'})
})
router.get('/forms', (req, res) => {
  res.render('forms', {title: 'forms'})
})
router.get('/details/:pid', (req, res) => {
  let PID = req.params.pid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Id = ${PID}`
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send({emptyResult:`Unexpected server error occurred`})
      } else {
        res.render('productDetails', {message: result[0], title: 'Product Details'})
      }
    })
  })

 
})
router.get('/products/all', (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products ORDER BY Id DESC`
    con.query(sql, (err, result) => {
      res.render('allProducts', {
        message: result,
        title: 'Laptop, Computer accessories, Gaming PC'
      })
    })
  })
})

router.get('/checkout', (req, res) => {
  res.render('checkout')
})

router.get('/mycart', (req, res) => {
  // if(req.cookies.cartData != undefined){
  //   let c = req.cookies.cartData;
  //   let ca = c.split('+');
  //   let data = [];
    
  //    for (let i = 0; i < ca.length; i++) {
  //      const e = ca[i];
  //     let arr = e.split(',')
  //     let product =  [PID, Title, Model, Brand, Qty, UnitPrice, TotalPrice] = [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]]
  //     // let product = [PID, Title, Model, Brand, Qty, UnitPrice, TotalPrice] 
  //     data.push(product)
  //   }
  //   res.render('mycart', {Title: 'My cart', cartData: data})
  // }
    
  res.render('mycart', {Title: 'My cart'})
})

router.post('/billingInfo', (req, res) => {
  let FullName = req.body.FullName;
  let Address = req.body.Address;
  let City = req.body.City;
  let Division = req.body.Division;
  let PostCode = req.body.PostCode;
  let Email = req.body.Email;
  let phoneNumber = req.body.phoneNumber;
  let CustomerID = 'Toptech' + FullName;
  let c = req.cookies.cartData;
    let order_details = c.split('+');

  const getDBInfo = require("../../db");
      const con = getDBInfo.con;
      con.connect((err) => {
        let sql_1 = `INSERT INTO orders (customer_id, order_details)
        VALUES ("${CustomerID}", "${order_details}")`
        con.query(sql_1, (err, result) => {})
      })
      con.connect((err) => {
        let sql_2 = `INSERT INTO customer (customer_id, name, address, city, division, postCode, email, phoneNumber)
        VALUES ("${CustomerID}", "${FullName}", "${Address}", "${City}", "${Division}", ${PostCode}, "${Email}", "${phoneNumber}")`
        con.query(sql_2, (err, result) => {
          // Lead to SSLCommarz payment intigration
          res.render('success', {title: 'Order Successful'})
        })
      })
})

router.post('/edit', (req, res) => {
  let PID = req.body.pid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Id = ${PID}`
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send({emptyResult:`Unexpected server error occurred`})
      } else {
        res.render('editProduct', {message: result[0], title: 'Edit Product'})
      }
    })
  })

 
})

router.post('/edit/update/:pid', (req, res) => {
      let PID = req.params.pid;
      let Title = req.body.Title;
      let KeyWords = req.body.KeyWords;
      let Brand = req.body.Brand;
      let Type = req.body.Type;
      let Model = req.body.Model;
      let Processor = req.body.Processor;
      let ProcessorFamily = req.body.ProcessorFamily;
      let Memory = req.body.Memory;
      let Storage = req.body.Storage;
      let GraphicsCard = req.body.GraphicsCard;
      let DisplayType = req.body.DisplayType;
      let Webcam = req.body.Webcam;
      let OS = req.body.OS;
      let Audio = req.body.Audio;
      let FR = req.body.FR;
      let Wireless = req.body.Wireless;
      let KF = req.body.KF;
      let Interface = req.body.Interface;
      let Battery = req.body.Battery;
      let BK = req.body.BK;
      let Dimensions = req.body.Dimensions;
      let Weight = req.body.Weight;
      let Color = req.body.Color;
      let PD = req.body.PD;
      let Remark = req.body.Remark;
      let Price = req.body.Price;
      let FullDesc = req.body.FullDesc;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `UPDATE products SET Title = "${Title}",
    Brand = "${Brand}", Type = "${Type}", Model = "${Model}", Processor = "${Processor}",
    ProcessorFamily = "${ProcessorFamily}", Memory = "${Memory}", Storage = "${Storage}", GraphicsCard = "${GraphicsCard}",
    DisplayType = "${DisplayType}", Webcam = "${Webcam}", OS = "${OS}", Audio = "${Audio}",
    FR = "${FR}", Wireless = "${Wireless}", KF = "${KF}", Interface = "${Interface}",
    Battery = "${Battery}", BK = "${BK}", Dimensions = "${Dimensions}", Weight = "${Weight}",
    Color = "${Color}", PD = "${PD}", Remark = "${Remark}", Price = "${Price}", FullDesc = "${FullDesc}", KeyWords = "${KeyWords}"
    WHERE Id = ${PID}`
    con.query(sql, (err, result) => {
        res.render('forms', {successMsg: 'Product updated seccessfully!!!'})
    })
  })

 
})

router.post('/search', (req, res) => {
  let si = req.body.search_input
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Title LIKE "%${si}%" OR Brand LIKE "%${si}%" OR Model LIKE "%${si}%" OR KeyWords LIKE "%${si}%"`
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render('search', {errorMessage: `Sorry! products not found. Try with proper name or brand.`})
        // res.send({emptyResult:`Sorry no product found with the name of <strong>${si}</strong>! Kindly search by product name or brand.`})
      } else {
        res.render('search', {message: result})
            //   let htmlCode = [] 
            //   result.forEach(function(product) {
            //    htmlCode.push( `<div class="gallery border p-2 m-2" style="width:270px;">
            //    <div class="container-fluid text-center">
            //        <h5>${product.Title}</h5>
            //    </div>
            //    <div class="p-2">
            //        <a href="#">
            //            <img src="/uploadedFiles/${product.File}" class="img-fluid rounded" height="300px" width="300px" alt="Product Image">
            //        </a>
            //    </div>
            //    <div class="col p-2">
            //        <p><strong>Brand :</strong> ${product.Brand}</p>
            //        <p><strong>Model :</strong> ${product.Model}</p>
            //        <p><strong>Description :</strong> ${product.Description}</p>
            //        <p><strong>Product Code :</strong> ${product.Id}</p>
            //        <p><strong>Price (BDT) :</strong> ${product.Price}</p>
            //        <button type="button" name="addToCart" productid="${product.Id}" brand="${product.Brand}" productTitle="${product.Title}" model="${product.Model}" price="${product.Price}" class="btn btn-outline-dark btn-sm addToCart">
            //                 <span class="fab fa-opencart"></span> Add to cart
            //         </button>
            //    </div>
            //  </div>`)
            //   })         
            //   res.send(htmlCode)
      }
    })
  })
})

router.get('/search/brand/:brand/:type', (req, res) => {
  let Brand = req.params.brand
  let Type = req.params.type
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Brand LIKE "%${Brand}%" AND Type LIKE "%${Type}%"`
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render('search', {errorMessage: `Sorry! This brand's products are not available right now. Try another brand.`})
      } else {       
        res.render('search', {message: result})
      }
    })
  })
})

router.post('/search/filterbybrand/:brand', (req, res) => {
  let Brand = req.params.brand
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Brand LIKE "%${Brand}%"`
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Sorry! ${Brand}'s products are not available right now. Try another brand.`); 
      } else {   
        // res.send(result)

          let htmlCode = [];
          for (const product of result) {

            htmlCode.push(`
          <div class="gallery border p-2 m-1" style="width:270px;">
            <div class="container-fluid text-center">
                <h5>${product.Title}</h5>
            </div>
            <div class="p-2">
                <a href="/details/${product.Id}">
                    <img src="/uploadedFiles/${product.File_1}" class="img-fluid rounded" height="500px" width="500px" alt="Product Image">
                </a>
            </div>
            <div class="col p-2">
                <p><strong>Brand :</strong>${product.Brand}</p>
                <p><strong>Model :</strong>${product.Model}</p>
                <p><strong>Description :</strong>${product.Description}</p>
                <p><strong>Product Code :</strong>${product.Id}</p>
                <p><strong>Price (BDT) :</strong>${product.Price}</p>
                <div id="${product.Id}">
                  <input type="hidden" name="productid" value="${product.Id}">
                  <input type="hidden" name="productTitle" value="${product.Title}">
                  <input type="hidden" name="model" value="${product.Model}">
                  <input type="hidden" name="brand" value="${product.Brand}">
                  <input type="hidden" name="price" value="${product.Price}">
                </div>
                <button onclick="addToCart(${product.Id})" name="addToCart" productid="${product.Id}" brand="${product.Brand}" productTitle="${product.Title}" model="${product.Model}" price="${product.Price}" class="btn btn-outline-dark btn-sm">
                    <span class="fab fa-opencart"></span> Add to cart
                </button>
            </div>
        </div>
            `)
          }
          res.send(htmlCode)
       }
      
    })
  })
})

// router.post('/addToCart', (req, res) => {
//   let PID = req.body.productid
//   let PT = req.body.productTitle
//   let model = req.body.model
//   let brand = req.body.brand
//   let price = req.body.price
//   let data = [PID,PT,model,brand,price]
//   if (req.cookies.cartData == undefined) {
//     res.cookie(`cartData=${data};path=/;`)
//     res.send('Product added to your cart successfully! <a href="/">Go back</a>')
//   } else {

//     let c = req.cookies.cartData;
//     let ca = c.split('+');
//      for (let i = 0; i < ca.length; i++) {
//        const e = ca[i];
//       let arr = e.split(',')
//       if (arr[0] == PID) {
//           return res.send('This item already added to your cart! <a href="/">Go back</a>')
//         }
//       }                                  
//     res.cookie(`cartData=${c + '+' + data};path=/;`);
//     res.send('Product added to your cart successfully! <a href="/">Go back</a>')
//   }
// })

router.get('/search/:accessories/:title', (req, res) => {
  let title = req.params.title
  let accessories = req.params.accessories
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Type LIKE "%${accessories}%" AND KeyWords LIKE "%${title}%"`
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render('search', {errorMessage: `Sorry! This products are not available right now. Try another brand.`})
      } else {       
        res.render('search', {message: result})
      }
    })
  })
})

router.post('/search/filterbypricerange', (req, res) => {
  let title = req.body.title
  let rangeFrom = req.body.rangeFrom
  let rangeTo = req.body.rangeTo
  Number(rangeFrom)
  Number(rangeTo)
  
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Title LIKE "%${title}%" AND Price >= ${rangeFrom} AND Price <= ${rangeTo}`
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render('search', {errorMessage: `Sorry! No products available within this price range. Kindly increase price range.`})
      } else {       
        res.render('search', {message: result})
      }
    })
  })
})


module.exports = router;