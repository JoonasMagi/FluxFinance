// overlay.js: Hide the sign-in overlay if authenticated, show if not.
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('signin-overlay');
  if (!overlay) return;
  fetch('/auth/status', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (data.authenticated) {
        overlay.style.display = 'none';
      } else {
        overlay.style.display = 'flex';
      }
    })
    .catch(() => {
      overlay.style.display = 'flex';
    });
});
