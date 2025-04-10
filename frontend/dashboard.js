"use strict";

const tabContainer = document.querySelector(".store-action-tabs-list");
const tabList = document.querySelectorAll(".store-action");
const tabContent = document.querySelectorAll(".store-action-tab-content > div");
const productTableBody = document.querySelector(".product-table tbody");

/***************************-------------------fetch-shopkeeper--------*******************************************/
const shopkeeper = JSON.parse(localStorage.getItem("shopkeeper"));
console.log(shopkeeper)

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
/***************************---------------------------*******************************************/
document.querySelector(".shopkeeper-name").textContent =
  shopkeeper.ownerName.toUpperCase();
document.querySelector(".logout-btn").addEventListener("click", () => {
  localStorage.removeItem("shopkeeper");
  window.location.href = "/login.html";
});

document
  .querySelector(".add-product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("add product form");
    const name = document.querySelector("#product-name").value.trim();
    const category = document.querySelector("#product-category").value.trim();
    const mrp = parseFloat(document.querySelector("#product-mrp").value);
    const costPrice = parseFloat(document.querySelector("#product-cost").value);
    const quantity = parseInt(
      document.querySelector("#product-quantity").value || 0
    );
    const expiryDate = document.querySelector("#product-expiry").value;

    const product = {
      name,
      category,
      mrp,
      costPrice,
      quantity,
      expiryDate,
    };

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
      console.log(data);

      if (response.ok) {
        alert("Product added successfully!");
        e.target.reset();
      } else {
        alert(data.error || "Failed to add product.");
      }
    } catch (error) {
      console.error("error:", error);
    }
  });

/***************************-------------display-product-list--------------*******************************************/

const fetchAndDisplayProducts = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/products", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${shopkeeper.token}`,
        "Content-Type": "application/json",
      },
    });

    const products = await response.json();

    if (response.ok) {
      productTableBody.innerHTML = ""; // Clear any existing rows

      products.forEach((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.mrp}</td>
            <td>${product.costPrice}</td>
            <td>${new Date(product.expiryDate).toLocaleDateString()}</td>
            <td><input type="checkbox" class="check" ${
              product.listedForResale ? "checked" : ""
            } disabled></td>
            <td><input type="checkbox" class="check" ${
              product.isNearExpiry ? "checked" : ""
            } disabled></td>
            <td><button type="button">✏️</button></td>
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
