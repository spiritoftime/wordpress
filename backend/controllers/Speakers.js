const db = require("../db/models");
const { Speaker } = db;
const { Op } = require("sequelize");

const getSpeaker = async (req, res) => {
  const { speakerId } = req.params;
  try {
    const speaker = await Speaker.findByPk(speakerId);
    return res.status(200).json(speaker);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.findAll();
    return res.status(200).json(speakers);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const addSpeaker = async (req, res) => {
  const {
    firstName,
    lastName,
    country,
    title,
    email,
    organisation,
    biography,
    photoUrl,
  } = req.body;
  try {
    const speaker = await Speaker.create({
      firstName,
      lastName,
      country,
      title,
      email,
      organisation,
      biography,
      photoUrl,
    });

    return res.status(200).json(speaker);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getSpeaker,
  getSpeakers,
  addSpeaker,
};
