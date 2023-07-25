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
const { createPage } = require("../utils/wordpress");

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
    const conferences = await Conference.findAll({
      include: Room,
      order: [["name", "ASC"]],
    });
    return res.status(200).json(conferences);
  } catch (err) {
    return res.status(500).json(err);
  }
};
const addConference = async (req, res) => {
  const { startDate, endDate, name, country, venue, wordpressApi, roomItems } =
    req.body;
  try {
    const { wordpressLink, wordpressId } = await createPage(
      "draft",
      "draft",
      wordpressApi
    );
    console.log(wordpressLink, wordpressId, "wallahi");
    const conference = await Conference.create({
      startDate,
      endDate,
      name,
      country,
      venue,
      wordpressUrl: wordpressLink,
      wordpressId,
      wordpressApi,
    });
    const conferenceId = conference.dataValues.id;
    roomItems.forEach((room) => {
      room.conferenceId = conferenceId;
    });
    const rooms = await Room.bulkCreate(roomItems);

    return res.status(200).json(conference);
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json(err);
  }
};
const EditConference = async (req, res) => {
  const { conferenceId } = req.params;
  const {
    startDate,
    endDate,
    conferenceName: name,
    country,
    venue,
    wordpressApi,
    roomItems,
  } = req.body;
  console.log("roomitems", roomItems);

  try {
    roomItems.forEach((room) => {
      room.conferenceId = conferenceId;
    });
    await Room.bulkCreate(roomItems, { updateOnDuplicate: ["room"] });
    console.log("work2");
    const conference = await Conference.update(
      {
        startDate,
        endDate,
        name,
        country,
        venue,
        wordpressApi,
      },
      { where: { id: conferenceId } }
    );
    console.log("last");
    return res.status(200).json(conference);
  } catch (err) {
    console.log(err, "err");
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
    console.log(err, "err");
    return res.status(500).json(err);
  }
};

const getConferenceUrl = async (conferenceId) => {
  try {
    const url = await Conference.findByPk(conferenceId, {
      attributes: ["wordpressApi"],
    });
    const urlJson = url.toJSON();
    const wordPressUrl = urlJson.wordpressApi;
    return wordPressUrl;
  } catch (e) {
    console.log("error", e);
  }
};

const getLatestConference = async () => {
  try {
    const latestConferenceData = await Conference.findAll({
      limit: 1,
      order: [["startDate", "DESC"]],
    });
    const latestConference = JSON.parse(JSON.stringify(latestConferenceData));
    return latestConference;
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports = {
  addConference,
  EditConference,
  DeleteConference,
  getConference,
  getConferences,
  getConferenceUrl,
  getLatestConference,
};
