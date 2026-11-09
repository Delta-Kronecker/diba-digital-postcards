const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value) {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatPersianDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return toPersianDigits(d.toLocaleDateString('fa-IR'));
}

export function formatPersianNumber(value, options = {}) {
  const num = Number(value);
  if (Number.isNaN(num)) return toPersianDigits(value);
  return toPersianDigits(num.toLocaleString('fa-IR', options));
}