module.exports = function (asyncHandler) {
  return async function (req, res, next) {
    try {
      await asyncHandler(req, res)
    } catch (ex) {
      next(ex)
    }
  }
}