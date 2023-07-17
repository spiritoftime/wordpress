require("dotenv").config();

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

app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
    credentials: true,
  })
);

// app.use(cors());

app.use(checkJwt);

app.use("/conferences", conferenceRouter);
app.use("/speakers", speakerRouter);
app.use("/topics", topicRouter);
app.use("/sessions", sessionRouter);
app.use("/rooms", roomRouter);

const port =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT
    : process.env.PORT;

app.listen(port, () => console.log(`server running on port ${port}`));
