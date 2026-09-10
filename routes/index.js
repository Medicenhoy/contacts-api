const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Contacts API - CSE 341 Project 1');
});

router.use('/contacts', require('./contacts'));
router.use('/', require('./swagger'));

module.exports = router;
