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

const getSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await Session.findByPk(sessionId);
    return res.status(200).json(session);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const getSessions = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const sessions = await Session.findAll({
      include: [{ model: Topic }, { model: Room }],
      where: { conferenceId },
    });
    return res.status(200).json(sessions);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const addSession = async (req, res) => {
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
    const sessionId = conference.dataValues.id;
    roomItems.forEach((room) => {
      room.sessionId = sessionId;
    });
    const rooms = await Room.bulkCreate(roomItems);

    return res.status(200).json(conference);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const EditSession = async (req, res) => {
  const { sessionId } = req.params;
  const { startDate, endDate, name, country, venue, wordpressApi, roomItems } =
    req.body;

  try {
    await Room.destroy({ where: { sessionId } });
    roomItems.forEach((room) => {
      room.sessionId = sessionId;
    });
    await Room.bulkCreate(roomItems);
    const conference = await Conference.update(
      { startDate, endDate, name, country, venue, wordpressApi },
      { where: { id: sessionId } }
    );
    return res.status(200).json(conference);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const DeleteSession = async (req, res) => {
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
  addSession,
  getSessions,
  EditSession,
  DeleteSession,
  getSession,
};
