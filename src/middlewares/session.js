import session from 'express-session';
import e from 'express';
const app = e();

// Cấu hình express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',  // Secret dùng để mã hóa session
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Secure chỉ khi ở môi trường production
        maxAge: 3600000, // Thời gian sống của session (1 giờ)
    },
}));
