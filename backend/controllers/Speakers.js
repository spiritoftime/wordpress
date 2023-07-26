const db = require("../db/models");
const {
  Speaker,
  Topic,
  TopicSpeaker,
  ConferenceSpeaker,
  Conference,
  Session,
  SessionSpeaker,
  Role,
  Room,
} = db;
const { Op } = require("sequelize");

const {
  updateUserInAuth,
  addUserToAuth,
  getUserFromAuth,
  deleteUserFromAuth,
} = require("../utils/auth");

const {
  createPost,
  getPostCategoriesId,
  deletePost,
  updateOnePost,
} = require("../utils/wordpress");

const {
  generateSchedule,
  generateSpeakersPost,
} = require("../utils/postMockup");

const {
  getConferenceUrl,
  getLatestConference,
} = require("../controllers/Conferences");

const { getSpeakersToUpdate, removeDuplicates } = require("../utils/speakers");

const { minifyHtml } = require("../utils/minifyHTML");

// Function to get a specific contact
// Includes all participated conference and sessions
const getSpeaker = async (req, res) => {
  const { speakerId } = req.params;
  try {
    const speaker = await Speaker.findByPk(speakerId, {
      include: [
        {
          model: Conference,
          include: [
            {
              model: Session,
              include: [
                {
                  model: Speaker,
                  where: { id: speakerId },
                  through: { attributes: ["role"] },
                  required: false,
                },
                {
                  model: Topic,
                  include: [{ model: Speaker, where: { id: speakerId } }],
                },
                {
                  model: Room,
                },
              ],
              order: [["date", "ASC"]],
            },
          ],
        },
      ],
      order: [[db.Conference, db.Session, "startTime", "ASC"]],
    });

    // Convert data into json for easy manipulation
    const finalSpeaker = speaker.toJSON();

    // Remove sessions not related to speaker
    finalSpeaker.Conferences.map((conference) => {
      for (let i = 0; i < conference.Sessions.length; i++) {
        if (
          conference.Sessions[i].Speakers.length <= 0 &&
          conference.Sessions[i].Topics.length <= 0
        ) {
          if (conference.Sessions.length === 1) {
            conference.Sessions = [];
          } else {
            conference.Sessions.splice(i, 1);
            i--;
          }
        }
      }
    });

    return res.status(200).json(finalSpeaker);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Function to get a speaker's presentation schedule for a specific conference
// Require speakerId and conferenceId as params
const getSchedule = async (req, res) => {
  const { speakerId, conferenceId } = req.params;
  console.log("at getSchedule");
  try {
    const schedule = await generateSpeakerSchedule(speakerId, conferenceId);
    return res.status(200).json(schedule);
  } catch {
    return res.status(500).json(err);
  }
};

// Helper function to generate speaker schedule
const generateSpeakerSchedule = async (speakerId, conferenceId) => {
  console.log("at generateSpeakerSchedule");
  try {
    const speaker = await Speaker.findByPk(speakerId, {
      include: [
        {
          model: Conference,
          where: { id: conferenceId },
          include: [
            {
              model: Session,
              include: [
                {
                  model: Speaker,
                  where: { id: speakerId },
                  through: {
                    attributes: ["role"],
                  },
                  required: false,
                },
                {
                  model: Topic,
                  include: [
                    {
                      model: Speaker,
                      where: { id: speakerId },
                    },
                  ],
                },
                {
                  model: Room,
                },
              ],
            },
          ],
        },
        {
          model: Topic,
          where: { conferenceId: conferenceId },
          required: false,
        },
      ],
      order: [
        [db.Topic, "id", "ASC"],
        [db.Conference, db.Session, "startTime", "ASC"],
      ],
    });

    if (speaker !== null || speaker !== undefined) {
      // Convert data into json for easy manipulation
      const finalSpeaker = speaker.toJSON();

      // Remove sessions not related to speaker
      finalSpeaker.Conferences.map((conference) => {
        for (let i = 0; i < conference.Sessions.length; i++) {
          if (
            conference.Sessions[i].Speakers.length <= 0 &&
            conference.Sessions[i].Topics.length <= 0
          ) {
            if (conference.Sessions.length === 1) {
              conference.Sessions = [];
            } else {
              conference.Sessions.splice(i, 1);
              i--;
            }
          }
        }
      });

      const schedule = generateSchedule(finalSpeaker);

      const response = {
        schedule: schedule,
        speaker: finalSpeaker,
      };

      return response;
    } else {
      return speaker;
    }
  } catch (err) {
    console.log("error: ", err);
  }
};

// Function to get all contacts
const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.findAll({
      order: [["id", "ASC"]],
    });
    return res.status(200).json(speakers);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Function to get contacts that are not added to the specific conference
const getContactsForAdding = async (req, res) => {
  const { conferenceId } = req.params;
  const finalSpeakers = [];
  try {
    const speakers = await Speaker.findAll({
      order: [["firstName", "ASC"]],
      include: [{ model: Conference }],
    });
    speakers.forEach((speaker) => {
      const joinedConferences = [];
      if (speaker.dataValues?.Conferences) {
        for (let i = 0; i < speaker.dataValues.Conferences.length; i++) {
          joinedConferences.push(speaker.dataValues.Conferences[i].id);
        }
      }
      if (!joinedConferences.includes(+conferenceId)) {
        finalSpeakers.push(speaker);
      }
    });
    return res.status(200).json(finalSpeakers);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Function to get speakers for a specific conference
const getSpeakersForConference = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const speakers = await Speaker.findAll({
      include: [
        {
          model: Conference,
          where: { id: conferenceId },
        },
      ],
      order: [["id", "ASC"]],
    });

    // Code below is to calculate the number of session that each speaker is in. Not completed.

    // const speakersId = [];
    // // console.log(speakers);
    // speakers.forEach((speaker) => {
    //   console.log(speaker.dataValues.id);
    //   speakersId.push(speaker.dataValues.id);
    // });
    // console.log(speakersId);
    // const speakersSession = await SessionSpeaker.findAll({
    //   where: { speakerId: { [Op.or]: speakersId } },
    // });
    // console.log(speakersSession);
    return res.status(200).json(speakers);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getSpeakerForConference = async (req, res) => {
  const { speakerId, conferenceId } = req.params;
  try {
    const speaker = await Speaker.findByPk(speakerId, {
      include: [
        {
          model: Topic,
          where: { conferenceId: conferenceId },
          required: false,
        },
      ],
    });
    return res.status(200).json(speaker);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Function to count all speakers for a conference
const getTotalSpeakers = async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const speakersCount = await ConferenceSpeaker.findAndCountAll({
      where: { conferenceId: conferenceId },
    });
    return res.status(200).json(speakersCount);
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
    isAdmin,
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
      isAdmin,
    });

    if (isAdmin) {
      const response = await addUserToAuth(firstName, email);
    }

    return res.status(200).json(speaker);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const addSpeakersToConference = async (req, res) => {
  const { speakerItems } = req.body;
  const speakersId = [];
  // console.log(speakerItems);

  const { conferenceId } = req.params;

  try {
    // Get the base url from database to determin which wordpress website to update
    const wordPressUrl = await getConferenceUrl(conferenceId);

    for (let i = 0; i < speakerItems.length; i++) {
      const topicsArr = [];
      const topicSpeakersData = [];

      // Get wordpress post category id which will be used to create post
      const postCategoryId = await getPostCategoriesId(
        speakerItems[i]["name"]["country"],
        wordPressUrl
      );

      // console.log("category id: ", postCategoryId);

      const speakersInfo = {
        biography: speakerItems[i]["name"]["biography"],
        photoUrl: speakerItems[i]["name"]["photoUrl"],
      };
      const speakerName = `${speakerItems[i]["name"]["firstName"]} ${speakerItems[i]["name"]["lastName"]}`;

      // console.log(speakersInfo);

      const html = generateSpeakersPost(speakersInfo);
      // console.log("html: ", html);

      // Create post on wordpress website
      const { wordPressPostLink, wordPressPostId } = await createPost(
        html,
        speakerName,
        postCategoryId,
        wordPressUrl
      );
      // console.log(wordPressPostLink, wordPressPostId);

      // Generate speakers object to add into conferenceSpeaker table
      speakersId.push({
        speakerId: speakerItems[i].name.id,
        conferenceId: conferenceId,
        speakerPostId: wordPressPostId,
        speakerLink: wordPressPostLink,
      });

      // Generate topics array to add into Topic table
      for (const key in speakerItems[i]) {
        if (key !== "name" && speakerItems[i][key].length > 0) {
          topicsArr.push({
            title: speakerItems[i][key],
            conferenceId: conferenceId,
          });
        }
      }
      // If topics are provided
      if (topicsArr.length > 0) {
        // Add proposed topics to Topics
        const topicsId = await Topic.bulkCreate(topicsArr);
        topicsId.forEach((topic) => {
          topicSpeakersData.push({
            speakerId: speakerItems[i].name.id,
            topicId: topic.dataValues.id,
          });
        });

        // Add speakerId and topicId to topicSpeakers
        const result = await TopicSpeaker.bulkCreate(topicSpeakersData);
      }
    }

    // Add speakers to conferenceSpeakers
    await ConferenceSpeaker.bulkCreate(speakersId);

    return res.status(200).json();
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteSpeaker = async (req, res) => {
  const { speakerId } = req.params;
  const { isAdmin, email } = req.body;
  console.log("speakerId: ", speakerId);
  try {
    const latestConference = await getLatestConference();

    console.log("latest Conference", latestConference);

    const wordPressUrl = latestConference[0].wordpressApi;
    console.log("WordPress Url:", wordPressUrl);

    const speakerDetails = await ConferenceSpeaker.findAll({
      where: {
        [Op.and]: [
          { speakerId: speakerId },
          { conferenceId: latestConference[0].id },
        ],
      },
    });

    const speakerPostId = speakerDetails[0].dataValues.speakerPostId;

    console.log("speakerPostId:", speakerPostId);

    await deletePost(speakerPostId, wordPressUrl);

    await Speaker.destroy({
      where: { id: speakerId },
    });

    if (isAdmin) {
      const userId = await getUserFromAuth(email);
      const response = await deleteUserFromAuth(userId);
    }
    return res.status(200).json("Speaker deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
};

const removeSpeakerFromConference = async (req, res) => {
  const { speakerId, conferenceId } = req.params;
  console.log("At removeSpeakerFromConference");
  // console.log("speakerId: ", speakerId);
  // console.log("conferenceId: ", conferenceId);

  // Get the base url from database to determin which wordpress website to update
  const wordPressUrl = await getConferenceUrl(conferenceId);

  try {
    // Get speaker's wordPress post ID
    const speakerDetails = await ConferenceSpeaker.findAll({
      where: {
        [Op.and]: [{ speakerId: speakerId }, { conferenceId: conferenceId }],
      },
    });

    const speakerPostId = speakerDetails[0].dataValues.speakerPostId;

    // Remove speaker from WordPress
    await deletePost(speakerPostId, wordPressUrl);

    // Remove speaker from the specific conference
    await ConferenceSpeaker.destroy({
      where: { speakerId: speakerId, conferenceId: conferenceId },
    });

    // Find all topics related to the speaker for that specific conference
    const relatedTopics = await Topic.findAll({
      where: { conferenceId: conferenceId },
      include: {
        model: Speaker,
        where: { id: speakerId },
      },
    });

    const topicIds = [];
    relatedTopics.forEach((topic) => {
      topicIds.push(topic.dataValues.id);
    });

    // Delete all topics related to the speaker for that specific conference
    await TopicSpeaker.destroy({ where: { id: topicIds } });
    await Topic.destroy({ where: { id: topicIds } });

    // Find if the speaker has a moderator role in any of the sessions
    const speakersInSession = await Session.findAll({
      where: { conferenceId: conferenceId },
      include: {
        model: Speaker,
        through: { model: SessionSpeaker, where: { speakerId: speakerId } },
      },
    });

    // Convert data into json for easy manipulation
    const speakersInSessionJson = JSON.parse(JSON.stringify(speakersInSession));

    const sessionSpeakerId = [];

    // Get the session ID for the sessions where the speaker is a moderator.
    for (let i = 0; i < speakersInSessionJson.length; i++) {
      const session = speakersInSessionJson[i];
      if (session.Speakers.length > 0) {
        for (let j = 0; j < session.Speakers.length; j++) {
          const speaker = session.Speakers[j];
          sessionSpeakerId.push(speaker.SessionSpeaker.id);
        }
      }
    }

    await SessionSpeaker.destroy({ where: { id: sessionSpeakerId } });

    return res.status(200).json("Speaker removed from conference");
  } catch (err) {
    return res.status(500).json(err);
  }
};

/**
 * Function to update speakers in wordpress
 * @param {Array} speakers Array of moderators, provided via add session form
 * @param {Array} topics Array of topics, provided via add session form
 * @param {number} conferenceId  Conference ID
 * @param {string} wordPressUrl Wordpress ULR of the specific conference
 * @param {array} oneSpeaker An array which only include one speaker object. Provided from updateSpeaker function. Define as empty array if not required.
 * @param {*} previousSpeakers An array of morderators and topic speakers who are in a specific session before session was updated. Define as empty array if not required.
 */
const updateWordPressSpeakers = async (
  speakers,
  topics,
  conferenceId,
  wordPressUrl,
  oneSpeaker,
  previousSpeakers
) => {
  let speakersToUpdate = [];
  let speakersFromForm = [];

  if (
    oneSpeaker &&
    (oneSpeaker.length > 0 || Object.keys(oneSpeaker).length > 0)
  ) {
    speakersFromForm = oneSpeaker;
  } else if (
    speakers &&
    (speakers.length > 0 || Object.keys(speakers).length > 0)
  ) {
    speakersFromForm = getSpeakersToUpdate(speakers, topics);
  }

  if (previousSpeakers && previousSpeakers.length > 0) {
    speakersToUpdate = removeDuplicates([
      ...speakersToUpdate,
      ...previousSpeakers,
    ]);
  } else {
    speakersToUpdate = speakersFromForm;
  }

  console.log("At updateWordPressSpeakers");
  console.log("final speakers to update", speakersToUpdate);

  for (let i = 0; i < speakersToUpdate.length; i++) {
    const speaker = speakersToUpdate[i];

    // Get speakers photo url and biography to generate wordpress base html
    const details = await Speaker.findByPk(speaker.speakerId, {
      attributes: { include: ["photoUrl", "biography", "fullName"] },
    });

    // // Generate wordpress speaker post base html
    const speakerDetails = details.toJSON();
    const speakerPostBaseHtml = generateSpeakersPost(speakerDetails);

    // Get speakers presentation from database
    const speakerPresentation = await generateSpeakerSchedule(
      speaker.speakerId,
      conferenceId
    );

    const speakerScheduleHtml = await minifyHtml(speakerPresentation.schedule);

    // Merge base html and speaker's schedule html
    const finalHtml = [speakerPostBaseHtml, speakerScheduleHtml].join("");

    // Update the content onto WordPress based on speakersPostId
    await updateOnePost(
      speaker.speakerPostId,
      speakerDetails.fullName,
      finalHtml,
      wordPressUrl
    );
  }
};

async function updateSpeaker(req, res) {
  const { speakerId } = req.params;
  const {
    firstName,
    lastName,
    country,
    title,
    email,
    organisation,
    biography,
    photoUrl,
    isAdmin,
    adminChanged,
  } = req.body;
  try {
    const latestConference = await getLatestConference();
    const conferenceId = latestConference[0].id;
    const wordPressUrl = latestConference[0].wordpressApi;

    const updatedSpeaker = await Speaker.update(
      {
        firstName,
        lastName,
        country,
        title,
        email,
        organisation,
        biography,
        photoUrl,
        isAdmin,
      },
      {
        where: { id: speakerId },
      }
    );

    // Get the latest conference id and url
    // Update wordpress speakers
    const speakerToUpdate = await ConferenceSpeaker.findOne({
      where: {
        conferenceId: conferenceId,
        speakerId: speakerId,
      },
      attributes: ["speakerId", "speakerPostId", "speakerLink"],
    });

    const wordPressSpeakerToUpdate = speakerToUpdate.toJSON();

    // Check if there is a change in admin status and update the database accordingly
    if (adminChanged) {
      if (isAdmin) {
        await addUserToAuth(firstName, email);
      } else {
        const userId = await getUserFromAuth(email);
        const response = await deleteUserFromAuth(userId);
      }
    } else if (isAdmin) {
      const userId = await getUserFromAuth(email);
      const response = await updateUserInAuth(userId, firstName);
    }

    // Update speaker info on wordpress. Only update to the latest conference.
    await updateWordPressSpeakers([], [], conferenceId, wordPressUrl, [
      wordPressSpeakerToUpdate,
    ]);

    return res.json(updatedSpeaker);
  } catch (err) {
    return res.status(400).json(err);
  }
}

module.exports = {
  getSpeaker,
  getSpeakers,
  getSpeakerForConference,
  getSpeakersForConference,
  getTotalSpeakers,
  getContactsForAdding,
  getSchedule,
  addSpeaker,
  addSpeakersToConference,
  deleteSpeaker,
  updateSpeaker,
  removeSpeakerFromConference,
  generateSpeakerSchedule,
  updateWordPressSpeakers,
};
