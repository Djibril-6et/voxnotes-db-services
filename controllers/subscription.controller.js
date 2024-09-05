const Subscription = require('../models/subscription.model');

// Create a new subscription
exports.createSubscription = async (req, res) => {
  const { userId, stripeSessionId, paymentMethod, amountPaid } = req.body;

  try {
    const subscription = new Subscription({
      userId,
      stripeSessionId,
      paymentMethod,
      amountPaid,
    });
    await subscription.save();
    res.status(201).json({
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription', details: error.message });
  }
};

// Get a subscription by ID
exports.getSubscriptionByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription', details: error.message });
  }
};

// Update a subscription status
exports.updateSubscriptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status, endDate } = req.body;

  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = status || subscription.status;
    subscription.endDate = endDate || subscription.endDate;

    await subscription.save();
    res.status(200).json({ message: 'Subscription updated successfully', subscription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subscription', details: error.message });
  }
};