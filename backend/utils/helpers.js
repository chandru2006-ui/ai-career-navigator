/**
 * Utility helpers used across the application
 */

/**
 * Wrap async route handlers to catch errors and pass to next()
 */
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Safe JSON parse — returns null on failure instead of throwing
 */
function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Clamp a number between min and max
 */
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * Round to N decimal places
 */
function roundTo(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Pick only allowed keys from an object (whitelist)
 */
function pick(obj, keys) {
  const result = {};
  keys.forEach(k => { if (k in obj) result[k] = obj[k]; });
  return result;
}

/**
 * Paginate an array
 */
function paginate(arr, page = 1, limit = 20) {
  const start = (page - 1) * limit;
  return {
    data:  arr.slice(start, start + limit),
    total: arr.length,
    page,
    pages: Math.ceil(arr.length / limit)
  };
}

module.exports = { asyncHandler, safeJsonParse, clamp, roundTo, pick, paginate };
