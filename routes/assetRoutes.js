const express = require('express');
const { createAsset, getAllAssets, getAssetById, updateAsset, deleteAsset } = require('../controllers/assetController');
const { validateAssetCreation } = require('../middlewares/validateFields');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, validateAssetCreation, createAsset);
router.get('/', authMiddleware, getAllAssets);
router.get('/:id', authMiddleware, getAssetById);
router.put('/:id', authMiddleware, validateAssetCreation, updateAsset);
router.delete('/:id', authMiddleware, deleteAsset);

module.exports = router;
