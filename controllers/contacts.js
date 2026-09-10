const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all contacts
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    const contacts = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET a single contact by id
const getSingle = async (req, res) => {
  try {
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find({ _id: contactId });
    const contacts = await result.toArray();
    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts[0]);
  } catch (err) {
    res.status(400).json({ message: 'Invalid contact id' });
  }
};

// POST create a new contact
const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        message:
          'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }

    const contact = { firstName, lastName, email, favoriteColor, birthday };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res
        .status(500)
        .json({ message: 'Some error occurred while creating the contact.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update an existing contact
const updateContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact id' });
    }
    const contactId = new ObjectId(req.params.id);
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        message:
          'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }

    const contact = { firstName, lastName, email, favoriteColor, birthday };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .replaceOne({ _id: contactId }, contact);

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    if (response.modifiedCount > 0 || response.matchedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json({ message: 'Some error occurred while updating the contact.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE a contact
const deleteContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid contact id' });
    }
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .deleteOne({ _id: contactId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};
