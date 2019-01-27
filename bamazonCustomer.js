const mysql = require("mysql");
const inquirer = require("inquirer");

const shopItems = [];

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazonDB"
});

connection.connect(function (err) {
  if (err) throw err;
  allInventory();
});

console.log("working");

function allInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    console.log("-----------------------------------");
    // console.log(res);
    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price);
      const dbResult = res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price;
      shopItems.push(dbResult);
    }
    runSearch();
  });
};

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Choose the ID of the product you would like to purchase?",
      choices: shopItems
    })
    .then(function (answer) {
      const item = answer.action.split(" ");
      stockQuantity(item[0])
    })
};

function stockQuantity(item) {
  inquirer
    .prompt({
      name: "amount",
      type: "input",
      message: "Choose the how many of the product you would like to purchase?"
    })
    .then(function (quantity) {
      const purschaseAmount = Number(quantity.amount);
      stockInquiry(purschaseAmount, item)
      console.log(purschaseAmount)
    })
}

function stockInquiry(quantity, id) {
  connection.query("SELECT * FROM products WHERE ?", { id: id }, function (err, res) {
    const productData = res[0]
    console.log(productData.stock_quantity)
    if (productData.stock_quantity > quantity) {
      console.log('In Stock!')
      const updateInventory = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE ID = ' + id;
      connection.query(updateInventory, function(err,res){
        console.log('Inventory Updated')
      })
      // console.log('We still have ' + productData.stock_quantity + ' in stock')
      console.log(updateInventory)
    } else {
      console.log('Insufficient quantity!')
    }
  })
}

//Check stock quantity based on purchase

// if quanity is available consolelog purchase

// else console log insufficient purchase