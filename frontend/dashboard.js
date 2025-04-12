"use strict";

const tabContainer = document.querySelector(".store-action-tabs-list");
const tabList = document.querySelectorAll(".store-action");
const tabContent = document.querySelectorAll(".store-action-tab-content > div");
const productTableBody = document.querySelector(".product-table tbody");
const resaleTableBody = document.querySelector(".resale-table tbody");
const nearExpiryTableBody = document.querySelector(".near-expiry-table tbody")

/***************************-------------------fetch-shopkeeper--------*******************************************/
const shopkeeper = JSON.parse(localStorage.getItem("shopkeeper"));
console.log(shopkeeper);

if (!shopkeeper || !shopkeeper.token) {
  alert("You must be logged in");
  window.location.href = "/login.html";
}

/***************************-------------------tab-logic--------*******************************************/
tabContainer.addEventListener("click", (e) => {
  e.preventDefault();
  const clickedTab = e.target.closest("a");
  if (!clickedTab) return;

  const activeTabId = clickedTab.getAttribute("href");
  const activeTab = document.querySelector(activeTabId);

  tabContent.forEach((container) => {
    container.setAttribute("hidden", "");
  });
  activeTab.removeAttribute("hidden");
});

/***************************-------------display-product-list--------------*******************************************/
let products = [];
let resaleProducts = [];

const fetchAndDisplayProducts = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${shopkeeper.token}`,
        "Content-Type": "application/json",
      },
    });

    products = await response.json();

    if (response.ok) {
      productTableBody.innerHTML = ""; 

      products.forEach((product) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", product._id);

        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.quantity}</td>
          <td>${product.mrp}</td>
          <td>${product.costPrice}</td>
          <td>${new Date(product.expiryDate).toLocaleDateString()}</td>
          <td>
            <div class="edit-product">
              <button class="resale-form-btn btn">Resale</button> 
              <button class="btn discount-form-btn">Discount</button> 
              <div class="resale-pop hidden">
                <form class="resale-form">
                  <input type="number" placeholder="Qty" required />
                  <span>@</span>
                  <input type="text" placeholder="Price" value="${
                    product.costPrice
                  }.00" required />
                  <button class="btn resale-btn">Add</button>
                </form>
              </div>
              <div class="discount-pop hidden">
                <form class="discount-form">
                  <input type="number" placeholder="%" required />
                  <button class="btn discount-btn">Add</button>
                </form>
              </div>
            </div>
          </td>
          <td><input type="checkbox" class="check" ${
            product.isNearExpiry ? "checked" : ""
          } disabled></td>
          <td><button type="button">🗑️</button></td>
        `;

        productTableBody.appendChild(row);
      });
    } else {
      alert(products.error || "Failed to load products");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

fetchAndDisplayProducts();

/***************************-----------list-resale-items----------------*******************************************/

const fetchAndDisplayResaleProducts = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/products/resale", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${shopkeeper.token}`,
        "Content-Type": "application/json",
      },
    });

    const resaleItems = await response.json();
    console.log(resaleItems);

    if (response.ok) {
      resaleTableBody.innerHTML = "";

      resaleItems.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.resaleQuantity}</td>
          <td>${item.resalePrice}</td>
          <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
        `;

        resaleTableBody.appendChild(row);
      });
    } else {
      alert(resaleItems.error || "Failed to load resale items.");
    }
  } catch (error) {
    console.error("Error fetching resale products:", error);
  }
};

fetchAndDisplayResaleProducts();

/***************************-----------list-resale-items----------------*******************************************/
const fetchAndDisplayNearExpiryProducts = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/products/near-expiry",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${shopkeeper.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const nearExpiryItems = await response.json();
    if(response.ok){
      nearExpiryTableBody.innerHTML = ''
      nearExpiryItems.forEach(item => {
        const row = document.createElement('tr')

        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.costPrice}</td>
          <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
        `


        nearExpiryTableBody.appendChild(row)
      })
    }
  } catch (error) {
    console.error("Error fetchin near expiry products:", error);
  }
};

fetchAndDisplayNearExpiryProducts()

/***************************-------------------logout & welcome----------------*******************************************/
document.querySelector(".shopkeeper-name").textContent =
  shopkeeper.ownerName.toUpperCase();
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("shopkeeper");
  window.location.href = "/login.html";
});

/***************************-------------------add new product----------------*******************************************/
document
  .querySelector(".add-product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#product-name").value.trim();
    const category = document.querySelector("#product-category").value.trim();
    const mrp = parseFloat(document.querySelector("#product-mrp").value);
    const costPrice = parseFloat(document.querySelector("#product-cost").value);
    const quantity = parseInt(
      document.querySelector("#product-quantity").value || 0
    );
    const expiryDate = document.querySelector("#product-expiry").value;

    const product = { name, category, mrp, costPrice, quantity, expiryDate };

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${shopkeeper.token}`,
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        e.target.reset();
        fetchAndDisplayProducts(); // Refresh list
      } else {
        alert(data.error || "Failed to add product.");
      }
    } catch (error) {
      console.error("error:", error);
    }
  });

/***************************-----------add-items-for-resale----------------*******************************************/
productTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("resale-form-btn")) {
    const row = e.target.closest("tr");
    const resalePop = row.querySelector(".resale-pop");
    resalePop.classList.toggle("hidden"); // Toggle display
  }

  if (e.target.classList.contains("resale-btn")) {
    e.preventDefault();

    const row = e.target.closest("tr");
    const resaleForm = row.querySelector(".resale-form");
    const resaleQuantity = resaleForm.querySelector(
      "input[type='number']"
    ).value;
    const resalePrice = resaleForm.querySelector("input[type='text']").value;

    const productId = row.getAttribute("data-id");

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/resale/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${shopkeeper.token}`,
          },
          body: JSON.stringify({ resaleQuantity, resalePrice }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Product listed for resale!");
        row.querySelector(".resale-pop").classList.add("hidden");
        fetchAndDisplayProducts();
      } else {
        alert(data.error || "Failed to list for resale.");
      }
    } catch (error) {
      console.error("Resale error:", error);
    }
  }
});
