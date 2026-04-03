document.addEventListener("click", (e) => {
    const accountMenu = document.querySelector(".account-menu");
    const accountBtn = document.getElementById("accountBtn");
    if (accountMenu && !accountMenu.contains(e.target) && e.target !== accountBtn) {
        const dropdown = document.getElementById("accountDropdown");
        if (dropdown) dropdown.style.display = "none";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const session = localStorage.getItem("session");

    if (!session) {
        localStorage.setItem("session", JSON.stringify({ key: "guest", role: "guest" }));
        showGuest();
        return;
    }

    const s = JSON.parse(session);

    if (s.role === "guest") {
        showGuest();
        return;
    }

    const stored = localStorage.getItem(s.key);
    if (stored) {
        const data = JSON.parse(stored);
        const nameEl = document.getElementById("dashName");
        if (nameEl) nameEl.textContent = data.name;
        showLoggedIn(s.key);
    } else {
        window.location.href = "login.html";
    }
});

function showGuest() {
    document.getElementById("guestCourses").style.display = "block";
    document.getElementById("guestUpcoming").style.display = "block";
    document.getElementById("myCard").style.display = "none";
    document.getElementById("upcomingCard").style.display = "none";
    const nameEl = document.getElementById("dashName");
    if (nameEl) nameEl.textContent = "Log In";
}

function showLoggedIn(userKey) {
    document.getElementById("guestCourses").style.display = "none";
    document.getElementById("guestUpcoming").style.display = "none";
    document.getElementById("myCard").style.display = "block";
    document.getElementById("upcomingCard").style.display = "block";
    loadItems(userKey);
    loadUpcoming();
}

// --- Notes card ---
function loadItems(userKey) {
    const items = JSON.parse(localStorage.getItem("notes_" + userKey) || "[]");
    const list = document.getElementById("savedItems");
    list.innerHTML = "";
    if (items.length === 0) {
        list.innerHTML = "<li style='color:#999'>No courses yet</li>";
        return;
    }
    items.forEach((item, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${item}</span><button class="delete-btn" onclick="deleteItem(${i})">✕</button>`;
        list.appendChild(li);
    });
}

function addItem() {
    const input = document.getElementById("newItemInput");
    const text = input.value.trim();
    if (!text) return;
    const session = JSON.parse(localStorage.getItem("session"));
    const userKey = session.key;
    const items = JSON.parse(localStorage.getItem("notes_" + userKey) || "[]");
    items.push(text);
    localStorage.setItem("notes_" + userKey, JSON.stringify(items));
    input.value = "";
    loadItems(userKey);
}

function deleteItem(index) {
    const session = JSON.parse(localStorage.getItem("session"));
    const userKey = session.key;
    const items = JSON.parse(localStorage.getItem("notes_" + userKey) || "[]");
    items.splice(index, 1);
    localStorage.setItem("notes_" + userKey, JSON.stringify(items));
    loadItems(userKey);
}

// --- Upcoming from schedule page ---
function loadUpcoming() {
    const session = JSON.parse(localStorage.getItem("session"));
    const userKey = session.key;
    const events = JSON.parse(localStorage.getItem("scheduleEvents_" + userKey) || "[]");
    const list = document.getElementById("upcomingList");
    list.innerHTML = "";
    if (events.length === 0) {
        list.innerHTML = "<li style='color:#999'>No upcoming sessions — sign up on the <a href='schedule.html'>Schedule</a> page</li>";
        return;
    }
    events.forEach(event => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${event.type}</strong> — ${event.topic} at ${event.time}`;
        li.style.marginBottom = "0.5rem";
        list.appendChild(li);
    });
}

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
    window.location.href = "index.html";
}