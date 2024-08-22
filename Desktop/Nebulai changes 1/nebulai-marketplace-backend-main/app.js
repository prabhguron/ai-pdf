const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const talentRoutes = require('./routes/talentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const offerRoutes = require('./routes/offerRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const AIRoutes = require('./routes/AIRoutes');
const searchRoutes = require('./routes/searchRoutes');
const evmRoutes = require('./routes/evmRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const appUrlMiddleware = require('./middleware/appUrlMiddleware');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const githubRoutes = require('./routes/githubRoutes');

const app = express();

app.use(xss());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(appUrlMiddleware);

require('./config/passport')(passport);
app.use(passport.initialize());

// userVerification();
// eventListener();
// cryptoPrice('MATIC').then((price) => {
//   console.log(price);
// });

// List of APIs
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/talent', talentRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/ai', AIRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/evm', evmRoutes);
app.use('/api/v1/evm', evmRoutes);
app.use('/api/v1/auth', githubRoutes);

app.get('/', (req, res) => {
  return res.status(200).json({
    health: 'NEB HEALTHY... ⚡️',
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
