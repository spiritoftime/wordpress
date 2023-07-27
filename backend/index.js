require("dotenv").config();
const path = require("path");
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");

const express = require("express");

const cors = require("cors");

const { auth } = require("express-oauth2-jwt-bearer");

const conferenceRouter = require("./routes/ConferenceRouter");
const speakerRouter = require("./routes/SpeakerRouter");
const topicRouter = require("./routes/TopicRouter");
const sessionRouter = require("./routes/SessionRouter");
const roomRouter = require("./routes/RoomRouter");

const app = express();

app.use(express.json());

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.BASEURL,
  tokenSigningAlg: "RS256",
});

app.use(express.static(buildPath));
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html"), // route it to wherever your build index.html is at
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.use(
  cors({
    origin: "*",
    // origin: ["http://127.0.0.1:5173"],
    credentials: true,
  })
);

// app.use(cors());

app.use(checkJwt);

app.use("/api/conferences", conferenceRouter);
app.use("/api/speakers", speakerRouter);
app.use("/api/topics", topicRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/rooms", roomRouter);

const port =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT
    : process.env.PORT;

app.listen(port, () => console.log(`server running on port ${port}`));
