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

const getConferenceRooms = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const conferenceRooms = await Room.findAll({
      where: { conferenceId: conferenceId },
    });
    return res.status(200).json(conferenceRooms);
  } catch (err) {
    console.log("roomerror", err);
    return res.status(500).json(err);
  }
};

module.exports = { getConferenceRooms };
