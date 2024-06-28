const express = require('express');
const { addBugReport } = require('../controllers/bugReportController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/bugReports:
 *   post:
 *     summary: Add a new bug report
 *     tags: [BugReports]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - reportedBy
 *               - reportDate
 *             properties:
 *               description:
 *                 type: string
 *               reportedBy:
 *                 type: string
 *               reportDate:
 *                 type: string
 *                 format: date
 *               fixed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Bug report added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, addBugReport);

module.exports = router;
