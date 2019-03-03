var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",

    database: "bamazon"
});

console.log("\nYou have enter Manager mode!\n")
// List a set of menu options:
function manager() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
                productSales()
                break

            case "View Low Inventory":
                viewLow()
                break

            case "Add to Inventory":
                createInvArray()
                break;

            case "Add New Product":
                newProduct()
                break
        }
    });
}
manager()
// View Products for Sale
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function productSales () {
    connection.query(`SELECT item_id, product_name, price, stock_quantity FROM products`, function(err, res) {
        if (err) throw err
        console.log("\nThe following are the current Products for Sale:")
        console.log("---------------------------------------------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id + " | " + "Product Name: " + res[i].product_name + " | " + "Price: $" + res[i].price + "|" + " Quantity:" + res[i].stock_quantity);
        }
        console.log("---------------------------------------------------------------------\n")
        console.log("You are in Manager mode!\n")
        manager()
    })
}

// View Low Inventory
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLow () {
    connection.query(`SELECT product_name, stock_quantity FROM products WHERE stock_quantity<5`, function(err, res) {
        if (err) throw err
        console.log("\nWe might not have or might be running low of the following Products!")
        console.log("---------------------------------------------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log( "Product Name: " + res[i].product_name + " | Quantity:" + res[i].stock_quantity);
        }
        console.log("---------------------------------------------------------------------\n")
        console.log("You are in Manager mode!\n")
        manager()
    })
}

var currentProducts = []
// Add to Inventory
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function createInvArray (){
    connection.query(`SELECT product_name FROM products`, function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            currentProducts.push(res[i].product_name)
        }
        addInv()
    })
}
function addInv()  {
    inquirer.prompt([
        {
            name: "item",
            type: "list",
            message: "What item would you like to add?",
            choices: currentProducts
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to add?",
            validate: function(value) {
                if (Number.isInteger(parseInt(value)) && value > 0) {
                    return true
                } else {
                    return `${value} is not a vaid quantity`
                }
            }
        }
    ]).then(function(answers) {
        connection.query("SELECT product_name, stock_quantity FROM products WHERE ?", { product_name: answers.item }, function(err, res) {
            var product = res[0]
            var amount = parseInt(product.stock_quantity) + parseInt(answers.quantity)
            if (err) throw err
            connection.query('UPDATE products SET ? WHERE ?', [ {stock_quantity:(amount)}, {product_name: product.product_name} ], function(err, res) {
                if (err) throw err
                console.log("\nYou have added " + answers.quantity + ` ${product.product_name}(s)` + "!" +`\n${product.product_name} stock is now updated to ${amount}\n`)
                console.log("You are in Manager mode!\n")
                manager()
            })
        })
    })
    
}
// Add New Product
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function newProduct(){
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "ID for the Product?(4 numbers recomended) ",
            validate: function(value) {
                if (value) {
                  return true
                } else {
                    return `${value} is not a valid id`
                }
            }
        },
        {
            name: "name",
            type: "input",
            message: "Name of the Product: ",
            validate: function(value) {
                if (value) {
                  return true
                } else {
                    return `${value} is not a valid name`
                }
            }
        },
        
        {
            name: "department",
            type: "list",
            message: "What Department does this Product belong to? ",
            choices: [
                "Beauty & Personal Care",
                "Electronics",
                "Jewelry",
                "Kitchen",
                "Animals",
                "Sports",
                "Fashion",
                "Office Supplies",
                "Other"
            ]
        },
        {
            name: "price",
            type: "input",
            message: "Price for this Product? ",
            validate: function(value) {
                if (Number.isNaN(parseInt(value)) === false && value > 0) {
                    return true
                } else {
                    return `${value} is not a vaid price`
                }
            }
        },
        {
            name: "stock",
            type: "input",
            message: "Stock Quantity that you would like to add? ",
            validate: function(value) {
                if (Number.isNaN(parseInt(value)) === false && value > 0) {
                    return true
                } else {
                    return `${value} is not a vaid stock number`
                }
            }
        }
    ]).then (function(answers) {
        console.log(`\nNEW PRODUCT HAS BEEN ADDED:`)  
        console.log("---------------------------------------------------------------------")
        console.log(`Product ID: ${answers.id}\nProduct Name: ${answers.name}\nDepartment: ${answers.department}\nPrice:$${answers.price}\nStock: ${answers.stock}`)
        console.log("---------------------------------------------------------------------\n")
        connection.query(`INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES ('${answers.id}','${answers.name}', '${answers.department}', ${answers.price}, ${answers.stock})`, function(err, res) {
            if (err) throw err
            console.log("You are in Manager mode!\n")
            manager()
        })
    })
}