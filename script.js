document.addEventListener("click", (e) => {
    const accountMenu = document.querySelector(".account-menu");
    const accountBtn = document.getElementById("accountBtn");
    if (accountMenu && !accountMenu.contains(e.target) && e.target !== accountBtn) {
        const dropdown = document.getElementById("accountDropdown");
        if (dropdown) {
            dropdown.style.display = "none";
        }
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const session = localStorage.getItem("session");
    const nameEl = document.getElementById("dashName");

    if (!session || JSON.parse(session).role === "guest") {
        if (nameEl) nameEl.textContent = "Log In";
        return;
    }

    const s = JSON.parse(session);
    const stored = localStorage.getItem(s.key);
    if (stored) {
        const data = JSON.parse(stored);
        if (nameEl) nameEl.textContent = data.name;
    }
});

function toggleAccountMenu() {
    const session = localStorage.getItem("session");
    const s = session ? JSON.parse(session) : null;

    if (!s || s.role === "guest") {
        window.location.href = "login.html";
        return;
    }

    const dropdown = document.getElementById("accountDropdown");
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    }
}

function logout() {
    localStorage.removeItem("session");
    const nameEl = document.getElementById("dashName");
    const dropdown = document.getElementById("accountDropdown");
    if (nameEl) nameEl.textContent = "Log In";
    if (dropdown) dropdown.style.display = "none";
}