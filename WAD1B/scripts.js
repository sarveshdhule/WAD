document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  // Switch to Signup Form
  showSignup.addEventListener("click", function (e) {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
  });

  // Switch to Login Form
  showLogin.addEventListener("click", function (e) {
    e.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // Signup Form Submission (Simulate AJAX)
  document.getElementById("signup").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    // Validation
    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // User data object
    const userData = { email, password };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Simulate adding user to db.json (using json-server POST request)
    simulateAjaxRequest("POST", "http://localhost:3000/users", userData)
      .then((response) => {
        alert("Signup successful! Please login.");
        signupForm.style.display = "none";
        loginForm.style.display = "block";
      })
      .catch((error) => {
        alert("Signup failed: " + error);
      });
  });

  // Login Form Submission (Simulate AJAX)
  // Login Form Submission (Simulate AJAX)
  document.getElementById("login").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Validation
    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Create the login data object
    const loginData = { email, password };

    // Simulate checking user login against the users in the database (JSON Server)
    simulateLoginRequest("POST", "http://localhost:3000/users", loginData)
      .then((response) => {
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        // If no user found in localStorage, alert and return
        if (!storedUser) {
          alert("No user found. Please sign up first.");
          return;
        }

        // If user found in localStorage and data matches
        if (storedUser.email === email && storedUser.password === password) {
          alert("Login successful! Welcome.");
        } else {
          alert("Login failed: Incorrect email or password.");
        }
      })
      .catch((error) => {
        alert("Login failed: " + error);
      });
  });

  // Simulate login request by checking users in JSON Server
  function simulateLoginRequest(method, url, data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true); // Use GET to retrieve users from JSON Server
      xhr.setRequestHeader("Content-Type", "application/json");

      // Simulate server delay
      setTimeout(() => {
        xhr.onload = function () {
          if (xhr.status === 200) {
            const users = JSON.parse(xhr.responseText); // Get all users from the server
            const foundUser = users.find(
              (user) =>
                user.email === data.email && user.password === data.password
            );

            if (foundUser) {
              resolve({ message: "Login successful" });
            } else {
              reject("Incorrect email or password");
            }
          } else {
            reject("Failed to fetch users");
          }
        };

        xhr.onerror = function () {
          reject("Network error");
        };

        xhr.send();
      }, 1000); // Simulate 1 second delay for the AJAX call
    });
  }

  // Function to simulate AJAX request (POST)
  function simulateAjaxRequest(method, url, data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      // Simulate server delay
      setTimeout(() => {
        // If it's a signup or login POST request, resolve successfully
        if (method === "POST") {
          resolve({ message: "Request successful" });
        } else {
          reject("Error: Invalid request");
        }
      }, 1000); // Simulate 1 second delay for the AJAX call

      xhr.onerror = function () {
        reject("Network error");
      };

      // Send the AJAX request with the data as a JSON string
      xhr.send(JSON.stringify(data));
    });
  }

  // Function to validate email
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
});
