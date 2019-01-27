const mysql = require("mysql");
const inquirer = require("inquirer");


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

function managerInventory() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'inventory',
            message: 'Select which inventory you would like to view:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'End Inventory Update'],
            filter: function (val) {
                if (val === 'View Products for Sale') {
                    return 'sale';
                } else if (val === 'View Low Inventory') {
                    return 'lowInventory';
                } else if (val === 'Add to Inventory') {
                    return 'addInventory';
                } else if (val === 'Add New Product') {
                    return 'newProduct';
                } else if (val === "End Inventory Update") {
                    return connection.end();
                } else {
                    console.log('ERROR');
                }
            }
        }
    ]).then(function (answers) {
        if (answers.inventory === 'sale') {
            displayInventory(managerInventory);
        } else if (answers.inventory === 'lowInventory') {
            displayLowInventory();
        } else if (answers.inventory === 'addInventory') {
            addInventory();
        } else if (answers.inventory === 'newProduct') {
            addNewProduct();
        }

    })
}

function displayInventory(cb) {
    dbQuery = 'SELECT * FROM products';

    connection.query(dbQuery, function (err, answers) {
        if (err) throw err;
        console.log('Current Inventory: ');
        console.log('-------------------\n')

        let showData = '';
        for (var i = 0; i < answers.length; i++) {
            showData = '';
            showData += 'Item ID: ' + answers[i].id + ' // ';
            showData += 'Product Name: ' + answers[i].product_name + ' // ';
            showData += 'Department: ' + answers[i].department_name + ' // ';
            showData += 'Price: $' + answers[i].price + ' // ';
            showData += 'Quantity: ' + answers[i].stock_quantity + ' \n ';

            console.log(showData);
        }
        
        if(cb){
            cb();
        }
    })
}
function displayLowInventory() {
    dbQuery = 'SELECT * FROM products WHERE stock_quantity < 10';

    connection.query(dbQuery, function (err, answers) {
        if (err) throw err;
        
        console.log('Low Inventory Items (below 10): ');
        console.log('---------------------------------------------\n');

        let showData = '';
        for (var i = 0; i < answers.length; i++) {
            showData = '';
            showData += 'Item ID: ' + answers[i].id + ' // ';
            showData += 'Product Name: ' + answers[i].product_name + ' // ';
            showData += 'Department: ' + answers[i].department_name + ' // ';
            showData += 'Price: $' + answers[i].price + ' // ';
            showData += 'Quantity: ' + answers[i].stock_quantity + ' \n ';

            console.log(showData);
            console.log('---------------------------------------------\n');
            managerInventory();
        }
    })
}

function validateInteger(value) {
    const integer = Number.isInteger(parseFloat(value));
    const sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.';
    }
}

function validateNumeric(value) {
    // Value must be a positive number
    const number = (typeof parseFloat(value)) === 'number';
    const positive = parseFloat(value) > 0;

    if (number && positive) {
        return true;
    } else {
        return 'Please enter a positive number for the price.'
    }
}

function addInventory() {
    displayInventory(function(){

    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Please enter the ID',
            validate: validateInteger,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many items would you like to add to the inventory',
            validate: validateInteger,
            filter: Number
        }
    ]).then(function (input) {

        const item = input.id;
        const addQuantity = input.quantity;

        const dbQuery = 'SELECT * FROM products WHERE ?';

        connection.query(dbQuery, { id: item }, function (err, answers) {
            if (err) throw err;

            if (answers.length === 0) {
                console.log('Please select a valid ID.');
                addInventory();
            } else {
                const productData = answers[0];

                console.log('Updated the inventory');

                const updateDbQuery = `UPDATE products SET stock_quantity = ${(productData.stock_quantity + addQuantity)} WHERE id = ${item}`;
                // console.log('updateDbQuery = ' + updateDbQuery);


                connection.query(updateDbQuery, function (err, answers) {
                    if (err) throw err;
                    console.log('Stock count for Item ID ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity) + '.');

                    managerInventory();
                })
            }
        })
    })
})
}

function addNewProduct() {
    inquirer.prompt([{
        type: 'input',
        name: 'product_name',
        message: 'What is the name of the new product?',
    },
    {
        type: 'input',
        name: 'department_name',
        message: 'Which department are you adding the new product to?',
    },
    {
        type: 'input',
        name: 'price',
        message: 'What is the current price?',
        validate: validateNumeric
    },
    {
        type: 'input',
        name: 'stock_quantity',
        message: 'How many items are in stock?',
        validate: validateInteger
    }
    ]).then(function (answers) {
        console.log('Add A New Item: \n    product_name = ' + answers.product_name + '\n' +
            '    department_name = ' + answers.department_name + '\n' +
            '    price = ' + answers.price + '\n' +
            '    stock_quantity = ' + answers.stock_quantity);

        const dbQuery = 'INSERT INTO products SET ?';

        connection.query(dbQuery, answers, function (err, answers, results) {
            if (err) throw err;

            console.log('New product has been added to the inventory. New ID # ' + answers + '.')

            managerInventory();

        });

    })
}

function runBamazon() {
    managerInventory();
}

runBamazon();