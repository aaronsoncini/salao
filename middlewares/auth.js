function requireAdmin(req, res, next) {
    if (req.session && req.session.adminLogado) {
        return next();
    }
    res.redirect('/admin/login');
}

module.exports = { requireAdmin };
