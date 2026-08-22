// ================================
// LOGIN
// ================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginMessage = document.getElementById("loginMessage");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        loginMessage.style.color = "green";
        loginMessage.textContent = "Login successful! Redirecting...";

        window.location.href = "/dashboard";
      } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = data.message;
      }

    } catch (error) {
      loginMessage.style.color = "red";
      loginMessage.textContent = "Something went wrong. Please try again.";
      console.error(error);
    }
  });
}


// ================================
// REGISTER
// ================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const registerMessage = document.getElementById("registerMessage");

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        registerMessage.style.color = "green";
        registerMessage.textContent =
          "Registration successful! Redirecting to login...";

        setTimeout(() => {
          window.location.href = "/index.html";
        }, 1000);

      } else {
        registerMessage.style.color = "red";
        registerMessage.textContent = data.message;
      }

    } catch (error) {
      registerMessage.style.color = "red";
      registerMessage.textContent = "Something went wrong. Please try again.";
      console.error(error);
    }
  });
}


// ================================
// DASHBOARD
// ================================

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const welcomeMessage = document.getElementById("welcomeMessage");

if (userName && userEmail) {
  fetch("/api/user")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        userName.textContent = data.user.name;
        userEmail.textContent = data.user.email;

        if (welcomeMessage) {
          welcomeMessage.textContent =
            `Hello, ${data.user.name}! 👋`;
        }
      } else {
        window.location.href = "/index.html";
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);

      if (welcomeMessage) {
        welcomeMessage.textContent =
          "Unable to load user information.";
      }
    });
}


// ================================
// LOGOUT
// ================================

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST"
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/index.html";
      }

    } catch (error) {
      console.error("Logout error:", error);
    }
  });
}