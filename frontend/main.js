"use strict";

//*****************************-----register_user-------***********************************************/

if (document.title === "MyStoreMate register") {
  document
    .querySelector(".register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const shopName = document
        .querySelector(".register-shop-name")
        .value.trim();
      const ownerName = document
        .querySelector(".register-owner-name")
        .value.trim();
      const email = document.querySelector(".register-email").value.trim();
      const mobile = document.querySelector(".register-mobile").value.trim();
      const password = document.querySelector(".register-password").value;

      const user = {
        shopName,
        ownerName,
        email,
        mobile,
        password,
      };
      try { 
        const response = await fetch("http://localhost:8000/api/users", {
          method: "POST",
          body: JSON.stringify(user),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log(response, data);
        if (response.ok) {
          localStorage.setItem("shopkeeper", JSON.stringify(data));
          alert("User registered successfully");
          window.location.href = "dashboard.html";
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("error:", error);
      }
    });
}
 
if (document.title === "MyStoreMate login") {
  document.querySelector(".login-form").addEventListener("submit", async (e) =>{
    e.preventDefault()
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value

    try{
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: 'POST',
        body:JSON.stringify({email, password}),
        headers: {"Content-Type":"application/json"}
      })

      const data = await response.json()

      if(response.ok){
        localStorage.setItem("shopkeeper", JSON.stringify(data))
        alert('logged in successfully')
        window.location.href = 'dashboard.html'
      }

    }catch(error){
      console.error('error:', error)
    }
  })
}
