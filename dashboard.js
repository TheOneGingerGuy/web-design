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
        window.location.href = "index.html";
        return;
    }

    const s = JSON.parse(session);

    if (s.role === "guest") {
        // Show example cards with login hint
        document.getElementById("guestCourses").style.display = "block";
        document.getElementById("guestUpcoming").style.display = "block";
        const nameEl = document.getElementById("dashName");
if (nameEl) nameEl.textContent = "Log In";
        return;
    }

    // Logged in — hide example cards, show empty dashboard
    document.getElementById("guestCourses").style.display = "none";
    document.getElementById("guestUpcoming").style.display = "none";

    const stored = localStorage.getItem(s.key);
    if (stored) {
        const data = JSON.parse(stored);
        const nameEl = document.getElementById("dashName");
        if (nameEl) nameEl.textContent = data.name;
    } else {
        window.location.href = "index.html";
    }
});

function toggleAccountMenu() {
    const session = localStorage.getItem("session");
    const s = session ? JSON.parse(session) : null;

    if (!s || s.role === "guest") {
        window.location.href = "index.html";
        return;
    }

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
