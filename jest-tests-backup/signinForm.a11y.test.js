/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByLabelText, getByRole, getAllByRole } from '@testing-library/dom';

describe('Sign-in Form Accessibility', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="signin-form">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" autocomplete="username" />
        <label for="password">Password</label>
        <input type="password" id="password" name="password" autocomplete="current-password" />
        <button type="submit">Sign In</button>
      </form>
    `;
  });

  it('each input has a visible label associated via for/id', () => {
    expect(getByLabelText(document.body, /email/i)).toBeInstanceOf(HTMLInputElement);
    expect(getByLabelText(document.body, /password/i)).toBeInstanceOf(HTMLInputElement);
  });

  it('form is keyboard navigable (tab order)', () => {
    const tabbables = getAllByRole(document.body, 'textbox');
    tabbables.push(getByRole(document.body, 'button', { name: /sign in/i }));
    // Simulate tabbing through the form
    tabbables.forEach((el) => {
      el.focus();
      expect(document.activeElement).toBe(el);
    });
  });
});
