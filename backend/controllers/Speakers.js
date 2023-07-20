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

const { generateSpeakersPost } = require("../utils/postMockup");
const {
  createPost,
  getPostCategoriesId,
  deletePost,
} = require("../utils/wordpress");

const { generateSchedule } = require("../utils/postMockup");

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
    });
    return res.status(200).json(speaker);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getSchedule = async (req, res) => {
  const { speakerId, conferenceId } = req.params;
  console.log("inside getSchedule");
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
                  through: { attributes: ["role"] },
                  required: true,
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
              order: [["date", "ASC"]],
            },
          ],
        },
        {
          model: Topic,
          where: { conferenceId: conferenceId },
          required: false,
        },
      ],
    });
    // const speaker = await Speaker.findByPk(speakerId, {
    //   include: [
    //     {
    //       model: Topic,
    //       through: { where: { speakerId: speakerId }, attributes: [] },
    //       include: [{ model: Session, where: { conferenceId: conferenceId } }],
    //     },
    //     {
    //       model: Session,
    //       where: { conferenceId: conferenceId },
    //       through: { where: { speakerId: speakerId }, attributes: ["role"] },
    //     },
    //   ],
    // });
    console.log(speaker);
    const schedule = generateSchedule(speaker.toJSON());
    generateSchedule(speaker.dataValues);

    const response = {
      schedule: schedule,
      speaker: speaker,
    };

    // console.log(response);

    return res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
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
    for (let i = 0; i < speakerItems.length; i++) {
      const topicsArr = [];
      const topicSpeakersData = [];

      // Add to wordpress here
      // Get the wordpress speaker link and post id then add to conferenceSpeaker table

      //Generate html data for speaker's post

      const postCategoryId = await getPostCategoriesId(
        speakerItems[i]["name"]["country"]
      );

      // console.log("category id: ", postCategoryId);

      const speakersInfo = {
        biography: speakerItems[i]["name"]["biography"],
        photoUrl: speakerItems[i]["name"]["photoUrl"],
      };
      const speakerName = `${speakerItems[i]["name"]["firstName"]} ${speakerItems[i]["name"]["lastName"]}`;

      console.log(speakersInfo);

      const html = generateSpeakersPost(speakersInfo);
      console.log("html: ", html);
      const { wordPressPostLink, wordPressPostId } = await createPost(
        html,
        speakerName,
        postCategoryId
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
      // If topics were provided
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
  try {
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
  // console.log("speakerId: ", speakerId);
  // console.log("conferenceId: ", conferenceId);
  try {
    const speakerDetails = await ConferenceSpeaker.findAll({
      where: {
        [Op.and]: [{ speakerId: speakerId }, { conferenceId: conferenceId }],
      },
    });

    const speakerPostId = speakerDetails[0].dataValues.speakerPostId;

    // console.log(speakerPostId);

    // Remove speaker from WordPress
    await deletePost(speakerPostId);

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

    return res.status(200).json("Speaker removed from conference");
  } catch (err) {
    return res.status(500).json(err);
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
};
