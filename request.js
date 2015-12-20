var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');
var url = require('url');

var request = require('request');
var cheerio = require('cheerio');
var ImageToAscii = require("image-to-ascii");
var async = require('async');




var baseUrl = 'http://www.salestockindonesia.com';
// var products = [];
var product;
var addr, parsedUrl, protocol;
// var asciis = []
var cnt = 0;
function clearproduct () {
  product = {
    nameof: '',
    priceof: '',
    sizeof: '',
    imageurl: '',
    savedpath: '',
    ascii: '',
    colors: []
  };
}
var Request = {
  products: [],
  asciis: []
}


clearproduct();
Request.init = function (callback) {
  request(baseUrl, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      $('.product__info').each(function (i, elm) {
        addr = $(elm).parent().parent().prev().find('img').attr('src');
        product.imageurl = addr;
        product.savedpath = 'img'+i+'.jpg';
        // if (i % 3 === 0) {
        product.nameof = $(this).children().children().first().text();
      // } else if (i % 3 === 1) {
        product.priceof = $(this).children().children().first().next().text();
      // } else {
        product.sizeof = $(this).children().children().first().next().next().text();

        $(this).next().next().next().children().children().each(function (i, elm) {
          product.colors.push($(elm).text());
        })
        async.series([function (cb) {
          var prod = product;
          var imgStream = fs.createWriteStream(prod.savedpath);
          imgStream.on('close', function () {
            cb(null);
            that = this;
            // console.log(that);
            ImageToAscii({
              path: __dirname + '/' + that.path,
              colored: true
            }, function(err, converted) {
                Request.asciis.push(err || converted);
            });
          });
          request(addr).pipe(imgStream);
        }, function(cb) {
          cb(null);
        }], function (err, res) {
          cnt++;
          if (cnt>=Request.products.length) {

            // var choices = Array.apply(0, new Array(Request.products)).map(function(x,y) {
            //   return Request.products.indexOf(y) + '. ' + y.nameof + ' - IDR ' + y.priceof;
            // });
            // var smsContent = choices.join('\n');
            // console.log(Request.asciis);

            callback(Request.products);

          }
        });

        // console.log(product);
        Request.products.push(product);
        clearproduct();
        // }


      });
      $('.product__info').children().children().each(function (i, elm) {
        // console.log($(this).text());
        // console.log(i + ' : ' + $(this).next().text());
      });

    }
    // console.log(products.length);
  });

}

module.exports = Request;
