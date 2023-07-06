const db = require("../db/models");
const {
  Conference,
  ConferenceSpeaker,
  Session,
  SessionSpeaker,
  SessionSpeakerRole,
  Role,
  Topic,
  TopicSpeaker,
  Room,
} = db;
const { Op } = require("sequelize");

const getConference = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const conference = await Conference.findByPk(conferenceId);
    return res.status(200).json(conference);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const getConferences = async (req, res) => {
  try {
    const conferences = await Conference.findAll({ include: Room });
    return res.status(200).json(conferences);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const addConference = async (req, res) => {
  const { startDate, endDate, name, country, venue, wordpressApi, roomItems } =
    req.body;
  try {
    const conference = await Conference.create({
      startDate,
      endDate,
      name,
      country,
      venue,
      wordpressApi,
    });
    const conferenceId = conference.dataValues.id;
    roomItems.forEach((room) => {
      room.conferenceId = conferenceId;
    });
    const rooms = await Room.bulkCreate(roomItems);

    return res.status(200).json(conference);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const EditConference = async (req, res) => {
  const { conferenceId } = req.params;
  const { startDate, endDate, name, country, venue, wordpressApi } = req.body;
  try {
    const conference = await Conference.update(
      { startDate, endDate, name, country, venue, wordpressApi },
      { where: { id: conferenceId } }
    );
    return res.status(200).json(conference);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const DeleteConference = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    await Conference.destroy({
      where: { id: conferenceId },
    });
    return res.status(200).json("Conference deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
};
module.exports = {
  addConference,
  EditConference,
  DeleteConference,
  getConference,
  getConferences,
};
