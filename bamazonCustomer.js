var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",

    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("The following are the items that are available in Bamazon!");
});

function displayAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Price: $" + res[i].price);
        }
        questions();
    });
}
displayAll();

function questions() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Please input the Product ID of the Product you would like to buy."
    }, {
        name: "quantity",
        type: "input",
        message: "How many would you like?"

    }]).then(function (answers) {

        productNumber = answers.id
        itemQuantity = answers.quantity;

        connection.query('SELECT * FROM products WHERE ?', {
            item_id: productNumber
        }, function (err, data) {
            if (err) throw err;


            console.log(answers.quantity);

            connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id= ' + productNumber,
                function (err, res) {
                    if (err) throw err;
                    if (res[0].stock_quantity < itemQuantity) {
                        console.log("Insufficient quantity! Please select an amount that is less than or equal to " + res[0].stock_quantity);
                        console.log("The following are the items that are available in Bamazon!");
                        displayAll();
                    } else {
                        connection.query("UPDATE products SET ? WHERE ?",
                            [{
                                stock_quantity: res[0].stock_quantity - itemQuantity
                            }, {
                                item_id: productNumber
                            }],
                            function (err, result) {});
                        if (itemQuantity === '1') {
                            console.log("Total: $" + (res[0].price * itemQuantity) + " for your purchase of " + itemQuantity + " " + res[0].product_name + "." );
                        } else {
                            console.log("Total: $" + (res[0].price * itemQuantity) + " for your purchase of " + itemQuantity + " " + res[0].product_name + ".");
                        }
                        console.log("Inventory has been updated!");
                        console.log("Continue shopping!");
                        console.log("The following are the items that are available in Bamazon!");
                        displayAll();

                    }

                });

        });

    });

}