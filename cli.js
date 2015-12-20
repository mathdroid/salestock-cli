#!/usr/bin/env node
var inquirer = require('inquirer');
var chalk = require('chalk');
var async = require('async');
var Request = require('./request');

var choices = [];
var buy = ['Get this item', 'Go back'];
console.log('Welcome to Sale Stock Indonesia.\n\nPlease wait while we are initializing the app.');

Request.init(function (data) {
  // console.log('welcome to cli.');
  data.forEach(function (product) {
    choices.push(product.nameof + '\n' + product.priceof + ' IDR --- ' + product.sizeof);
  });
  chooseOne();
});

function chooseOne() {
  inquirer.prompt([
    {
      type      : "list",
      name      : "apparels",
      message   : "Welcome to Sale Stock",
      paginated : true,
      pageSize  : 8,
      choices   : choices
    }
  ], function (answers) {
    console.log(Request.asciis[choices.indexOf(answers.apparels)]);
    console.log(chalk.white.bold.bgRed(answers.apparels));
    addToCart();
  });
}

function addToCart() {
  inquirer.prompt([
    {
      type      : "list",
      name      : "apparels",
      message   : "Do you want this item?",
      paginated : false,
      choices   : buy
    }
  ], function (answers) {
    if (buy.indexOf(answers.apparels)===1) {
      chooseOne();
    }else {
      console.log('go to salestock.id');
    }
  });
}
