// Middleware để ghi log các yêu cầu đến server
function requestLogger(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
}

export { requestLogger };  // Sử dụng export thay vì module.exports
