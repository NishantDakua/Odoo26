/**
 * Formatting utilities for consistent number/currency display.
 *
 * Using a fixed locale ('en-IN') ensures that the server and the browser
 * produce identical strings, which prevents React hydration mismatches.
 */

const LOCALE = 'en-IN';

/** Format a number as Indian Rupees — e.g. 171000 → "₹1,71,000" */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString(LOCALE)}`;
}

/** Format a plain number with Indian grouping — e.g. 171000 → "1,71,000" */
export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE);
}
