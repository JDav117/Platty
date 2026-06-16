const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');

const authRoutes = require('./routes/auth.routes');
const authGoogleRoutes = require('./routes/auth.google.routes');
const usersRoutes = require('./routes/users.routes');
const recipesRoutes = require('./routes/recipes.routes');
const categoriesRoutes = require('./routes/categories.routes');
const commentsRoutes = require('./routes/comments.routes');
const ratingsRoutes = require('./routes/ratings.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const searchRoutes = require('./routes/search.routes');
const adminDashboardRoutes = require('./routes/admin/dashboard.routes');
const adminUsersRoutes = require('./routes/admin/users.routes');
const adminRecipesRoutes = require('./routes/admin/recipes.routes');
const adminCategoriesRoutes = require('./routes/admin/categories.routes');
const adminAuditRoutes = require('./routes/admin/audit.routes');
const adminReportsRoutes = require('./routes/admin/reports.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bienvenido a Platty API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auth', authGoogleRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/recipes', adminRecipesRoutes);
app.use('/api/admin/categories', adminCategoriesRoutes);
app.use('/api/admin/audit', adminAuditRoutes);
app.use('/api/admin/reports', adminReportsRoutes);

app.use(errorHandler);

module.exports = app;
