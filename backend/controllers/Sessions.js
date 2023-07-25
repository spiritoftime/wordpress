const db = require("../db/models");
const {
  Conference,
  Speaker,
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

const { updateWordPressSpeakers } = require("../controllers/Speakers");
const { getConferenceUrl } = require("../controllers/Conferences");

const {
  generateSpeakersForSession,
  removeDuplicates,
} = require("../utils/speakers");
const { updateOnePage, createPage } = require("../utils/wordpress");
const {
  generateHTML,
  generateSpeakersPost,
  generateSchedule,
} = require("../utils/postMockup");
const { minifyHtml } = require("../utils/minifyHTML");
const { overviewMockup } = require("../utils/overviewMockup");

const getSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await Session.findByPk(sessionId, {
      include: [
        {
          model: Topic,
          include: [
            {
              model: Speaker,
              attributes: {
                include: ["fullName", "lastName", "firstName", "country"],
              },
              include: [{ model: Conference }],
            },
          ],
        },
        {
          model: Speaker,
          through: {
            model: SessionSpeaker,
            attributes: ["role"],
          },
          include: [{ model: Conference }],
        },
        { model: Room },
      ],
    });
    return res.status(200).json(session);
  } catch (err) {
    console.log(err, "err");
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
        {
          model: Conference,
          attributes: { include: ["country", "wordpressUrl"] },
        },
      ],
      where: { conferenceId },
      order: [["date", "ASC"]],
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
  // // console.log("location", location);
  // // console.log("discussionDuration", discussionDuration, presentationDuration);

  try {
    // Get the base url from database to determin which wordpress website to update
    const conferenceWordPressUrl = await getConferenceUrl(conferenceId);

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
      const { wordpressLink, wordpressId } = await createPage(
        minifiedContent,
        title,
        conferenceWordPressUrl
      );
      await Session.update(
        { wordpressUrl: wordpressLink, wordpressId: wordpressId },
        { where: { id: session.id } }
      );
      // console.log("link", wordpressLink);

      // Update speaker's schedule on wordpress
      await updateWordPressSpeakers(
        speakers,
        topics,
        conferenceId,
        conferenceWordPressUrl
      );
    }

    return res.status(200).json(updatedTopics);
  } catch (err) {
    console.log(err, "err with add");
    return res.status(500).json(err);
  }
};

const EditSession = async (req, res) => {
  const { conferenceId, sessionId } = req.params;
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
  try {
    // Get the base url from database to determin which wordpress website to update
    const conferenceWordPressUrl = await getConferenceUrl(conferenceId);

    // Get all speakers that are previously in the session
    const previousSessionSpeakers = await getSessionSpeaker(
      sessionId,
      conferenceId
    );

    const room = await Room.findOne({
      where: { room: location, conferenceId: conferenceId },
    });
    const roomId = room.id;
    // console.log("roomid", room.id);
    const session = await Session.update(
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
      },
      { where: { id: sessionId } }
    );
    const currSession = await Session.findByPk(sessionId);
    // Get all associated speakers for the session
    const speakersToRemove = await currSession.getSpeakers();
    console.log(speakersToRemove, "speakerstoremove");
    // Remove all speakers from the session
    await currSession.removeSpeakers(speakersToRemove);
    let addSessionSpeakers = [];
    speakers.map(({ speakerRole, speaker: speakers }) => {
      for (const speaker of speakers) {
        const sessionSpeaker = {};
        sessionSpeaker.speakerId = speaker.id;
        sessionSpeaker.role = speakerRole;
        sessionSpeaker.sessionId = sessionId;
        addSessionSpeakers.push(sessionSpeaker);
      }
    });
    console.log(addSessionSpeakers, "addSessionSpeakers");
    // console.log(addSessionSpeakers, "addSessionSpeakers");
    await SessionSpeaker.bulkCreate(addSessionSpeakers);
    // to update the session id in the topics table
    const addTopics = topics.map((t) => {
      const addTopic = {};
      addTopic.title = t.topic;
      addTopic.startTime = t.startTime;
      addTopic.endTime = t.endTime;
      addTopic.conferenceId = conferenceId;
      addTopic.sessionId = sessionId;
      addTopic.id = t.topicId;
      return addTopic;
    });
    // console.log("addtopics", addTopics);
    const updatedTopics = await Topic.bulkCreate(addTopics, {
      updateOnDuplicate: ["startTime", "endTime", "sessionId"],
    });
    console.log("updatedTopics", updatedTopics);
    if (isPublish) {
      let { wordpressId: currWordpressId } = await Session.findOne({
        where: { id: sessionId },
        attributes: ["wordpressId"],
      });
      if (currWordpressId) {
        const postContent = generateHTML(data);
        const minifiedContent = await minifyHtml(postContent);
        const wordpressPage = await updateOnePage(
          currWordpressId,
          {
            content: minifiedContent,
            status: "publish",
          },
          conferenceWordPressUrl
        );
        await Session.update(
          {
            wordpressUrl: wordpressPage.data.link,
            wordpressId: wordpressPage.data.id,
          },
          { where: { id: sessionId } }
        );
      } else {
        const postContent = generateHTML(data);
        const minifiedContent = await minifyHtml(postContent);

        const { wordpressLink, wordpressId } = await createPage(
          minifiedContent,
          title,
          conferenceWordPressUrl
        );
        await Session.update(
          { wordpressUrl: wordpressLink, wordpressId: wordpressId },
          { where: { id: session.id } }
        );
      }
    }

    // Update speaker's schedule on wordpress
    await updateWordPressSpeakers(
      speakers,
      topics,
      conferenceId,
      conferenceWordPressUrl,
      [],
      previousSessionSpeakers
    );

    return res.status(200).json(updatedTopics);
  } catch (err) {
    console.log(err, "err with edit");
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
  const newContent = req.body;
  console.log(newContent, "newContent");
  const conference = await Conference.findByPk(+newContent.conferenceId, {
    attributes: ["wordpressId"],
  });
  const conferenceWordPressUrl = await getConferenceUrl(
    +newContent.conferenceId
  );
  const overviewHtml = await overviewMockup({
    sessionEvents: newContent.content,
    startDate: newContent.startDate,
  });
  console.log("At updateProgram controller");
  try {
    await updateOnePage(
      conference.wordpressId,
      { content: overviewHtml, isPublish: newContent.isChecked ? true : false },
      conferenceWordPressUrl
    );
    return res.status(200).json("Program Overview Updated");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getSessionSpeaker = async (sessionId, conferenceId) => {
  try {
    const sessionSpeakers = await Session.findOne({
      where: { id: sessionId, conferenceId: conferenceId },
      include: [
        {
          model: Speaker,
          include: [
            {
              model: Conference,
            },
          ],
        },
        {
          model: Topic,
          include: [{ model: Speaker, include: [{ model: Conference }] }],
        },
      ],
    });
    const finalData = sessionSpeakers.toJSON();

    const finalSpeakers = generateSpeakersForSession(
      finalData.Speakers,
      finalData.Topics
    );

    return finalSpeakers;
  } catch (error) {
    console.log("error", error);
  }
};

// Function to count all Symposium for a conference
const getTotalSymposia = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const symposiaCount = await Session.findAndCountAll({
      where: { conferenceId: conferenceId, sessionType: "Symposia" },
    });
    return res.status(200).json(symposiaCount);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Function to count all Symposium for a conference
const getTotalMasterclass = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const masterclassCount = await Session.findAndCountAll({
      where: { conferenceId: conferenceId, sessionType: "Masterclass" },
    });
    return res.status(200).json(masterclassCount);
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
  getSessionSpeaker,
  getTotalSymposia,
  getTotalMasterclass,
};
