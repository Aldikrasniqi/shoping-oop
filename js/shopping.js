class Merchandise {
    
    id = "";
    name = "";
    description = "";
    unitPrice = 0;
    image = ""
    
    constructor(id, name, description, unitPrice, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.image = image;
    };
}

class ShoppingCartLineItem {

    merchandiseId = "";
    merchandiseName = "";
    unitPrice = 0;
    quantity = 0;

    constructor(merchandise) {
        this.merchandiseId = merchandise.id;
        this.merchandiseName = merchandise.name;
        this.unitPrice = merchandise.unitPrice;
        this.quantity = 1;
    }

    getLineSubtotal() {
        return (this.quantity * this.unitPrice).toFixed(2);
    }
}

class ShoppingCart {

    lineItems = [];

    addItem(inventoryIndex) {
        const merchandise = inventory[inventoryIndex];
        const lineIndex = this.findItem(merchandise.id);

        if (lineIndex != -1) {

            // already exists, just increment the quantity
            this.lineItems[lineIndex].quantity++;
        }
        else {
            // if not already exists, create a new line item with quantity of 1
            this.lineItems.push(new ShoppingCartLineItem(merchandise));
        }
    }

    decreaseItemQuantity(lineIndex) {

        this.lineItems[lineIndex].quantity--;

        if (this.lineItems[lineIndex].quantity <= 0) {
            this.lineItems = this.lineItems.filter((line, index) => index != lineIndex);
        }
    }

    findItem(merchandiseId) {

        let testIndex = -1;
        
        // see if a line with that item ID is already in the array

        this.lineItems.forEach((line, index) => {
            if (line.merchandiseId == merchandiseId) {
                testIndex = index;
            }
        });

        return testIndex;
    }

    getShoppingCartTotal() {

        let runningTotal = 0.0;

        this.lineItems.forEach(line => {
            runningTotal += line.unitPrice * line.quantity;
        });

        return runningTotal.toFixed(2);
    }

    increaseItemQuantity(lineIndex) {
        this.lineItems[lineIndex].quantity++;
    }
}

// variables -----------------------------------------------------

const vase = new Merchandise("vase", "Vase", "A fine replica of the famous one in Sweden.", 29.99, "images/vase.png")
const lamp = new Merchandise("lamp", "Lamp", "A hybrid of traditional and modern. Perfect for any home. 110/220V", 35.49, "images/lamp.png")
const glass = new Merchandise("glass", "Glass", "Matches the setting sun. Perfect for enjoying your favourite beverage while watching the sunset.", 14.99, "images/glass.png")

var inventory = [vase, lamp, glass]

var shoppingCart = new ShoppingCart();

// functions -----------------------------------------------------

function addToShoppingCart(inventoryIndex) {
    shoppingCart.addItem(inventoryIndex);
    buildShoppingCartTable();
}

function buildMerchandiseTable() {

    const htmlTemplate = 
   `<td class="merchandise-image">
        <img class="merchandise-image" src="~~image~~" alt="vase">
    </td>
    <td>
        <p class="merchandise-name">~~name~~</p>
        <hr class="merchandise-hr">
        <p class="merchandise-unit-price">~~unit-price~~</p>
        <p class="merchandise-description">~~description~~</p>
    </td>
    <td class="top-align-cell">
        <a href="javascript:addToShoppingCart('~~index~~')"><img class="floating-button" src="images/blue_circle_plus.png" alt="add"></a>
    </td>`;

    let merchandiseTable = document.getElementById("merchandise-table");

    if (merchandiseTable == null) return;

    inventory.forEach((merchandise, index) =>  {

        let row = merchandiseTable.insertRow(index);

        let rowHTML = htmlTemplate.replace("~~index~~", index);
        rowHTML = rowHTML.replace("~~image~~", merchandise.image);
        rowHTML = rowHTML.replace("~~name~~", merchandise.name.toUpperCase());
        rowHTML = rowHTML.replace("~~unit-price~~", "$" + merchandise.unitPrice);
        rowHTML = rowHTML.replace("~~description~~", merchandise.description);

        row.innerHTML = rowHTML;
    }    
    );
}

function buildShoppingCartTable() {

    const lineTemplate =
    `<td class="shopping-cart-item-name-column">~~name~~</td>
    <td class="shopping-cart-item-quantity-column"><a href="javascript:decreaseQuantity(~~lineIndex~~)">-</a> ~~quantity~~ <a href="javascript:increaseQuantity('~~lineIndex~~')">+</a></td>
    <td class="shopping-cart-item-line-total-column">~~lineItemSubtotal~~</td>
    `;

    let lineItemsTable = document.getElementById("shopping-cart-items-table");

    if (lineItemsTable == null) return;

    lineItemsTable.innerHTML = "";

    shoppingCart.lineItems.forEach((line, index) => {

        let row = lineItemsTable.insertRow(index);

        let rowHTML = lineTemplate.replace("~~name~~", line.merchandiseName);
        rowHTML = rowHTML.replace("~~lineIndex~~", index);
        rowHTML = rowHTML.replace("~~lineIndex~~", index);
        rowHTML = rowHTML.replace("~~quantity~~", line.quantity);
        rowHTML = rowHTML.replace("~~lineItemSubtotal~~", "$" + line.getLineSubtotal());

        row.innerHTML = rowHTML;

    });

    const totalElement = document.getElementById("shopping-cart-total");

    if (totalElement != null) {
        totalElement.innerHTML = "$" + shoppingCart.getShoppingCartTotal();
    }

    const checkout_btn = document.getElementById("checkout-button");

    if (checkout_btn != null) { 
        checkout_btn.style.display = shoppingCart.lineItems.length == 0 ? "none" : "inline";
    }

}

function increaseQuantity(lineIndex) {
    shoppingCart.increaseItemQuantity(lineIndex);
    shoppingCart.lineItems[lineIndex].quantity++;
    buildShoppingCartTable();
}

function decreaseQuantity(lineIndex) {
    shoppingCart.decreaseItemQuantity(lineIndex);
    buildShoppingCartTable();
}

buildMerchandiseTable();
buildShoppingCartTable();