const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const client_secret = process.env.CLIENT_SECRET;
const client_id = process.env.CLIENT_ID;
const redirect_uris = process.env.REDIRECT_URI;
const SECRET_KEY = process.env.SECRET_KEY;
dotenv.config();
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris
);

function listEvents(auth) {
  return new Promise((resolve, reject) => {
    const calendar = google.calendar({ version: "v3", auth });
    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: "startTime",
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        const events = res.data.items;
        if (events.length) {
          resolve(events);
        } else {
          console.log("No upcoming events found.");
          resolve({});
        }
      }
    );
  });
}

const getEvent = async (req, res) => {
  const token = req.cookies.calendarCookie;
  if (!token) res.status(401).json({ message: "no cookie in request" });
  decodedData = jwt.decode(token);

  oAuth2Client.setCredentials(decodedData.token);
  const events = await listEvents(oAuth2Client);

  res.json(events);
};

const decodeAndFetch = async (req, res) => {
  const token = req?.body;
  if (!token) return res.status(401).json({ message: "no code in request" });

  oAuth2Client.setCredentials(token);

  const events = await listEvents(oAuth2Client);
  const jwtToken = jwt.sign({ token }, SECRET_KEY, { expiresIn: "1h" });
  return res.status(200).json({ jwtToken, events });
};
module.exports = {
  getEvent,
  decodeAndFetch,
};
