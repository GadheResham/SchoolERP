import { Router } from 'express';

const router = Router();

/**
 * Domain routers are mounted here as each phase is completed.
 * All routes are prefixed with /api/v1 (set in app.js).
 */

// Phase 2 — Authentication
// import authRouter from './auth.js';
// router.use('/auth', authRouter);

// Phase 3 — Classes
// import classRouter from './classes.js';
// router.use('/classes', classRouter);

// Phase 4 — Parents
// import parentRouter from './parents.js';
// router.use('/parents', parentRouter);

// Phase 5 — Students
// import studentRouter from './students.js';
// router.use('/students', studentRouter);

// Phase 6 — Attendance
// import attendanceRouter from './attendance.js';
// router.use('/attendance', attendanceRouter);

// Phase 7 — Fee Structures
// import feeRouter from './fees.js';
// router.use('/fees', feeRouter);

// Phase 8 — Payments
// import paymentRouter from './payments.js';
// router.use('/payments', paymentRouter);

// Phase 9 — Dashboard
// import dashboardRouter from './dashboard.js';
// router.use('/dashboard', dashboardRouter);

// Phase 10 — Reports
// import reportRouter from './reports.js';
// router.use('/reports', reportRouter);

// Phase 11 — Settings
// import settingsRouter from './settings.js';
// router.use('/settings', settingsRouter);

// API v1 root — placeholder
router.get('/', (_req, res) => {
  res.json({ success: true, message: 'SchoolERP API v1', version: '1.0.0' });
});

export default router;
