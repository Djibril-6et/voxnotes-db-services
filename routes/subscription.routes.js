const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

router.post('/', subscriptionController.createSubscription);
router.get('/user/:userId', subscriptionController.getSubscriptionByUserId);
router.put('/:id', subscriptionController.updateSubscriptionStatus);
router.put('/:stripeSessionId/cancel', subscriptionController.cancelSubscription);

module.exports = router;