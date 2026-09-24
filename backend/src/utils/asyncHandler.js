/**
 * Wraps async route handlers and forwards thrown errors to next().
 * Required on every route handler per rules.md.
 *
 * @example
 *   router.get('/:id', asyncHandler(StudentController.getById));
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
