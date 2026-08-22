document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // LOGIN
  // =========================

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const message = document.getElementById("loginMessage");

      try {

        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          message.textContent = data.message || "Login failed.";
          return;
        }

        message.textContent = "Login successful!";

        // Go to protected dashboard
        window.location.href = "/dashboard";

      } catch (error) {

        console.error("Login error:", error);

        message.textContent =
          "Unable to connect to the server.";

      }

    });

  }


  // =========================
  // REGISTER
  // =========================

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const message = document.getElementById("registerMessage");

      try {

        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password
          })
        });

        const data = await response.json();

        if (!response.ok) {

          if (message) {
            message.textContent =
              data.message || "Registration failed.";
          }

          return;
        }

        if (message) {
          message.textContent =
            "Registration successful!";
        }

        // Go back to login
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);

      } catch (error) {

        console.error("Registration error:", error);

        if (message) {
          message.textContent =
            "Unable to connect to the server.";
        }

      }

    });

  }


  // =========================
  // LOGOUT
  // =========================

  const logoutButton =
    document.getElementById("logoutButton");

  if (logoutButton) {

    logoutButton.addEventListener("click", async () => {

      try {

        const response = await fetch("/logout", {
          method: "POST"
        });

        if (response.ok) {
          window.location.href = "/";
        }

      } catch (error) {

        console.error("Logout error:", error);

      }

    });

  }

});