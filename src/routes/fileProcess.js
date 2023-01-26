const express = require("express");
const fileProcess = express.Router();
const multer = require("multer");
// const upload = multer({ dest: './src/uploadedFiles/' })
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// File upload with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploadedFiles/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const getDBInfo = require("../../db");
const { resolve, dirname } = require("path");
const con = getDBInfo.con;



fileProcess.post(
    "/fileProcess",
    urlencodedParser,
    upload.array('ProductPics', 3),
    function (req, res) {
      let File_1 = req.files[0].filename;
      let File_2 = req.files[1].filename;
      let File_3 = req.files[2].filename;
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
      let Qty = req.body.Qty;
      let Description = req.body.Description;
      let FullDesc = req.body.FullDesc;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let date = new Date();
      let d = date.getDate();
      let m = months[date.getMonth()];
      let y = date.getFullYear()
      let time = d + '-' + m + '-' + y
      const getDBInfo = require("../../db");
      const { resolve } = require("path");
      const con = getDBInfo.con;
      con.connect(function (err) {
        let sql = `INSERT INTO products (Title, Brand, Type, Model, Processor, ProcessorFamily, Memory, Storage, GraphicsCard, DisplayType, Webcam, OS, Audio, FR, Wireless, KF, Interface, Battery, BK, Dimensions, Weight, Color, PD, Remark, Description, Price, Qty, FullDesc, File_1, File_2, File_3, uploadDate, KeyWords)
        VALUES ("${Title}", "${Brand}", "${Type}", "${Model}", "${Processor}", "${ProcessorFamily}", "${Memory}", "${Storage}", "${GraphicsCard}", "${DisplayType}", "${Webcam}", "${OS}", "${Audio}", "${FR}", "${Wireless}", "${KF}", "${Interface}", "${Battery}", "${BK}", "${Dimensions}", "${Weight}", "${Color}", "${PD}", "${Remark}", "${Description}", "${Price}", "${Qty}", "${FullDesc}", "${File_1}", "${File_2}", "${File_3}", "${time}", "${KeyWords}")`
      
        con.query(sql, (err, result) => {
          res.render('forms', {successMsg: 'Product uploaded seccessfully!!!'})
        })
    })

})

fileProcess.post("/editImage", urlencodedParser, upload.single("img_input"), (req, res) => {
      let PID = req.body.pid;
      let img = req.body.img;
      let imgName = req.body.imgName;
      let file = req.file.filename;
      Number(img)
      let fileContainer;
      if (img == 1) {
        fileContainer = 'File_1'
      } else if (img == 2) {
        fileContainer = 'File_2'
      } else {
        fileContainer = 'File_3'
      }
      let f = path.join(__dirname,`../../public/uploadedFiles/${imgName}`);
            if (fs.existsSync(f) == true) {
              fs.unlink(f, (err) => {})
            }
      const getDBInfo = require("../../db");
      const con = getDBInfo.con;
      con.connect((err) => {
        let sql = `UPDATE products SET ${fileContainer} = '${file}' WHERE Id = ${PID}`
        con.query(sql, (err, result) => {
          let sql = `SELECT * FROM products WHERE Id = ${PID}`
          con.query(sql, (err, result) => {
            if (result.length <= 0) {
              res.send({emptyResult:`Unexpected server error occurred`})
            } else {
              res.render('editProduct', {message: result[0], title: 'Edit Product', successMsg: 'Image replaced successfully!'})
            }
          })
        })
      })
})


module.exports = fileProcess;