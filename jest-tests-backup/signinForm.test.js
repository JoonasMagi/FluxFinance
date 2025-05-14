/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

describe('Sign-in Form', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="signin-form">
        <input type="email" id="email" name="email" />
        <input type="password" id="password" name="password" />
        <button type="submit">Sign In</button>
      </form>
      <div id="message"></div>
    `;

    // Mock fetch API
    global.fetch = jest.fn();
  });

  it('allows submission when both email and password are entered', async () => {
    // Mock successful response
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ message: 'Success' })
    });

    // Load the frontend logic using dynamic import
    await import('../public/signin.js');

    // Dispatch DOMContentLoaded to trigger event listeners
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const form = document.getElementById('signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    emailInput.value = 'user@example.com';
    passwordInput.value = 'password123';

    // Submit the form
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Expect fetch to be called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith('/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
      })
    });
  });

  it('shows a generic error message on invalid credentials', async () => {
    // Mock error response
    global.fetch.mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve({ message: 'Email or password is incorrect' })
    });

    // Load the frontend logic using dynamic import
    await import('../public/signin.js');

    // Dispatch DOMContentLoaded to trigger event listeners
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const form = document.getElementById('signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    emailInput.value = 'wrong@example.com';
    passwordInput.value = 'wrongpass';

    // Submit the form
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Wait for the fetch promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    const messageDiv = document.getElementById('message');
    expect(messageDiv.textContent).toBe('Email or password is incorrect');
  });

  it('redirects to the next URL after successful sign-in', async () => {
    // Mock successful response
    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ message: 'Success' })
    });

    // Set the next URL in the query string
    delete window.location;
    window.location = {
      search: '?next=/invoices/3',
      assign: jest.fn(),
      reload: jest.fn()
    };

    // Load the frontend logic using dynamic import
    await import('../public/signin.js');

    // Dispatch DOMContentLoaded to trigger event listeners
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const form = document.getElementById('signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    emailInput.value = 'user@example.com';
    passwordInput.value = 'password123';

    // Submit the form
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    // Wait for the fetch promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(window.location.assign).toHaveBeenCalledWith('/invoices/3');
  });
});
