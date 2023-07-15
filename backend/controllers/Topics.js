const db = require("../db/models");
const {
  Speaker,
  Topic,
  TopicSpeaker,
  ConferenceSpeaker,
  Conference,
  Session,
  SessionSpeaker,
  Sequelize,
} = db;
const { Op } = require("sequelize");
const getTopicsForAddingToSession = async (req, res) => {
  try {
    // console.log("runningggggg");
    const speakers = await Topic.findAll({
      attributes: ["title", "id"],
      where: { sessionId: { [Op.eq]: null } },
      include: [
        {
          model: Speaker,
          attributes: ["fullName", "firstName", "lastName", "country", "id"],
          through: {
            model: TopicSpeaker,
            attributes: [],
          },
          include: [
            {
              model: Session,
              attributes: ["id"],
            },
          ],
        },
      ],
    });

    // console.log(speakers, "speakers");
    return res.status(200).json(speakers);
  } catch (err) {
    console.log("err", err);
    return res.status(500).json(err);
  }
};
// Function to add or update topics
const addOrUpdateTopic = async (req, res) => {
  const data = req.body;
  const { speakerId, conferenceId } = req.params;
  const newTopics = [];

  try {
    for (const topic in data) {
      // If the topic alread has an ID, update the topic
      if (typeof data[topic]["id"] === "number") {
        await Topic.update(
          { title: data[topic]["title"], conferenceId: conferenceId },
          { where: { id: data[topic]["id"] } }
        );
      } else if (data[topic]["title"].length > 0) {
        // If topic does not have an ID, add new topic into Topics table
        const newTopic = await Topic.create({
          title: data[topic]["title"],
          conferenceId: conferenceId,
        });
        const topicId = newTopic.dataValues.id;
        newTopics.push({ speakerId: speakerId, topicId: topicId });
      }
    }
    // Add newly created topics into topicSpeakers table
    await TopicSpeaker.bulkCreate(newTopics);

    return res.status(200).json("updated");
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  addOrUpdateTopic,
  getTopicsForAddingToSession,
};
