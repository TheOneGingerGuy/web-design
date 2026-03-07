  const ADMIN_ACCESS_CODE = "ADMIN2024";
    let currentRole = "admin";

    function switchRole(role) {
      currentRole = role;
      document.getElementById("loginTitle").textContent =
        role === "admin" ? "Administrator Sign In" : "Student Sign In";
      document.getElementById("registerTitle").textContent =
        role === "admin" ? "Register Administrator Account" : "Register Student Account";
      document.getElementById("accessCodeField").style.display =
        role === "admin" ? "block" : "none";
      document.getElementById("studentExtraFields").style.display =
        role === "student" ? "block" : "none";
    }

    function switchTab(tab) {
      document.getElementById("loginForm").style.display = tab === "login" ? "block" : "none";
      document.getElementById("registerForm").style.display = tab === "register" ? "block" : "none";
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

      localStorage.setItem("session", JSON.stringify({ key: currentRole + "_" + user, role: currentRole }));
      showDashboard(data);
    }

    function showDashboard(data) {
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("registerForm").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      document.getElementById("dashName").textContent = data.name;
      document.getElementById("dashRole").textContent = data.role === "admin" ? "Administrator" : "Student";
      document.getElementById("dashExtra").textContent =
        data.role === "student" ? "Student ID: " + data.studentId + " | Year: " + data.year : "";
    }

    function logout() {
      localStorage.removeItem("session");
      document.getElementById("dashboard").style.display = "none";
      document.getElementById("loginForm").style.display = "block";
      document.getElementById("loginMsg").textContent = "";
    }

    // Auto-login if session exists
    window.addEventListener("DOMContentLoaded", () => {
      const session = localStorage.getItem("session");
      if (session) {
        const s = JSON.parse(session);
        const stored = localStorage.getItem(s.key);
        if (stored) showDashboard(JSON.parse(stored));
      }
    });