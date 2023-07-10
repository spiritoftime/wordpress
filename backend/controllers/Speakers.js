const db = require("../db/models");
const { Speaker, Topic, TopicSpeaker, ConferenceSpeaker } = db;
const { Op } = require("sequelize");

const {
  getAuthAccessToken,
  updateUserInAuth,
  addUserToAuth,
  getUserFromAuth,
  deleteUserFromAuth,
} = require("../utils");

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

  const { conferenceId } = req.params;

  try {
    for (let i = 0; i < speakerItems.length; i++) {
      const topicsArr = [];
      const topicSpeakersData = [];

      speakersId.push({
        speakerId: speakerItems[i].name.id,
        conferenceId: conferenceId,
      });

      for (const key in speakerItems[i]) {
        if (key !== "name" && speakerItems[i][key].length > 0) {
          topicsArr.push({ title: speakerItems[i][key] });
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
    console.log(err);
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
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getSpeaker,
  getSpeakers,
  addSpeaker,
  addSpeakersToConference,
  deleteSpeaker,
  updateSpeaker,
};
