// Middleware để xử lý lỗi
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Đã xảy ra lỗi! Xin vui lòng thử lại sau.');
}

module.exports = {
    errorHandler
};
