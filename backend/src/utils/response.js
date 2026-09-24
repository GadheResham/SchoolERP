/**
 * Standardised JSON response helpers.
 * ALL controllers must use these — never call res.json() directly.
 */

export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

export const sendCreated = (res, data = {}, message = 'Created successfully') =>
  res.status(201).json({ success: true, message, data });

export const sendNoContent = (res) =>
  res.status(204).send();

export const sendError = (res, message = 'An error occurred', statusCode = 500, errors = []) =>
  res.status(statusCode).json({ success: false, message, errors });

export const sendPaginated = (res, data, pagination, message = 'Success') =>
  res.status(200).json({ success: true, message, data, pagination });
