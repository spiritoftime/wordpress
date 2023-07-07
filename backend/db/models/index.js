"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/database.js")[env];
const db = {};
let sequelize;
if (env === "production" && config.use_env_variable) {
  // If use_env_variable is specified in config, use it to get the connection string
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    define: {
      // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
      // This was true by default, but now is false by default
      timestamps: false,
    },
    dialect: "postgres", // Specify the dialect explicitly
  });
} else {
  // Fall back to separate environment variables in development
  sequelize = new Sequelize(config.database, config.username, config.password, {
    define: {
      // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
      // This was true by default, but now is false by default
      timestamps: false,
    },
    dialect: "postgres", // Specify the dialect explicitly
    ...config, // Include other configuration options
  });
}
const initConference = require("./conferences");
const initConferenceSpeaker = require("./conference_speakers");
const initRole = require("./roles");
const initRoom = require("./rooms");
const initSessionSpeaker = require("./session_speakers");
const initSessionSpeakerRole = require("./session_speaker_roles");
const initSession = require("./sessions");
const initSpeaker = require("./speakers");
const initTopicSpeaker = require("./topic_speakers");
const initTopic = require("./topics");

db.Conference = initConference(sequelize);
db.ConferenceSpeaker = initConferenceSpeaker(sequelize);
db.Role = initRole(sequelize);
db.Room = initRoom(sequelize);
db.SessionSpeaker = initSessionSpeaker(sequelize);
db.SessionSpeakerRole = initSessionSpeakerRole(sequelize);
db.Session = initSession(sequelize);
db.Speaker = initSpeaker(sequelize);
db.TopicSpeaker = initTopicSpeaker(sequelize);
db.Topic = initTopic(sequelize);
// ONE TO MANY
// one conference can have many sessions
db.Conference.hasMany(db.Session);

db.Session.belongsTo(db.Conference);
// one conference can have many rooms
db.Conference.hasMany(db.Room);
db.Room.belongsTo(db.Conference);
// one room can have many sessions, but one session can only have one room
db.Room.hasMany(db.Session);
db.Session.belongsTo(db.Room);
// one session can have many topics, but one topic can only have one session
db.Session.hasMany(db.Topic);
db.Topic.belongsTo(db.Session);

// MANY TO MANY

// one session can have many speakers, and one speaker can be in many sessions.
db.Speaker.belongsToMany(db.Session, {
  through: db.SessionSpeaker,
});
db.Session.belongsToMany(db.Speaker, {
  through: db.SessionSpeaker,
});

// one session speaker can have many roles, and one role can have many session speakers
db.SessionSpeaker.belongsToMany(db.SessionSpeakerRole, {
  through: db.SessionSpeakerRole,
});
db.SessionSpeakerRole.belongsToMany(db.SessionSpeaker, {
  through: db.SessionSpeakerRole,
});

// one speaker can have many topics, and one topic can have many speakers
db.Speaker.belongsToMany(db.Topic, {
  through: db.TopicSpeaker,
});
db.Topic.belongsToMany(db.Session, {
  through: db.TopicSpeaker,
});

// one conference can have many speakers, one speaker can have many conferences
db.Speaker.belongsToMany(db.Conference, {
  through: db.ConferenceSpeaker,
});
db.Conference.belongsToMany(db.Speaker, {
  through: db.ConferenceSpeaker,
});
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.slice(-3) === ".js" &&
//       file.indexOf(".test.js") === -1
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
