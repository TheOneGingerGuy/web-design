
    const ADMIN_ACCESS_CODE = "ADMIN2024";
    let currentRole = "admin";

function loginAsGuest() {
    localStorage.setItem("session", JSON.stringify({ key: "guest", role: "guest" }));
    window.location.href = "index.html";
}
function switchTab(tab) {
    document.getElementById("loginForm").style.display = tab === "login" ? "flex" : "none";
    document.getElementById("registerForm").style.display = tab === "register" ? "flex" : "none";
    document.getElementById("tabLogin").classList.toggle("active", tab === "login");
    document.getElementById("tabRegister").classList.toggle("active", tab === "register");
}

    function switchTab(tab) {
      document.getElementById("loginForm").style.display = tab === "login" ? "block" : "none";
      document.getElementById("registerForm").style.display = tab === "register" ? "block" : "none";
      document.getElementById("tabLogin").classList.toggle("active", tab === "login");
      document.getElementById("tabRegister").classList.toggle("active", tab === "register");
    }

    function register() {
      const name = document.getElementById("regName").value.trim();
      const user = document.getElementById("regUser").value.trim();
      const pass = document.getElementById("regPass").value;

      if (!name || !user || !pass) {
        document.getElementById("registerMsg").textContent = "Please fill in all required fields.";
        return;
      }

      if (currentRole === "admin") {
        const code = document.getElementById("regCode").value;
        if (code !== ADMIN_ACCESS_CODE) {
          document.getElementById("registerMsg").textContent = "Invalid admin access code.";
          return;
        }
        if (localStorage.getItem("admin_" + user)) {
          document.getElementById("registerMsg").textContent = "Username already taken.";
          return;
        }
        localStorage.setItem("admin_" + user, JSON.stringify({ name, username: user, password: pass, role: "admin" }));
      } else {
        const studentId = document.getElementById("regStudentId").value.trim();
        const year = document.getElementById("regYear").value;
        if (!studentId || !year) {
          document.getElementById("registerMsg").textContent = "Please fill in all fields.";
          return;
        }
        if (localStorage.getItem("student_" + user)) {
          document.getElementById("registerMsg").textContent = "Username already taken.";
          return;
        }
        localStorage.setItem("student_" + user, JSON.stringify({ name, username: user, password: pass, role: "student", studentId, year }));
      }

      document.getElementById("registerMsg").style.color = "#2e7d32";
      document.getElementById("registerMsg").textContent = "Account created! You can now sign in.";
    }

    function login() {
      const user = document.getElementById("loginUser").value.trim();
      const pass = document.getElementById("loginPass").value;
      const stored = localStorage.getItem(currentRole + "_" + user);

      if (!stored) {
        document.getElementById("loginMsg").textContent = "Account not found.";
        return;
      }

      const data = JSON.parse(stored);
      if (data.password !== pass) {
        document.getElementById("loginMsg").textContent = "Incorrect password.";
        return;
      }

      const rememberMe = document.getElementById("rememberMe").checked;
      if (rememberMe) {
        localStorage.setItem("savedUsername", user);
        localStorage.setItem("savedPassword", pass);
        localStorage.setItem("savedRole", currentRole);
      } else {
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("savedPassword");
        localStorage.removeItem("savedRole");
      }

      localStorage.setItem("session", JSON.stringify({ key: currentRole + "_" + user, role: currentRole }));
      window.location.href = "dashboard.html";
    }

window.addEventListener("DOMContentLoaded", () => {
    const session = localStorage.getItem("session");
    if (session) {
        const s = JSON.parse(session);
        if (s.role === "guest") {
            localStorage.removeItem("session"); // clear so login page works fresh
            return;
        }
        const stored = localStorage.getItem(s.key);
        if (stored) {
            window.location.href = "dashboard.html";
            return;
        }
    }

    const savedRole = localStorage.getItem("savedRole");
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedRole) {
        switchRole(savedRole);
        const radio = document.querySelector(`input[name='role'][value='${savedRole}']`);
        if (radio) radio.checked = true;
    }
    if (savedUsername) document.getElementById("loginUser").value = savedUsername;
    if (savedPassword) document.getElementById("loginPass").value = savedPassword;
    if (savedUsername || savedPassword) document.getElementById("rememberMe").checked = true;
    switchTab("login");
});
