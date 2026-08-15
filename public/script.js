// ==============================
// REGISTER
// ==============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    document.getElementById("message").innerText =
      data.message;

    if (response.ok) {
      registerForm.reset();
    }
  });
}


// ==============================
// LOGIN
// ==============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value
    };

    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    document.getElementById("loginMessage").innerText =
      data.message;

    if (response.ok) {
      window.location.href = "/dashboard";
    }
  });
}


// ==============================
// DASHBOARD
// ==============================

const welcomeMessage =
  document.getElementById("welcomeMessage");

if (welcomeMessage) {

  fetch("/api/user")
    .then(response => {

      if (!response.ok) {
        window.location.href = "/";
        return;
      }

      return response.json();
    })

    .then(user => {

      if (!user) return;

      document.getElementById("userName").innerText =
        user.name;

      document.getElementById("userEmail").innerText =
        user.email;

      document.getElementById("welcomeMessage").innerText =
        `Welcome back, ${user.name}!`;
    });
}


// ==============================
// LOGOUT
// ==============================

const logoutButton =
  document.getElementById("logoutButton");

if (logoutButton) {

  logoutButton.addEventListener("click", async () => {

    const response = await fetch("/logout", {
      method: "POST"
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  });
}