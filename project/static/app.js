// FlexFit Gym Maintenance Tracker
// Basic Client-side JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('FlexFit Maintenance Tracker loaded.');

    // Simple confirmation before resolving a ticket
    const resolveButtons = document.querySelectorAll('.btn-resolve');
    resolveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const confirmed = confirm('Are you sure you want to mark this maintenance job as resolved?');
            if (!confirmed) {
                e.preventDefault();
            }
        });
    });

    // Auto-focus username input on login page if present
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.focus();
    }
});
