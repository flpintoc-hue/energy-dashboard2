/**
 * 🔒 SECURITY MODULE - XSS Protection
 * 
 * This module provides sanitization utilities to prevent XSS attacks.
 * ALWAYS use these functions before displaying user input.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string to prevent XSS
 * Use this before setting innerHTML or rendering user-provided HTML
 * 
 * @param {string} dirty - Untrusted HTML string
 * @returns {string} - Safe HTML string
 */
export function sanitizeHTML(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'p', 'br', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize text - strips ALL HTML tags
 * Use this for plain text fields (names, addresses, phone numbers, etc.)
 * 
 * @param {string} text - Untrusted text
 * @returns {string} - Plain text with no HTML
 */
export function sanitizeText(text) {
  if (!text) return '';
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize phone number - only allows digits and basic formatting
 * 
 * @param {string} phone - Phone number input
 * @returns {string} - Sanitized phone number
 */
export function sanitizePhone(phone) {
  if (!phone) return '';
  // Only allow digits, spaces, hyphens, parentheses, and plus
  return phone.replace(/[^\d\s\-\(\)\+]/g, '');
}

/**
 * Sanitize email - basic email validation
 * 
 * @param {string} email - Email input
 * @returns {string} - Sanitized email
 */
export function sanitizeEmail(email) {
  if (!email) return '';
  // Remove any HTML and trim
  const cleaned = sanitizeText(email).trim();
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(cleaned) ? cleaned : '';
}

/**
 * Sanitize address - allows letters, numbers, and common punctuation
 * 
 * @param {string} address - Address input
 * @returns {string} - Sanitized address
 */
export function sanitizeAddress(address) {
  if (!address) return '';
  // Allow letters, numbers, spaces, and common address characters
  return address.replace(/[^\w\s\.,\-#]/g, '');
}

/**
 * Create a safe DOM element with sanitized content
 * 
 * @param {string} tag - HTML tag name
 * @param {string} content - Content to sanitize
 * @param {object} attributes - Safe attributes to add
 * @returns {HTMLElement} - Safe DOM element
 */
export function createSafeElement(tag, content, attributes = {}) {
  const element = document.createElement(tag);
  element.textContent = sanitizeText(content);
  
  // Only allow safe attributes
  const safeAttrs = ['class', 'id', 'data-id', 'style'];
  Object.keys(attributes).forEach(key => {
    if (safeAttrs.includes(key)) {
      element.setAttribute(key, attributes[key]);
    }
  });
  
  return element;
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 * 
 * @param {string} url - URL to sanitize
 * @returns {string} - Safe URL or empty string
 */
export function sanitizeURL(url) {
  if (!url) return '';
  const cleaned = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (cleaned.startsWith('javascript:') || 
      cleaned.startsWith('data:') || 
      cleaned.startsWith('vbscript:')) {
    return '';
  }
  
  // Only allow http, https, and relative URLs
  if (!cleaned.startsWith('http://') && 
      !cleaned.startsWith('https://') && 
      !cleaned.startsWith('/') &&
      !cleaned.startsWith('./')) {
    return '';
  }
  
  return url.trim();
}

/**
 * Escape special characters for safe display
 * Use when you need to display user input as-is without HTML
 * 
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHTML(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export DOMPurify instance for advanced usage
export { DOMPurify };
