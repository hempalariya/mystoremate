"use strict";

const tabContainer = document.querySelector(".store-action-tabs-list");
const tabList = document.querySelectorAll(".store-action");
const tabContent = document.querySelectorAll(".store-action-tab-content > div");


const productTableBody = document.querySelector(".product-table tbody");
const resaleTableBody = document.querySelector(".resale-table tbody");
const nearExpiryTableBody = document.querySelector(".near-expiry-table tbody");
const discountTableBody = document.querySelector(".discount-table tbody");
const expiredTableBody = document.querySelector(".expired-table tbody");
const nearbyResaleTableBody = document.querySelector(".nearby-resale-table tbody");
const aggregateTableBody = document.querySelector('.aggregate-table tbody')
const statsTableBody = document.querySelector('.stats-table tbody')


const productCount = document.querySelector(".product-count");
const nearExpiryCount = document.querySelector(".near-expiry-count");
const resaleCount = document.querySelector(".resale-count");
const outOfStockCount = document.querySelector(".out-of-stock-count");
const expiredCount = document.querySelector(".expired-count");

const statesFilter = document.querySelector(".stats-filter")


let products = [];
let resaleProducts = [];
let discountedProducts = []; 
let expiredProducts = [];
/***************************-------------------fetch-shopkeeper--------*******************************************/
const shopkeeper = JSON.parse(localStorage.getItem("shopkeeper"));

if (!shopkeeper || !shopkeeper.token) {
  alert("You must be logged in");
  window.location.href = "/login.html";
}

/***************************-------------------tab-logic--------*******************************************/

tabContent.forEach((tab, i) => {
  {
    if (i != 0) {
      tab.setAttribute("hidden", "");
    }
  }
});

tabContainer.addEventListener("click", (e) => {
  e.preventDefault();
  const clickedTab = e.target.closest("a");
  if (!clickedTab) return;
  tabList.forEach((btn) => btn.classList.remove("active"));
  clickedTab.classList.add("active");
  const activeTabId = clickedTab.getAttribute("href");
  const activeTab = document.querySelector(activeTabId);
  tabContent.forEach((container) => {
    container.setAttribute("hidden", "");
  });
  activeTab.removeAttribute("hidden");
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

    products = await response.json();

    if (response.ok) {
      productTableBody.innerHTML = "";

      productCount.innerHTML = products.length;
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

    if (response.ok) {
      resaleTableBody.innerHTML = "";

      resaleCount.innerHTML = resaleItems.length;
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

/***************************-----------list-near-expiry-items----------------*******************************************/
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
    if (response.ok) {
      nearExpiryTableBody.innerHTML = "";
      nearExpiryCount.innerHTML = nearExpiryItems.length;
      nearExpiryItems.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.costPrice}</td>
          <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
        `;
        nearExpiryTableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching near expiry products:", error);
  }
};

fetchAndDisplayNearExpiryProducts();

/***************************-----------list-discounted-items----------------*******************************************/
const fetchAndDisplayDiscountedProducts = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/products/discount",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${shopkeeper.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const discountedItems = await response.json();
    if (response.ok) {
      discountTableBody.innerHTML = "";
      discountedItems.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.discount}</td>
        <td>${item.costPrice}</td>
        <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
      `;
        discountTableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching discounted products");
  }
};

fetchAndDisplayDiscountedProducts();

/***************************-----------list-expired-items----------------*******************************************/

const fetchAndDisplayExpiredProducts = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/products/expired", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${shopkeeper.token}`,
        "Content-Type": "application/json",
      },
    });

    expiredProducts = await response.json();
    if (response.ok) {
      expiredTableBody.innerHTML = "";
      expiredCount.innerHTML = expiredProducts.length;
      expiredProducts.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.costPrice}</td>
      `;
        expiredTableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("error fetching expired products");
  }
};

fetchAndDisplayExpiredProducts();
/***************************-----------nearby-resale-items----------------*******************************************/

const fetchAndDisplayNearbyResaleProducts = async () => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/products/resale/nearby",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${shopkeeper.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      nearbyResaleTableBody.innerHTML = "";
      data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${item.name}</td>
               <td>${item.resaleQuantity}</td>
               <td>${item.resalePrice}</td>
               <td>${item.mrp}</td>
               <td>${item.shopkeeper.shopName}</td>
               <td>${item.shopkeeper.mobile}</td>
               <td><button type="button" class="btn intrested-btn">intrested</button></td>
      `;
        nearbyResaleTableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("error fetching data");
  }
};

fetchAndDisplayNearbyResaleProducts();

/***************************-----------display-aggregat-stats----------------*******************************************/

const fetchAndDisplayAggregate = async () =>{
  try{
    const response = await fetch("http://localhost:8000/api/products/sale/summary", {
      method: "GET",
        headers: {
          Authorization: `Bearer ${shopkeeper.token}`,
          "Content-Type": "application/json",
        },

      })
      
      const data = await response.json()
     
      if(response.ok){
        aggregateTableBody.innerHTML = "";
        
          
          const row = document.createElement("tr");
  
          row.innerHTML = `
                  <td>${data.totalSale}</td>
                 <td>${data.totalPurchase}</td>
                 <td>${data.profitOrLoss}</td>
        `;
          aggregateTableBody.appendChild(row);
     
      }
    }catch(error){
      console.error('error fetching data')
  }
}

fetchAndDisplayAggregate()



/************salewise ***********/
const fetchSaleData = async () => {
  try{
    const response = await fetch('http://localhost:8000/api/products/sale',{
      method: "GET",
      headers: {
        Authorization: `Bearer ${shopkeeper.token}`,
        "Content-Type": "application/json",
      },
    })
    
    const data = await response.json()

    if(response.ok){
      statsTableBody.innerHTML = ''
      data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${item.name}</td>
               <td>${item.quantity}</td>
               <td>${item.mrp}</td>
               <td>${item.costPrice}</td>
               <td>--</td>
               
      `;
        statsTableBody.appendChild(row);
      });
    }
    
  }catch(error){
    console.error('error fetching data')
  }
}
/************productwise ***********/
const fetchSaleProductData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/products/sale/productwise', {
      method: "GET",
      headers: {
        Authorization: `Bearer ${shopkeeper.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data)
    if(response.ok){
      statsTableBody.innerHTML = ''
      data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${item.name}</td>
               <td>${item.totalQauntity}</td>
               <td>${item.mrp}</td>
               <td>${item.costPrice}</td>
               <td>${item.profitOrLoss}</td>
               
      `;
        statsTableBody.appendChild(row);
      });
    }

  } catch (error) {
    console.error('error fetching productwise sale data', error);
  }
};


/***************************-------------display-stats--------------*******************************************/

statesFilter.addEventListener('click', (e) => {
  const targetBtn = e.target.closest('button')
  if(!targetBtn) return
  if(targetBtn.classList.contains('salewise')){
    fetchSaleData()
  }
  if(targetBtn.classList.contains('productwise')){
    console.log('por')
    fetchSaleProductData()
  }
})
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

/***************************-----------add-sold-product---------------*******************************************/
document.querySelector('.sold-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.querySelector('#sold-product input[id="sold-product-name"]').value;
  const mrp = parseFloat(document.querySelector('#sold-product input[id="sold-product-mrp"]').value);
  const costPrice = parseFloat(document.querySelector('#sold-product input[id="sold-product-cost"]').value);
  const quantity = parseInt(document.querySelector('#sold-product input[id="sold-product-quantity"]').value);

  try {
    const response = await fetch("http://localhost:8000/api/products/sold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${shopkeeper.token}`,
      },
      body: JSON.stringify({ name, mrp, costPrice, quantity }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Sale recorded successfully!");
      e.target.reset();
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error("Error saving sale:", err);
  }
});


/***************************-----------add-items-for-resale----------------*******************************************/
productTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("resale-form-btn")) {
    const row = e.target.closest("tr");
    const resalePop = row.querySelector(".resale-pop");
    resalePop.classList.toggle("hidden");
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

/***************************-----------add-items-for-discount----------------*******************************************/
productTableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("discount-form-btn")) {
    const row = e.target.closest("tr");
    const discountPop = row.querySelector(".discount-pop");
    discountPop.classList.toggle("hidden");
  }

  if (e.target.classList.contains("discount-btn")) {
    e.preventDefault();
    const row = e.target.closest("tr");
    const discountForm = row.querySelector(".discount-form");
    const discountPercent = discountForm.querySelector(
      "input[type='number']"
    ).value;

    const productId = row.getAttribute("data-id");

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/discount/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${shopkeeper.token}`,
          },
          body: JSON.stringify({ discountPercent }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Discount applied!");
        row.querySelector(".discount-pop").classList.add("hidden");
        fetchAndDisplayProducts();
      }
    } catch (error) {
      console.error("discount error:", error);
    }
  }
});


