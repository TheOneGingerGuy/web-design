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

    // Show my sessions card for logged in users
    document.getElementById("mySessionsCard").style.display = "block";
    loadMySessions(s.key);
});

function signUp(type, topic, time) {
    const session = localStorage.getItem("session");
    if (!session || JSON.parse(session).role === "guest") {
        window.location.href = "login.html";
        return;
    }

    const s = JSON.parse(session);
    const userKey = s.key;
    const sessions = JSON.parse(localStorage.getItem("scheduleEvents_" + userKey) || "[]");

    const already = sessions.find(e => e.type === type && e.topic === topic && e.time === time);
    if (already) return;

    sessions.push({ type, topic, time });
    localStorage.setItem("scheduleEvents_" + userKey, JSON.stringify(sessions));
    loadMySessions(userKey);
    updateButtons(sessions);
}

function updateButtons(sessions) {
    document.querySelectorAll(".signup-btn").forEach(btn => {
        const onclick = btn.getAttribute("onclick");
        const match = onclick.match(/signUp\('(.+?)',\s*'(.+?)',\s*'(.+?)'\)/);
        if (!match) return;
        const [, type, topic, time] = match;
        const signed = sessions.find(e => e.type === type && e.topic === topic && e.time === time);
        if (signed) {
            btn.textContent = "Signed Up";
            btn.classList.add("signed");
            btn.disabled = true;
        } else {
            btn.textContent = "Sign Up";
            btn.classList.remove("signed");
            btn.disabled = false;
        }
    });
}

function loadMySessions(userKey) {
    const sessions = JSON.parse(localStorage.getItem("scheduleEvents_" + userKey) || "[]");
    const list = document.getElementById("mySessionsList");
    const noMsg = document.getElementById("noSessionsMsg");
    list.innerHTML = "";

    updateButtons(sessions);

    if (sessions.length === 0) {
        noMsg.style.display = "block";
        return;
    }

    noMsg.style.display = "none";
    sessions.forEach((s, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span><strong>${s.type}</strong> — ${s.topic} at ${s.time}</span>
                        <button class="remove-btn" onclick="removeSession(${i})">✕</button>`;
        list.appendChild(li);
    });
}

function removeSession(index) {
    const session = JSON.parse(localStorage.getItem("session"));
    const userKey = session.key;
    const sessions = JSON.parse(localStorage.getItem("scheduleEvents_" + userKey) || "[]");
    sessions.splice(index, 1);
    localStorage.setItem("scheduleEvents_" + userKey, JSON.stringify(sessions));
    loadMySessions(userKey);
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