document.addEventListener('DOMContentLoaded', function () {
  console.log('Signin script loaded');
  const form = document.getElementById('signin-form');
  if (!form) {
    console.error('Signin form not found');
    return;
  }

  console.log('Signin form found, adding submit event listener');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Form submitted');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      console.error('Email or password is empty');
      return;
    }

    console.log('Sending signin request to /auth/signin');
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = 'Signing in...';

    // Use fetch API instead of XMLHttpRequest
    fetch('/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
      console.log('Response status:', response.status);
      return response.json().then(data => {
        return { status: response.status, data };
      });
    })
    .then(result => {
      console.log('Response data:', result.data);
      
      if (result.status === 200) {
        console.log('Signin successful');
        messageDiv.textContent = 'Sign-in successful! Redirecting...';
        messageDiv.style.color = 'green';

        // Redirect to next URL if present
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next');
        if (next) {
          console.log('Redirecting to:', next);
          window.location.assign(next);
        } else {
          console.log('Reloading page');
          window.location.reload();
        }
      } else {
        console.error('Signin failed:', result.status);
        let msg = 'Sign-in failed.';
        if (result.data && result.data.message) {
          msg = result.data.message;
        }
        messageDiv.textContent = msg;
        messageDiv.style.color = 'red';
      }
    })
    .catch(error => {
      console.error('Error during signin:', error);
      messageDiv.textContent = 'An error occurred. Please try again.';
      messageDiv.style.color = 'red';
    });
  });
});
