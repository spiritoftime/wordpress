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
      include: [
        { model: Topic },
        { model: Room },
        { model: Conference, attributes: { include: ["country"] } },
      ],
      where: { conferenceId },
    });
    // console.log("sessions", sessions);
    return res.status(200).json(sessions);
  } catch (err) {
    console.log("error", err);
    return res.status(500).json(err);
  }
};
const addSession = async (req, res) => {
  const { conferenceId } = req.params;
  const {
    date,
    startTime,
    endTime,
    isPublish,
    location,
    presentationDuration,
    sessionCode,
    sessionType,
    speakers,
    synopsis,
    title,
    topics,
  } = req.body;
  console.log("location", location);
  try {
    const room = await Room.findOne({
      where: { room: location, conferenceId: conferenceId },
    });
    const roomId = room.id;
    // console.log("roomid", room.id);
    const session = await Session.create(
      {
        title,
        synopsis,
        isPublish,
        sessionType,
        date,
        startTime,
        endTime,
        conferenceId,
        roomId: room.id,
        sessionCode,
        // sessionSpeaker: addSessionSpeakers,
      }
      // {
      //   include: [
      //     {
      //       association: SessionSpeaker,
      //     },
      //   ],
      // }
    );
    // for the moderators who are not presenting a topic
    // speaker is an array containing {id,value,label}
    let addSessionSpeakers = [];
    speakers.map(({ speakerRole, speaker: speakers }) => {
      for (const speaker of speakers) {
        const sessionSpeaker = {};
        sessionSpeaker.speakerId = speaker.id;
        sessionSpeaker.role = speakerRole;
        sessionSpeaker.sessionId = session.id;
        addSessionSpeakers.push(sessionSpeaker);
      }
    });
    // console.log(addSessionSpeakers, "addSessionSpeakers");
    await SessionSpeaker.bulkCreate(addSessionSpeakers);
    // to update the session id in the topics table
    const addTopics = topics.map((t) => {
      console.log("topic", t);
      const addTopic = {};
      addTopic.title = t.topic;
      addTopic.startTime = t.startTime;
      addTopic.endTime = t.endTime;
      addTopic.conferenceId = conferenceId;
      addTopic.sessionId = session.id;
      return addTopic;
    });
    console.log("addtopics", addTopics);
    await Topic.bulkCreate(addTopics, { updateOnDuplicate: ["title"] });
    return res.status(200).json(session);
  } catch (err) {
    console.log(err, "err");
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
