module.exports = (req, res, next) => {
  if (!req.user || !req.user.isAdmin)
    return next({ name: 'DomainActionError', error: { message: 'action require admin privileges' } }, req, res, null);
  else return next();
}