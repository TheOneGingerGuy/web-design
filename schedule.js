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
        renderSchedule();
        return;
    }

    const s = JSON.parse(session);
    const stored = localStorage.getItem(s.key);
    if (stored) {
        const data = JSON.parse(stored);
        if (nameEl) nameEl.textContent = data.name;

        if (data.role === "admin") {
            document.getElementById("adminCard").style.display = "block";
        } else {
            document.getElementById("mySessionsCard").style.display = "block";
            loadMySessions(s.key);
        }
    }

    renderSchedule();
});

// Render schedule rows from localStorage (admin-added) + defaults
function renderSchedule() {
    const defaultSessions = [
        { type: "Tutoring", topic: "JavaScript", time: "10:00 AM" },
        { type: "Tutoring", topic: "Python", time: "11:00 AM" },
        { type: "Tutoring", topic: "HTML", time: "1:00 PM" },
        { type: "Tutoring", topic: "CSS", time: "2:00 PM" },
        { type: "Group Study", topic: "HTML", time: "10:00 AM" },
        { type: "Group Study", topic: "Python", time: "11:00 AM" },
    ];

    const adminSessions = JSON.parse(localStorage.getItem("adminSessions") || "[]");
    const allSessions = [...defaultSessions, ...adminSessions];

    const tutoringBody = document.getElementById("tutoringBody");
    const groupBody = document.getElementById("groupBody");
    tutoringBody.innerHTML = "";
    groupBody.innerHTML = "";

    const session = localStorage.getItem("session");
    const isGuest = !session || JSON.parse(session).role === "guest";
    const userKey = isGuest ? null : JSON.parse(session).key;
    const userSessions = userKey ? JSON.parse(localStorage.getItem("scheduleEvents_" + userKey) || "[]") : [];

    allSessions.forEach((s) => {
        const signed = userSessions.find(e => e.type === s.type && e.topic === s.topic && e.time === s.time);
        const icon = s.type === "Tutoring" ? "👤" : "👥";
        const btnHtml = isGuest
            ? `<button class="signup-btn" onclick="signUp('${s.type}','${s.topic}','${s.time}')">Sign Up</button>`
            : signed
                ? `<button class="signup-btn signed" disabled>Signed Up</button>`
                : `<button class="signup-btn" onclick="signUp('${s.type}','${s.topic}','${s.time}')">Sign Up</button>`;

        const row = `
            <div class="row">
                <div class="cell left"><span class="personIcon">${icon}</span><span class="time">${s.time}</span></div>
                <div class="cell right">${s.topic}</div>
                <div class="cell right">${btnHtml}</div>
            </div>`;

        if (s.type === "Tutoring") {
            tutoringBody.innerHTML += row;
        } else {
            groupBody.innerHTML += row;
        }
    });
}

function addSession() {
    const type = document.getElementById("sessionType").value;
    const topic = document.getElementById("sessionTopic").value.trim();
    const time = document.getElementById("sessionTime").value.trim();

    if (!topic || !time) {
        document.getElementById("sessionMsg").style.color = "#d32f2f";
        document.getElementById("sessionMsg").textContent = "Please fill in all fields.";
        return;
    }

    const adminSessions = JSON.parse(localStorage.getItem("adminSessions") || "[]");
    adminSessions.push({ type, topic, time });
    localStorage.setItem("adminSessions", JSON.stringify(adminSessions));

    document.getElementById("sessionTopic").value = "";
    document.getElementById("sessionTime").value = "";
    document.getElementById("sessionMsg").style.color = "#2e7d32";
    document.getElementById("sessionMsg").textContent = "Session added!";

    renderSchedule();
}

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
    renderSchedule();
}

function loadMySessions(userKey) {
    const sessions = JSON.parse(localStorage.getItem("scheduleEvents_" + userKey) || "[]");
    const list = document.getElementById("mySessionsList");
    const noMsg = document.getElementById("noSessionsMsg");
    if (!list) return;
    list.innerHTML = "";

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
    renderSchedule();
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
    window.location.href = "login.html";
}