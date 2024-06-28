const express = require('express');
const { addAssetOrder } = require('../controllers/assetOrderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/assetOrders:
 *   post:
 *     summary: Add a new asset order
 *     tags: [AssetOrders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetName
 *               - quantity
 *               - orderDate
 *               - addedBy
 *             properties:
 *               assetName:
 *                 type: string
 *               quantity:
 *                 type: number
 *               orderDate:
 *                 type: string
 *                 format: date
 *               addedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset order added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, addAssetOrder);

module.exports = router;
