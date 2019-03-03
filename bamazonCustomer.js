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
    console.log("\nThe following are the items that are available in Bamazon!\n");
});

function displayAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("---------------------------------------------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Price: $" + res[i].price);
        }
        console.log("---------------------------------------------------------------------\n\n")
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
                        console.log("\nInsufficient quantity! Please select an amount that is less than or equal to " + res[0].stock_quantity+ "\n");
                        console.log("\nThe following are the items that are available in Bamazon!\n");
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
                            console.log("\nTotal: $" + (res[0].price * itemQuantity) + " for your purchase of " + itemQuantity + " " + res[0].product_name + ".\n" );
                        } else {
                            console.log("\nTotal: $" + (res[0].price * itemQuantity) + " for your purchase of " + itemQuantity + " " + res[0].product_name + ".\n");
                        }
                        console.log("Inventory has been updated!\n");
                        console.log("Continue shopping!\n");
                        console.log("The following are the items that are available in Bamazon!\n");
                        displayAll();

                    }

                });

        });

    });

}