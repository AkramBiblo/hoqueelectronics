const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { resolve } = require("path");
const { title } = require("process");
const { type } = require("os");
router.use(cookieParser());
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// router.get("/", (req, res) => {
//   const getDBInfo = require("../../db");
//   const con = getDBInfo.con;
  
//   con.connect((err) => {
//     let sql = `SELECT * FROM all_products WHERE category = "Refrigerators & Freezer" ORDER BY Id DESC LIMIT 4`;
//     con.query(sql, (err, result) => {
//       let sRef = []
//       let wRef = []
//       let vRef = []
//       for (let i = 0; i < result.length; i++) {
//         const e = result[i];
//         let brand = e.brand;
//         if (brand == "Samsung") {
//           sRef.push(e)
//         } else if (brand == "Walton") {
//           wRef.push(e)
//         } else if (brand == "Vision") {
//           vRef.push(e)
//         }
        
//       }
//       new Promise((resolve, reject) => {
//         resolve([sRef, wRef, vRef])
//       }).then((data) => {
//         let sql = `SELECT * FROM all_products WHERE category = "LED TV" ORDER BY Id DESC LIMIT 4`;
//         con.query(sql, (err, result) => {
//           let sTV = []
//           let wTV = []
//           let vTV = []
//           for (let i = 0; i < result.length; i++) {
//             const e = result[i];
//             let brand = e.brand;
//             if (brand == "Samsung") {
//               sTV.push(e)
//             } else if (brand == "Walton") {
//               wTV.push(e)
//             } else if (brand == "Vision") {
//               vTV.push(e)
//             }
            
//           }})
          
//       }).then((data) => {
//         let sql = `SELECT * FROM all_products WHERE category = "Washing Machine" ORDER BY Id DESC LIMIT 4`;
//         con.query(sql, (err, result) => {
//           let sWM = []
//           let wWM = []
//           let vWM = []
//           for (let i = 0; i < result.length; i++) {
//             const e = result[i];
//             let brand = e.brand;
//             if (brand == "Samsung") {
//               sWM.push(e)
//             } else if (brand == "Walton") {
//               wWM.push(e)
//             } else if (brand == "Vision") {
//               vWM.push(e)
//             }
//           }
//           new Promise((resolve, reject) => {
//             resolve([[data], [sWM, wWM, vWM]])
//           }).then((data) => {
            
//           })
//         })

//       })
        
//       })
//     })
//   })

router.get("/", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products ORDER BY RAND() LIMIT 20`;
    con.query(sql, (err, result) => {
      res.render("home", {
        message: result,
        title: "Home",
      });
    });
  });
})

router.get("/StockDetails", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;

  con.connect((err) => {
    let brand = ["Walton","Vision","Samsung","Jamuna","Konka"]
    let category = ["Refrigerators & Freezer","LED TV","Air Conditioner","Washing Machine",
      "Air Cooler","Geyser","Kettle","Room Heater","Trimmer, Shaver & Hair Clipper",
      "Mosquito Bat","Water Purifier & Dispenser","Iron","Toaster, Cake & Sandwich Maker",
      "Rechargable Lamp & Torch","Voltage Stabilizer & Protector",
      "Sewing Machine","Gas Stove","Induction, Infrared & Hot Plate Cooker",
      "Rice Cooker","Grinder","Roti Maker","Pressure Cooker","Blender","Multi Cooker","Kitchen Hood"
    ]

            let dataReport = []
            let totalQty = 0;
            function addData(i, j, L) {
              setTimeout(()=> {}, 1000)
              dataReport[i][j].push(L)
              totalQty += L;
            }
          for (let i = 0; i < brand.length; i++) {
                setTimeout(()=> {}, 1000)

            const b = brand[i];
            let limit = brand.length - 1
            dataReport.push([])
            for (let j = 0; j < category.length; j++) {
              const c = category[j];
            let limitJ = category.length - 1

              dataReport[i].push([])
              let sql = `SELECT * FROM all_products WHERE brand = "${b}" AND category = "${c}"`
              con.query(sql, (err, result) => {
                let L = result.length
                setTimeout(()=> {}, 1000)
                addData(i, j, L)
                if (i == limit && j == limitJ) {
                  sendArrayData(dataReport, totalQty)
                }
              })
            }
          }

          function sendArrayData(data, tc) {
            let report = [brand, category, data, tc]
            // console.log(data[data.length - 1])
            res.render("staticReport", {
              message: report,
              title: "Static Report",
            });
          }
    
  })

})

router.get("/allproducts", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("allProducts", {
          title: "Product Upload Form",
        });
      } else {
        res.render("allProducts", {
          message: result,
          title: "Product Upload Form",
        });
      }
    });
  });
});


router.post("/productUpload", (req, res) => {
  let brand = req.body.brand;
  let m = req.body.model;
  var model = '';
  for (var i = 0; i < m.length; i++) {
    if (m.charAt(i) != '"') {
      model += m.charAt(i);
    } else {
      model += 'Inch'
    }
  }
  let category = req.body.category;
  let sub_category = req.body.sub_category;
  // if (sub_category == "Sub Category") {
  //   sub_category = ''
  // }
  let mrp = req.body.demoPrice;
  let offerPrice = req.body.offerPrice;
  let sub_description = req.body.sub_description;
  // let subD_2 = req.body.subD_2;
  // let subD_3 = req.body.subD_3;
  // let subD_4 = req.body.subD_4;
  // let subD_5 = req.body.subD_5;
  let displayImg = req.body.displayImg;
  let subImg_1 = req.body.subImg_1;
  let subImg_2 = req.body.subImg_2;
  let subImg_3 = req.body.subImg_3;
  let subImg_4 = req.body.subImg_4;
  let featureImg_1 = req.body.featureImg_1;
  let featureImg_2 = req.body.featureImg_2;
  let featureImg_3 = req.body.featureImg_3;
  let featureImg_4 = req.body.featureImg_4;
  let textfeature = req.body.textfeature;
  let warrentyInfo = req.body.warrentyInfo;
  
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE model = '${model}' && brand = '${brand}'`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        
          let sql = `INSERT INTO all_products (brand, model, category, sub_category, mrp, offer_price, sub_description, display_img, sub_img_1, sub_img_2, sub_img_3, sub_img_4, feature_img_1, feature_img_2, feature_img_3, feature_img_4, textfeature, warrenty)
        VALUES ("${brand}", "${model}", "${category}", "${sub_category}", "${mrp}", "${offerPrice}", "${sub_description}", "${displayImg}", "${subImg_1}", "${subImg_2}", "${subImg_3}", "${subImg_4}", "${featureImg_1}", "${featureImg_2}", "${featureImg_3}", "${featureImg_4}", '${textfeature}', "${warrentyInfo}")`;
          con.query(sql, (err, result) => {
            res.render("product_upload_form", {
              title: "Product Upload Form",
              successMsg: "Product uploaded successfully!"
            });
          });
      } else {
        res.render("product_upload_form", {
          title: "Product Upload Form",
          errorMessage: "This product already exists!"
        });
      }
    });
  })
  
});

router.post("/editedProductUpload", (req, res) => {
  let id = req.body.id;
  let brand = req.body.brand;
  let m = req.body.model;
  var model = '';
  for (var i = 0; i < m.length; i++) {
    if (m.charAt(i) != '"') {
      model += m.charAt(i);
    } else {
      model += 'Inch'
    }
  }
  let category = req.body.category;
  let sub_category = req.body.sub_category;
  // if (sub_category == "Sub Category") {
  //   sub_category = ''
  // }
  let mrp = req.body.demoPrice;
  let offerPrice = req.body.offerPrice;
  let sub_description = req.body.sub_description;
  // let subD_2 = req.body.subD_2;
  // let subD_3 = req.body.subD_3;
  // let subD_4 = req.body.subD_4;
  // let subD_5 = req.body.subD_5;
  let displayImg = req.body.displayImg;
  let subImg_1 = req.body.subImg_1;
  let subImg_2 = req.body.subImg_2;
  let subImg_3 = req.body.subImg_3;
  let subImg_4 = req.body.subImg_4;
  let featureImg_1 = req.body.featureImg_1;
  let featureImg_2 = req.body.featureImg_2;
  let featureImg_3 = req.body.featureImg_3;
  let featureImg_4 = req.body.featureImg_4;
  let textfeature = req.body.textfeature;
  let warrentyInfo = req.body.warrentyInfo;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `UPDATE all_products SET brand="${brand}", model="${model}", category="${category}", sub_category="${sub_category}", mrp="${mrp}", offer_price="${offerPrice}", sub_description="${sub_description}", display_img="${displayImg}", sub_img_1="${subImg_1}", sub_img_2="${subImg_2}", sub_img_3="${subImg_3}", sub_img_4="${subImg_4}", feature_img_1="${featureImg_1}", feature_img_2="${featureImg_2}", feature_img_3="${featureImg_3}", feature_img_4= "${featureImg_4}", textfeature="${textfeature}", warrenty= "${warrentyInfo}" WHERE id = ${id}`;
  con.query(sql, (err, result) => {
    res.render("product_upload_form", {
      title: "Product Upload Form",
      successMsg: "Product updated successfully!"
    });
  });

});

router.get("/productUploadForm", (req, res) => {
  res.render("product_upload_form", {
    title: "Product Upload",
  });
})

router.get("/updatemrp", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("updateMrp", {
          title: "Update MRP"
        });
      } else {
        res.render("updateMrp", {
          message: result,
          title: "Update MRP"
        });
      }
    });
  });
});

router.post("/updateMrp_", (req, res) => {
  let pid = req.body.pid;
  let mrp = req.body.mrp;
  let op = req.body.op;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `UPDATE all_products SET mrp = "${mrp}", offer_price = "${op}" WHERE id = ${pid}`;
    con.query(sql, (err, result) => {
      res.send("success")
    });
  });
});

router.post("/edit", (req, res) => {
  let PID = req.body.edit_search_input;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE id = ${PID}`;
    con.query(sql, (err, result) => {
      res.render("edit_product", {
        message: result[0],
        title: "Edit Product",
      });
    });
  });
});

router.post("/removeProduct", (req, res) => {
  let PID = req.body.remove_search_input;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `DELETE FROM all_products WHERE id = ${PID}`;
    con.query(sql, (err, result) => {
      let sql = `SELECT * FROM all_products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("allProducts", {
          successMsg: "Product removed successfully!",
          title: "Product Upload Form",
        });
      } else {
        res.render("allProducts", {
          message: result,
          successMsg: "Product removed successfully!",
          title: "Product Upload Form",
        });
      }
    });
    });
  });
});

router.post("/stockOut", (req, res) => {
  let PID = req.body.pid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `UPDATE all_products SET stock = "Stock Out" WHERE id = ${PID}`;
    con.query(sql, (err, result) => {
      let sql = `SELECT * FROM all_products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("allProducts", {
          successMsg: "Product updated successfully!",
          title: "Product Upload Form",
        });
      } else {
        res.render("allProducts", {
          message: result,
          successMsg: "Product updated successfully!",
          title: "Product Upload Form",
        });
      }
    });
    });
  });
});
router.post("/stockin", (req, res) => {
  let PID = req.body.pid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `UPDATE all_products SET stock = "" WHERE id = ${PID}`;
    con.query(sql, (err, result) => {
      let sql = `SELECT * FROM all_products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("allProducts", {
          successMsg: "Product updated successfully!",
          title: "Product Upload Form",
        });
      } else {
        res.render("allProducts", {
          message: result,
          successMsg: "Product updated successfully!",
          title: "Product Upload Form",
        });
      }
    });
    });
  });
});
router.get("/gallery", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products ORDER BY RAND() LIMIT 100`;
    con.query(sql, (err, result) => {
      res.render("gallery", {
        message: result,
        title: "Gallery",
      });
    });
  });
});

router.get("/gallery_showmore", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products ORDER BY RAND() LIMIT 200`;
    con.query(sql, (err, result) => {
      res.render("gallery", {
        message: result,
        title: "Gallery",
      });
    });
  });
});

router.get("/services", (req, res) => {
  res.render("services", { title: "Services" });
});
router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});
router.get("/he2024admin", (req, res) => {
  if (req.cookies.HEAdmin === undefined) {
    res.render("adminLogin", { title: "Admin login" });
  } else {
    var cmail = req.cookies.HEAdmin;
    const getDBInfo = require("../../db");
    const con = getDBInfo.con;
    con.connect(function (err) {
      var sql = "SELECT * FROM admin WHERE email = ?";
      con.query(sql, cmail, function (err, result) {
        if (result.length <= 0) {
          res.render("adminLogin", { title: "Admin login" });
        } else {
          var sql = `SELECT * FROM orders WHERE status = ""`;
            con.query(sql, function (err, result) {
              if (result.length > 0) {
                res.render("admin", {
                  title: "admin",
                  notify: result.length
                });
              } else {
                res.render("admin", {
                  title: "admin"
                });
              }
            })
        }
      });
    });
  }
  // res.render("adminLogin", {title: "Admin Login"})
})
// router.get("/he2024adminLoggedIn", (req, res) => {
//   const getDBInfo = require("../../db");
//   const con = getDBInfo.con;

//   con.connect(function (err) {
//     var sql = `SELECT * FROM orders WHERE status = ""`;
//     con.query(sql, function (err, result) {
//       if (result.length > 0) {
//         res.render("admin", {
//           title: "admin",
//           notify: result.length
//         });
//       } else {
//         res.render("admin", {
//           title: "admin"
//         });
//       }
//     })
//   })
  
// });
router.get("/forms_2", (req, res) => {
  res.render("form_2", { title: "forms" });
});
router.get("/forms", (req, res) => {
  res.render("forms", { title: "forms" });
});
router.get("/dealership", (req, res) => {
  res.render("dealership", { title: "Dealership" });
});

router.get("/store", (req, res) => {
  if (req.cookies.HEStore === undefined) {
    res.render("storeLogin", { title: "Store Login" });
  } else {
    res.render("store", { title: "Store Login" });
  }
});

router.get('/pcs2022admin', (req, res) => {
  if (req.cookies.pcs === undefined) {
    res.render('adminLogin', {title: 'Admin login'})
  } else {
    var cmail = req.cookies.pcs;
    const getDBInfo = require('../../db')
    const con = getDBInfo.con
    con.connect(function(err) {
      var sql = 'SELECT * FROM admin WHERE email = ?';
      con.query(sql, cmail, function (err, result) {
        if (result.length <= 0) {
            res.render('adminLogin', {errorMessage: 'Please input correct email and Password'})
        } else {
            res.render('admin', {title: 'Admin'})
        }

      });
    });
  }
})

router.post("/search/filterbybrand/:brand", (req, res) => {
  let Brand = req.params.brand;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE Brand LIKE "%${Brand}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(
          `Sorry! ${Brand}'s products are not available right now. Try another brand.`
        );
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const product of result) {
          htmlCode.push(`
              <div class="container-fluid text-center border imgHoverEffect p-2 m-2" style="max-width: 330px;">
                                <div class="container-fluid">
                                    <h6 style="color:#0d69d3"><strong>${product.model}</strong></h6>
                                </div>
                                <div class="container-fluid">
                                    <img src="${product.display_img}"
                                        alt="Product Image" height="auto" width="150px" />
                                </div>
                                <div class="container-fluid mt-2">
                                    <div class="row">
                                        <div class="col">
                                            <h6 style="color:#0d69d3">Tk.<del>${product.mrp}</del>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 style="color:#0d69d3">Tk.${product.offer_price}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search/fromAdminAllProductsForCustomer", (req, res) => {
  let si = req.body.model;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE model LIKE "%${si}%" OR brand LIKE "%${si}%" OR category LIKE "%${si}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Name does not match.`);
      } else {
        let htmlCode = [];
        for (const item of result) {
          htmlCode.push(`<tr class="bg-light text-dark">
            <td><img style="border-radius: 8px; max-height: 70px;max-width: 70px;" src="${item.sub_img_1}" alt="Image"></td>
            <td>${item.model}</td>
            <td>${item.category}</td>
            <td>${item.brand}</td>
            <td>${item.mrp}</td>
            <td>${item.offer_price}</td>
            <td><button type="button" name="addToCart" productid="${item.id}" brand="${item.brand}" productTitle="${item.category}" model="${item.model}" price="${item.offer_price}" class="btn btn-outline-dark btn-sm addToCart">
                <span class="fab fa-opencart"></span> Add to cart </button>
            </td>
            </tr>
        </tr>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

// router.get("/login", (req, res) => {
//   if (req.cookies.HEAdmin === undefined) {
//     res.render("adminLogin", { title: "Admin login" });
//   } else {
//     var cmail = req.cookies.HEAdmin;
//     const getDBInfo = require("../../db");
//     const con = getDBInfo.con;
//     con.connect(function (err) {
//       var sql = "SELECT * FROM admin WHERE email = ?";
//       con.query(sql, cmail, function (err, result) {
//         if (result.length <= 0) {
//           res.render("adminLogin", {
//             errorMessage: "Please input correct email and Password",
//           });
//         } else {
//           var sql = `SELECT * FROM orders WHERE status = ""`;
//             con.query(sql, function (err, result) {
//               if (result.length > 0) {
//                 res.render("admin", {
//                   title: "admin",
//                   notify: result.length
//                 });
//               } else {
//                 res.render("admin", {
//                   title: "admin"
//                 });
//               }
//             })
//         }
//       });
//     });
//   }

//   // res.render('admin', {title: 'Admin login'})
// });

router.post("/login", urlencodedParser, function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;

  con.connect(function (err) {
    var sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    con.query(sql, [email, password], function (err, result) {
      if (result.length <= 0) {
        res.render("adminLogin", {
          errorMessage: "Please input correct email and Password",
        });
      } else {
        if (req.cookies.HEAdmin === undefined) {
          let sec = 86400000;
          res.cookie("HEAdmin", `${email}`, { maxAge: sec });
        } else if (req.cookies.HEAdmin !== `${email}`) {
          res.cookie("HEAdmin", `${email}`);
        }
        var sql = `SELECT * FROM orders WHERE status = ""`;
            con.query(sql, function (err, result) {
              if (result.length > 0) {
                res.render("admin", {
                  title: "admin",
                  notify: result.length
                });
              } else {
                res.render("admin", {
                  title: "admin"
                });
              }
            })
      }
    });
  });
});

router.post("/storeLogin", (req, res) => {
  let ID = req.body.id;
  let pass = req.body.password;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let sql = `SELECT * FROM admin WHERE login_id = "${ID}" AND password = "${pass}"`;
  con.query(sql, (err, result) => {
    if (result.length <= 0) {
      res.render("storeLogin", {
        title: "Store Login",
        errorMessage: "Incorrect Login Id or Password!",
      });
    } else {
      if (req.cookies.HEStore === undefined) {
        let sec = 86400000;
        res.cookie("HEStore", `${ID}`, { maxAge: sec });
      } else if (req.cookies.HEStore !== `${ID}`) {
        res.cookie("HEStore", `${ID}`);
      }
      res.render("store", { title: "Store Login" });
    }
  });
});

router.get("/details/:pid", (req, res) => {
  let PID = req.params.pid;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE id = ${PID}`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send({ emptyResult: `Unexpected server error occurred` });
      } else {
        let category = result[0].category;
        let sql = `SELECT * FROM all_products WHERE category = "${category}" AND stock = "" ORDER BY RAND() LIMIT 5`;
        con.query(sql, (err, result_2) => {
          if (result_2.length <= 0) {
            res.render("demoPD", {
              message: result[0],
              title: "Product Details",
            });
          } else {
            res.render("demoPD", {
              message: result[0],
              relatedProducts: result_2,
              title: "Product Details",
            });
          }
        })
        
      }
    });
  });
});

router.get("/products/all", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      res.render("allProducts", {
        message: result,
        title: "Products",
      });
    });
  });
});

router.get("/products/allForStore", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store ORDER BY Id DESC`;
    con.query(sql, (err, result) => {
      res.render("allProductsForStore", {
        message: result,
        title: "Products",
      });
    });
  });
});

// router.get("/orders", (req, res) => {
//   const getDBInfo = require("../../db");
//   const con = getDBInfo.con;
//   con.connect((err) => {
//     let sql = `SELECT orders.customer_id, orders.order_details, orders.order_time, orders.status, customer.customer_name, customer.address, customer.phoneNumber
//     FROM orders INNER JOIN customer ON orders.customer_id=customer.customer_id`;
//     con.query(sql, (err, result) => {
//       if (result.length <= 0) {
//         res.render("orders", {
//           errorMessage: "No orders available.",
//           title: "Orders",
//         });
//       } else {
//         console.log(result)
//         let allOrders = [];
//         function pushOrderData(data) {
//           allOrders.push(data);
//         }
//         new Promise((resolve) => {
//           for (let i = 0; i < result.length; i++) {
//             const e = result[i];

//             if (e.status == "Done") {
//             } else {
              
//               let arr = [
//                 e.customer_name,
//                 e.address,
//                 e.phoneNumber,
//                 e.order_time,
//               ];


//               if (e.order_details.includes("+")) {
//                 let a = e.order_details.split("+");
//                 let orders = [];
//                 function addOrderToOrdersArray(o) {
//                   orders.push(o);
//                 }
//                 for (let i = 0; i < a.length; i++) {
//                   const elem = a[i];
//                   let split = elem.split(",");
//                   let order = [];
//                   order.push(split[2]);
//                   order.push(split[4]);
//                   addOrderToOrdersArray(order);
//                 }

//                 arr.push(orders);
//                 pushOrderData(arr);
//                 resolve(arr);
//               } else {

//                 let split = e.order_details.split(",");
//                 let order = [];
//                 order.push(split[2]);
//                 order.push(split[4]);
              
//               arr.push(order);
//               pushOrderData(arr);
//               resolve(arr);
//             }}
//           };
//         });
//         console.log(allOrders)
//         res.render("orders", { message: allOrders, title: "Orders" });
//       }
//     });
//   });
// });

router.get("/orders", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT orders.order_id, orders.customer_id, orders.order_details, orders.order_time, orders.status, customer.customer_name, customer.address, customer.phoneNumber
    FROM orders INNER JOIN customer ON orders.customer_id=customer.customer_id WHERE orders.status = ""`;
    con.query(sql, (err, result) => {
      if (result.length > 0) {
        let orders = []
        for (let i = 0; i < result.length; i++) {
          const e = result[i];
          if (e.status !== 'Done') {
            orders.push(e)
          }
        }
        res.render("orders", { message: orders, title: "Orders" });
      } else {
        res.render("orders", {
          errorMessage: "No orders available.",
          title: "Orders",
        });
      }
    });
  });
});

router.post("/get_custom_orders", (req, res) => {
  let from_date = req.body.from_date;
  let to_date = req.body.to_date
  
  // let from = new Date(`${from_date}`);
  // let to = new Date(`${to_date}`);

  
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  
  let sql = `SELECT orders.order_id, orders.customer_id, orders.order_details, orders.order_time, orders.cartTotal, orders.status, customer.customer_name, customer.address, customer.phoneNumber
    FROM orders INNER JOIN customer ON orders.customer_id=customer.customer_id WHERE order_time BETWEEN "${from_date}" AND "${to_date}"`;
  con.query(sql, (err, result) => {
    res.send(result)
  });
});

router.get("/allOrders", (req, res) => {
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT orders.order_id, orders.customer_id, orders.order_details, orders.order_time, orders.status, customer.customer_name, customer.address, customer.phoneNumber
    FROM orders INNER JOIN customer ON orders.customer_id=customer.customer_id WHERE orders.status = ""`;
    con.query(sql, (err, result) => {
      if (result.length > 0) {
        let orders = []
        for (let i = 0; i < result.length; i++) {
          const e = result[i];
          if (e.status !== 'Done') {
            orders.push(e)
          }
        }
        res.render("allOrders", { message: orders, title: "Orders" });
      } else {
        res.render("allOrders", {
          errorMessage: "No orders available.",
          title: "Orders",
        });
      }
    });
  });
});

router.post("/order_complete", (req, res) => {
  let order_id = req.body.order_id;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;

  con.connect(function (err) {
    let sql = `UPDATE orders SET status = "Order Complete" WHERE order_id = ${order_id}`
    con.query(sql, function (err, result) {
      let sql = `SELECT orders.order_id, orders.customer_id, orders.order_details, orders.order_time, orders.status, customer.customer_name, customer.address, customer.phoneNumber
      FROM orders INNER JOIN customer ON orders.customer_id=customer.customer_id WHERE orders.status = ""`;
      con.query(sql, (err, result) => {
        if (result.length > 0) {
          let orders = []
          for (let i = 0; i < result.length; i++) {
            const e = result[i];
            if (e.status !== 'Order Complete') {
              orders.push(e)
            }
          }
          res.render("orders", { message: orders, successMsg: "Order Updated Successfully!", title: "Orders" });
        } else {
          res.render("orders", {
            errorMessage: "No orders available.",
            title: "Orders",
          });
        }
      });
    })
  })
});
router.post("/soldOutQtyUpdate", (req, res) => {
  let itemName = req.body.itemName;
  let itemQty = req.body.itemQty;
  let CName = req.body.customerName;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  let arr = itemName.split(",");
  let arr2 = itemQty.split(",");
  for (let i = 0; i < arr.length; i++) {
    const model = arr[i];
    const qty = arr2[i];

    let sql = `SELECT Qty FROM products WHERE name = "${model}"`;
    con.query(sql, (err, result) => {
      let PrvQty = result[0].Qty;
      let PrsQty = Number(PrvQty) - Number(qty);
      let sql_1 = `UPDATE products SET Qty = ${PrsQty} WHERE name = "${model}"`;
      con.query(sql_1, (err, result) => {});
    });
  }
  let sql = `UPDATE orders SET status = "Done" WHERE customer_name = "${CName}"`;
  con.query(sql, (err, result) => {
    let sql_ = `SELECT orders.customer_name, orders.order_details, orders.order_time, orders.status, customer.address, customer.phoneNumber
    FROM orders INNER JOIN customer ON orders.customer_name=customer.customer_name`;
    con.query(sql_, (err, result) => {
      if (result.length <= 0) {
        res.send(`Name does not match.`);
      } else {
        let allOrders = [];
        function pushOrderData(data) {
          allOrders.push(data);
        }
        new Promise((resolve) => {
          result.forEach((item) => {
            if (item.status == "Done") {
            } else {
              let arr = [
                item.customer_name,
                item.address,
                item.phoneNumber,
                item.order_time,
              ];
              let a = item.order_details.split("+");
              let orders = [];
              function addOrderToOrdersArray(o) {
                orders.push(o);
              }
              for (let i = 0; i < a.length; i++) {
                const elem = a[i];
                let split = elem.split(",");
                let order = [];
                order.push(split[2]);
                order.push(split[4]);
                addOrderToOrdersArray(order);
              }
              arr.push(orders);
              pushOrderData(arr);
              resolve(arr);
            }
          });
        });
        res.render("orders", { message: allOrders, title: "Orders" });
      }
    });
  });
});

router.get("/checkout/:tcp", (req, res) => {
  let cardTotal = req.params.tcp;
  res.render("checkout", { message: { cardTotal: cardTotal }, title: "Checkout" });
  // res.render("checkout", { title: "Checkout" });
});

router.get("/mycart", (req, res) => {
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

  res.render("mycart", { Title: "My cart" });
});

router.post("/billingInfo", (req, res) => {
  let FullName = req.body.FullName;
  let Address = req.body.Address;
  // let City = req.body.City;
  // let Division = req.body.Division;
  // let PostCode = req.body.PostCode;
  // let Email = req.body.Email;
  let phoneNumber = req.body.phoneNumber;
  let c = req.cookies.cartData;
  let cartTotal = req.body.tcp;
  // let order_details = c.split('+');

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql_2 = `INSERT INTO customer (customer_name, address, phoneNumber)
        VALUES ("${FullName}", "${Address}", "${phoneNumber}")`;
    con.query(sql_2, (err, result) => {
      let cid = result.insertId;
      let sql_1 = `INSERT INTO orders (customer_id, order_details, cartTotal)
      VALUES ("${cid}", "${c}", ${cartTotal})`;
      con.query(sql_1, (err, result) => { });
      res.clearCookie("cartData");
      res.render("success", { title: "Order Successful" });
    });
  });
});



router.post("/updateMRP", (req, res) => {
  let id = req.body.id;
  let MRP = req.body.mrp;
  let DMRP = req.body.dmrp;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let query = `SELECT * FROM products WHERE Id = ${id}`;
    con.query(query, (err, result) => {
      if (result.length <= 0) {
        res.send(`<div class="container">
        <div class="alert alert-danger">
            Product code not found!
          </div>
        </div>`);
      } else {
        let sql = `UPDATE products SET mrp = ${MRP}, demo_MRP = ${DMRP} WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          res.send(` <div class="container">
        <div class="alert alert-success">
            MRP Updated successfully!
          </div>
        </div>`);
        });
      }
    });
  });
});

router.post("/updateQty", (req, res) => {
  let id = req.body.Id;
  let Model = req.body.Model;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let query = `SELECT * FROM products WHERE Id = ${id} AND name LIKE "%${Model}%"`;
    con.query(query, (err, result) => {
      if (result.length <= 0) {
        res.send(`<div class="container">
        <div class="alert alert-danger">
            Product Model & Code does not match!
          </div>
        </div>`);
      } else {
        let sql = `SELECT * FROM products WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          if (result.length >= 0) {
            let Q = result[0].Qty;
            let totalQty = Number(Qty) + Number(Q);
            let sql = `UPDATE products SET Qty = ${totalQty} WHERE Id = ${id}`;
            con.query(sql, (err, result) => {
              res.send(` <div class="container">
                <div class="alert alert-success">
                    Product Quantity Updated successfully!
                  </div>
                </div>`);
            });
          }
        });
      }
    });
  });
});

router.post("/updateQtyFromAP", (req, res) => {
  let id = req.body.Id;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Id = ${id}`;
    con.query(sql, (err, result) => {
      if (result.length >= 0) {
        let Q = result[0].Qty;
        let totalQty = Number(Qty) + Number(Q);
        let sql = `UPDATE products SET Qty = ${totalQty} WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          let sql = `SELECT * FROM products ORDER BY Id DESC`;
          con.query(sql, (err, result) => {
            res.render("allProducts", {
              message: result,
              title: "Products",
              successMsg: "Quantity Updated Successfully!",
            });
          });
        });
      }
    });
  });
});

router.post("/updateQtyFromStore", (req, res) => {
  let id = req.body.Id;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Id = ${id}`;
    con.query(sql, (err, result) => {
      if (result.length >= 0) {
        let Q = result[0].Qty;
        let totalQty = Number(Qty) + Number(Q);
        let sql = `UPDATE products_store SET Qty = ${totalQty} WHERE Id = ${id}`;
        con.query(sql, (err, result) => {
          let sql = `SELECT * FROM products_store ORDER BY Id DESC`;
          con.query(sql, (err, result) => {
            res.render("allProductsForStore", {
              message: result,
              title: "Products",
              successMsg: "Quantity Updated Successfully!",
            });
          });
        });
      }
    });
  });
});

router.post("/soldOutQtyUpdateForStore", (req, res) => {
  let id = req.body.Id;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Id = ${id}`;
    con.query(sql, (err, result) => {
      if (result.length >= 0) {
        let Q = result[0].Qty;
        if (Number(Q) < Number(Qty)) {
          let sql = `SELECT * FROM products_store WHERE Id = ${id}`;
          con.query(sql, (err, result) => {
            res.render("allProductsForStore", {
              message: result,
              title: "Products",
              errorMessage: "Insufficient Quantity!",
            });
          });
        } else {
          let totalQty = Number(Q) - Number(Qty);
          let sql = `UPDATE products_store SET Qty = ${totalQty} WHERE Id = ${id}`;
          con.query(sql, (err, result) => {
            let sql = `SELECT * FROM products_store ORDER BY Id DESC`;
            con.query(sql, (err, result) => {
              res.render("allProductsForStore", {
                message: result,
                title: "Products",
                successMsg: "Quantity Updated Successfully!",
              });
            });
          });
        }
      }
    });
  });
});

router.post("/edit/update/:pid", (req, res) => {
  let PID = req.params.pid;
  let Title = req.body.Title;
  let KeyWords = req.body.KeyWords;
  let Brand = req.body.Brand;
  let Type = req.body.Type;
  let Category = req.body.Category;
  let Color = req.body.Color;
  let Barcode = req.body.Barcode;
  let MRP = req.body.MRP;
  let Description = req.body.Description;
  let DMRP = req.body.demo_MRP;
  let Qty = req.body.Qty;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `UPDATE products SET name = "${Title}", brand = "${Brand}", type = "${Type}", demo_MRP = ${DMRP}, Qty = ${Qty}, 
    color = "${Color}", category = "${Category}", barcode = "${Barcode}", MRP = ${MRP}, description = "${Description}", keyWords = "${KeyWords}" WHERE Id = ${PID}`;
    con.query(sql, (err, result) => {
      res.render("forms", { successMsg: "Product updated seccessfully!!!" });
    });
  });
});

router.post("/search", (req, res) => {
  let m = req.body.search_input;
  var model = '';
  for (var i = 0; i < m.length; i++) {
    if (m.charAt(i) != '"') {
      model += m.charAt(i);
    } else {
      model += 'Inch'
    }
  }
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE model LIKE "%${model}%" OR brand LIKE "%${model}%" OR category LIKE "%${model}%" OR sub_category LIKE "%${model}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! product not found! Try with proper name or brand.`,
        });
        // res.send({emptyResult:`Sorry no product found with the name of <strong>${si}</strong>! Kindly search by product name or brand.`})
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

router.get("/search/:sub_category", (req, res) => {
  let sub_category = req.params.sub_category;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE sub_category LIKE "%${sub_category}%" OR category LIKE "%${sub_category}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! ${sub_category} are not available right now. Try another brand.`,
        });
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

router.get("/search/all/:category", (req, res) => {
  let category = req.params.category;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE category LIKE "%${category}%" OR sub_category LIKE "%${category}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! This brand's products are not available right now. Try another brand.`,
        });
      } else {
        res.render("search", { message: result });
      }
    });
  });
});



router.post("/search_store/filterbybrand", (req, res) => {
  let brand = req.body.brand;
  let type = req.body.type;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Brand LIKE "%${brand}%" AND type LIKE "%${type}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(
          `Sorry! ${brand}'s products are not available right now. Try another brand.`
        );
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const product of result) {
          htmlCode.push(`<tr>
          <td>${product.name}</td>
          <td>${product.type}</td>
          <td>${product.brand}</td>
          <td>${product.Qty}</td>
          <td>
            <form action="/updateQtyFromStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">Add</button>
            </form>
          </td>
          <td>
            <form action="/soldOutQtyUpdateForStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">
                Sold Out
              </button>
            </form>
          </td>
        </tr>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search_store/filterbybrand/:brand", (req, res) => {
  let brand = req.params.brand;

  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE Brand LIKE "%${brand}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(
          `Sorry! ${brand}'s products are not available right now. Try another brand.`
        );
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const product of result) {
          htmlCode.push(`<tr>
          <td>${product.name}</td>
          <td>${product.type}</td>
          <td>${product.brand}</td>
          <td>${product.Qty}</td>
          <td>
            <form action="/updateQtyFromStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">Add</button>
            </form>
          </td>
          <td>
            <form action="/soldOutQtyUpdateForStore" method="POST">
              <input type="hidden" name="Id" value="${product.Id}" />
              <input type="hidden" name="Model" value="${product.name}" />
              <input type="text" name="Qty" style="width: 50px" required/>
              <button type="submit" class="btn btn-outline-dark">
                Sold Out
              </button>
            </form>
          </td>
        </tr>
            `);
        }
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search/fromAdminAllProducts", (req, res) => {
  let si = req.body.brand;
  let dest = req.body.dest;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE model LIKE "%${si}%" OR brand LIKE "%${si}%" OR category LIKE "%${si}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Model does not match!`);
      } else {
        // res.send(result)
        let htmlCode = [];

        if (dest == "allProducts") {
          for (const item of result) {
            let model;
            if (item.model.includes('Inch')) { 
                  model = item.model.replace('Inch', '"')
                } else {
                  model = item.model
                }
            htmlCode.push(`
                <tr>
                  <td><img style="border-radius: 8px; max-height: 70px;max-width: 70px;" src="${item.display_img}" alt="Image"></td>
                  <td>${item.id}</td>
                  <td>${model}</td>
                  <td>${item.category}</td>
                  <td>${item.sub_category}</td>
                  <td>${item.brand}</td>
                  <td>${item.mrp}</td>
                  <td>${item.offer_price}</td>
                  <td>
                    <form action="/edit" method="post">
                      <input type="hidden" value="${item.id}" name="edit_search_input">
                      <button class="btn btn-outline-light" type="submit">Edit</button>
                    </form>
                  </td>
                  <td>
                    <form action="/removeProduct" method="post">
                      <input type="hidden" value="${item.id}" name="remove_search_input">
                      <button class="btn btn-outline-light" type="submit">Remove</button>
                    </form>
                  </td>
              </tr>
              `);
          }
        } else {
          for (const item of result) {
            let model;
            if (item.model.includes('Inch')) { 
                  model = item.model.replace('Inch', '"')
                } else {
                  model = item.model
                }
            htmlCode.push(`
               <tr id="${item.id}row">
                    <td><img style="border-radius: 8px; max-height: 70px;max-width: 70px;" src="${item.display_img}" alt="Image"></td>
                    <td>${model}</td>
                    <td>${item.category}</td>
                    <td>${item.brand}</td>
                    <td>
                      <input type="text" class="mrpinput" id="${item.id}mrp" style="width: 100px;" placeholder="MRP">
                      <span class="${item.id}prvMrp ${item.id}prvValue">${item.mrp}</span>
                    </td>
                    <td>
                      <input type="text" class="mrpinput" id="${item.id}op" style="width: 100px;" placeholder="Offer Price">
                      <span class="${item.id}prvOp ${item.id}prvValue">${item.offer_price}</span>
                    </td>
                    <!-- updateButton/editButton/ -->
                    <td>
                        <button class="btn btn-outline-light updateButton" pid="${item.id}" name="${item.id}updateButton">Update</button>
                        <button class="btn btn-outline-light editButton" pid="${item.id}" name="${item.id}editButton">Edit</button>
                    </td>
                </tr>
              `);
          }
        }
        
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search/searchByBrandAndCategory", (req, res) => {
  let brand = req.body.brand;
  let category = req.body.category;
  let dest = req.body.dest;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM all_products WHERE brand = "${brand}" AND category = "${category}"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Model does not match!`);
      } else {
        // res.send(result)
        let htmlCode = [];

        if (dest == "allProducts") {
          for (const item of result) {
            let model;
            if (item.model.includes('Inch')) { 
                  model = item.model.replace('Inch', '"')
                } else {
                  model = item.model
                }
            htmlCode.push(`
                <tr>
                  <td><img style="border-radius: 8px; max-height: 70px;max-width: 70px;" src="${item.display_img}" alt="Image"></td>
                  <td>${item.id}</td>
                  <td>${model}</td>
                  <td>${item.category}</td>
                  <td>${item.sub_category}</td>
                  <td>${item.brand}</td>
                  <td>${item.mrp}</td>
                  <td>${item.offer_price}</td>
                  <td>
                    <form action="/edit" method="post">
                      <input type="hidden" value="${item.id}" name="edit_search_input">
                      <button class="btn btn-outline-light" type="submit">Edit</button>
                    </form>
                  </td>
              </tr>
              `);
          }
        } else {
          for (const item of result) {
            let model;
            if (item.model.includes('Inch')) { 
                  model = item.model.replace('Inch', '"')
                } else {
                  model = item.model
                }
            htmlCode.push(`
               <tr id="${item.id}row">
                    <td><img style="border-radius: 8px; max-height: 70px;max-width: 70px;" src="${item.display_img}" alt="Image"></td>
                    <td>${model}</td>
                    <td>${item.category}</td>
                    <td>${item.brand}</td>
                    <td>
                      <input type="text" class="mrpinput" id="${item.id}mrp" style="width: 100px;" placeholder="MRP">
                      <span class="${item.id}prvMrp ${item.id}prvValue">${item.mrp}</span>
                    </td>
                    <td>
                      <input type="text" class="mrpinput" id="${item.id}op" style="width: 100px;" placeholder="Offer Price">
                      <span class="${item.id}prvOp ${item.id}prvValue">${item.offer_price}</span>
                    </td>
                    <!-- updateButton/editButton/ -->
                    <td>
                        <button class="btn btn-outline-light updateButton" pid="${item.id}" name="${item.id}updateButton">Update</button>
                        <button class="btn btn-outline-light editButton" pid="${item.id}" name="${item.id}editButton">Edit</button>
                    </td>
                </tr>
              `);
          }
        }
        
        res.send(htmlCode);
      }
    });
  });
});

router.post("/search/fromStoreAllProducts", (req, res) => {
  let si = req.body.brand;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products_store WHERE name LIKE "%${si}%" OR brand LIKE "%${si}%" OR type LIKE "%${si}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.send(`Name does not match.`);
      } else {
        // res.send(result)

        let htmlCode = [];
        for (const item of result) {
          htmlCode.push(`<tr>
            <td>${item.Id}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.brand}</td>
            <td>${item.Qty}</td>
            <td>
              <form action="/updateQtyFromStore" method="POST">
                <input type="hidden" name="Id" value="${item.Id}">
                <input type="hidden" name="Model" value="${item.name}">
                <input type="text" name="Qty" style="width: 50px;">
                  <button type="submit" class="btn btn-outline-light">Add</button>
                </form>  
            </td>
            <td>
              <form action="/soldOutQtyUpdateForStore" method="POST">
              <input type="hidden" name="Id" value="${item.Id}">
              <input type="hidden" name="Model" value="${item.name}">
                <input type="text" name="Qty" style="width: 50px;">
                  <button type="submit" class="btn btn-outline-light">Sold Out</button>
                </form>  
            </td>
        </tr>`);
        }
        res.send(htmlCode);
      }
    });
  });
});



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

router.get("/search/:accessories/:title", (req, res) => {
  let title = req.params.title;
  let accessories = req.params.accessories;
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    let sql = `SELECT * FROM products WHERE Type LIKE "%${accessories}%" AND KeyWords LIKE "%${title}%"`;
    con.query(sql, (err, result) => {
      if (result.length <= 0) {
        res.render("search", {
          errorMessage: `Sorry! This products are not available right now. Try another brand.`,
        });
      } else {
        res.render("search", { message: result });
      }
    });
  });
});

router.post("/search/filterbypricerange", (req, res) => {
  let m = req.body.model;
  var model = '';
  for (var i = 0; i < m.length; i++) {
    if (m.charAt(i) != '"') {
      model += m.charAt(i);
    } else {
      model += 'Inch'
    }
  }

  let rangeFrom = req.body.rangeFrom;
  let rangeTo = req.body.rangeTo;
  Number(rangeFrom);
  Number(rangeTo);

  function rangeVerifier(price) {
    if (price >= rangeFrom && price <= rangeTo) {
      return true
    } else {
      return false
    }
  }
  const getDBInfo = require("../../db");
  const con = getDBInfo.con;
  con.connect((err) => {
    
    let sql_ = `SELECT * FROM all_products WHERE model LIKE "%${model}" OR sub_category LIKE "%${model}" OR category LIKE "%${model}"`
    con.query(sql_, (err, result) => {
      if (result.length <= 0) {    
        res.render("search", {
          errorMessage: `Sorry! No products available within this price range. Try another range.`,
        });
      } else {
        let message = []
        for (let i = 0; i < result.length; i++) {
          const e = result[i];
          let price = e.offer_price.replace(",", "");
          let p = Number(price)
          if (rangeVerifier(p) == true){
            message.push(e)
          }
          
        }
        res.render("search", { message : message });

      }
    })
  });
});


module.exports = router;
