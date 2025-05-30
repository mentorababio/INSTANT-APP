const express = require('express');
const router = express.Router();

const { getElectricityProviders, validateMeter } = require('../controllers/billController');
const { purchaseElectricity } = require('../controllers/electricityController');



const {validateElectricityPayment} = require('../middleware/validation');

const {handleValidationErrors} = require('../middleware/validation');


router.post('/', ...validateElectricityPayment, handleValidationErrors, purchaseElectricity);
router.get('/providers', getElectricityProviders);
router.post('/validate-meter', validateMeter);

module.exports = router;
