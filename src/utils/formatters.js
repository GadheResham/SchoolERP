/**
 * Formatting helpers for SchoolERP
 */

export function formatCurrency(amount, currency = '₹') {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currency}0`;
  }
  const num = Number(amount);
  return `${currency}${num.toLocaleString('en-IN')}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
