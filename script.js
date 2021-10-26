function getItems() {
    db.collection("items")
        .get()
        .then((querySnapshot) => {
            let items = [];
            querySnapshot.forEach((doc) => {
                items.push({
                    id: doc.id,
                    image: doc.data().image,
                    name: doc.data().name,
                    make: doc.data().make,
                    rating: doc.data().rating,
                    price: doc.data().price,
                });
            });
            generateItems(items);
        });
}

function addToCart(item) {
    let cartItem = db.collection("cart-items").doc(item.id);
    cartItem.get().then(function (doc) {
        if (doc.exists) {
            cartItem.update({
                quantity: doc.data().quantity + 1,
            });
        } else {
            cartItem.set({
                image: item.image,
                make: item.make,
                name: item.name,
                price: item.price,
                rating: item.rating,
                quantity: 1,
            });
        }
    });
}

function generateItems(items) {
    let itemsHTML = "";
    items.forEach((item) => {
        let doc = document.createElement("div");
        doc.classList.add("main-product", "mr-10");
        doc.innerHTML = `
        <div class="product-image h-48 w-44 bg-white rounded-lg flex justify-center items-center p-4">
                <img class="" src="${item.image}"
                    alt="${item.name}">
            </div>
            <div class="product-name text-gray-700 font-bold mt-2 text-sm">
                ${item.name}
            </div>
            <div class="product-make text-green-700 font-bold">
                ${item.make}
            </div>
            <div class="product-rating text-yellow-300 font-bold">
                ⭐⭐⭐⭐ ${item.rating}
            </div>
            <div class="product-price font-bold text-gray-700 text-lg">
                ${numeral(item.price).format("$0,0.00")}
            </div>
        `;

        let addToCartEl = document.createElement("div");
        addToCartEl.classList.add(
            "flex",
            "justify-center",
            "items-center",
            "w-28",
            "h-8",
            "text-white",
            "bg-yellow-500",
            "cursor-pointer",
            "hover:bg-yellow-600",
            "rounded"
        );
        addToCartEl.innerText = "Add to Cart";
        addToCartEl.addEventListener("click", function () {
            addToCart(item);
        });
        doc.appendChild(addToCartEl);
        document.querySelector(".main-section-products").appendChild(doc);
    });
}

getItems();
