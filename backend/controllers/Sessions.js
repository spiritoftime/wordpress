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
const { getSchedule } = require("../controllers/Speakers");

const {
  getAllWordPressPost,
  updateOnePage,
  createPost,
  createPage,
} = require("../utils/wordpress");
const { generateHTML } = require("../utils/postMockup");
const { minifyHtml } = require("../utils/minifyHTML");

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
  const data = req.body;
  const {
    date,
    startTime,
    endTime,
    isPublish,
    location,
    discussionDuration,
    presentationDuration,
    sessionCode,
    sessionType,
    speakers,
    synopsis,
    title,
    topics,
  } = data;
  // console.log("location", location);
  // console.log("discussionDuration", discussionDuration, presentationDuration);

  console.log("speakers", speakers[0].speaker);
  // speakers [ { speakerRole: 'Chair', speaker: [ [Object] ] } ]
  console.log(
    "topics",
    topics.map((topic) => topic.speakers)
  );

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
        discussionDuration,
        presentationDuration,
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
    // tried to create together but got EagerLoadingError [SequelizeEagerLoadingError]: SessionSpeaker is not associated to Session! Im assuming you cant eager create rows in a join table.
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
      const addTopic = {};
      addTopic.title = t.topic;
      addTopic.startTime = t.startTime;
      addTopic.endTime = t.endTime;
      addTopic.conferenceId = conferenceId;
      addTopic.sessionId = session.id;
      addTopic.id = t.topicId;
      return addTopic;
    });
    // console.log("addtopics", addTopics);
    const updatedTopics = await Topic.bulkCreate(addTopics, {
      updateOnDuplicate: ["startTime", "endTime", "sessionId"],
    });
    // console.log("updatedTopics", updatedTopics);
    if (isPublish) {
      const postContent = generateHTML(data);
      const minifiedContent = await minifyHtml(postContent);
      // console.log("postContent", postContent);
      const wordpressLink = await createPage(
        minifiedContent,
        title,
        sessionCode
      );
      // console.log("link", wordpressLink);
    }
    return res.status(200).json(updatedTopics);
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

const updateProgramOverview = async (req, res) => {
  // console.log("hello");
  const newContent = req.body;
  console.log(newContent);
  console.log("At updateProgram controller");
  try {
    await updateOnePage(33323, newContent);
    return res.status(200).json("Program Overview Updated");
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
  updateProgramOverview,
};
