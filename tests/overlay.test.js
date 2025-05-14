/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

describe('Sign-in Overlay', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <h1>Welcome to FluxFinance</h1>
      </div>
      <div id="signin-overlay" style="display:flex;">
        <div><h2>Sign in to continue</h2></div>
      </div>
    `;
  });

  it('hides the overlay if already authenticated', async () => {
    window.isAuthenticated = true;

    // Mock fetch API
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ authenticated: true, user: 'user@example.com' })
    });

    // Use dynamic import for ES modules
    await import('../public/overlay.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Wait for the fetch promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.getElementById('signin-overlay').style.display).toBe('none');
  });

  it('shows the overlay if not authenticated', async () => {
    window.isAuthenticated = false;

    // Mock fetch API
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ authenticated: false })
    });

    // Use dynamic import for ES modules
    await import('../public/overlay.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Wait for the fetch promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.getElementById('signin-overlay').style.display).toBe('flex');
  });
});
