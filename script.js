// Show entry modal on homepage load if not already dismissed
window.addEventListener('DOMContentLoaded', function() {
	if (!sessionStorage.getItem('entryModalDismissed')) {
		const modal = document.getElementById('entryModal');
		if (modal) modal.style.display = 'flex';
	}
});

function closeEntryModal() {
	const modal = document.getElementById('entryModal');
	if (modal) modal.style.display = 'none';
	sessionStorage.setItem('entryModalDismissed', '1');
}
