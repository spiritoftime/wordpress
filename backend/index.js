require("dotenv").config();

const express = require("express");

const cors = require("cors");

const { auth } = require("express-oauth2-jwt-bearer");

const conferenceRouter = require("./routes/ConferenceRouter");
const sepakerRouter = require("./routes/SpeakerRouter");

const app = express();

app.use(express.json());

const checkJwt = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.BASEURL,
});

app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(checkJwt);

app.use("/conferences", conferenceRouter);
app.use("/speakers", sepakerRouter);

const port =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_PORT
    : process.env.PORT;

app.listen(port, () => console.log(`server running on port ${port}`));
