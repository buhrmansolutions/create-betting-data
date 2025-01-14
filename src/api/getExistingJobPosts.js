const { google } = require("googleapis");
require("dotenv").config();

const getExistingJobPosts = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });
  const sheets = google.sheets({
    auth,
    version: "v4",
  });
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "A1:H1000",
  });

  return data.data.values;
};

module.exports = {
  getExistingJobPosts,
};
