// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
	const accountMenu = document.querySelector(".account-menu");
	if (accountMenu && !accountMenu.contains(e.target)) {
		const dropdown = document.getElementById("accountDropdown");
		if (dropdown) {
			dropdown.style.display = "none";
		}
	}
});

// On dashboard load, show user info if logged in
window.addEventListener("DOMContentLoaded", () => {
    const session = localStorage.getItem("session");
    
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    const s = JSON.parse(session);

if (s.role === "guest") {
    const accountBtn = document.getElementById("accountBtn");
    if (accountBtn) {
        accountBtn.textContent = "Log In";
        accountBtn.onclick = () => window.location.href = "login.html";
    }
    document.querySelectorAll(".card").forEach(card => {
        card.innerHTML = "<p>Please <a href='login.html'>log in</a> to view this content.</p>";
    });
    return;
}

    const stored = localStorage.getItem(s.key);
    if (stored) {
        const data = JSON.parse(stored);
        const nameEl = document.getElementById("dashName");
        const roleEl = document.getElementById("dashRole");
        const extraEl = document.getElementById("dashExtra");
        if (nameEl) nameEl.textContent = data.name;
        if (roleEl) roleEl.textContent = data.role === "admin" ? "Administrator" : "Student";
        if (extraEl) extraEl.textContent = data.role === "student" ? `Student ID: ${data.studentId} | Year: ${data.year}` : "";
    } else {
        window.location.href = "login.html";
    }
});

function toggleAccountMenu() {
	const dropdown = document.getElementById("accountDropdown");
	if (dropdown) {
		dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
	}
}

function logout() {
	// Clear session storage
	localStorage.removeItem("session");
	// Redirect to login page
	window.location.href = "login.html";
}
