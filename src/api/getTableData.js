const { google } = require("googleapis");
require("dotenv").config();

const getTableStats = async () => {
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
    range: "A1:V16",
  });

  const formattedTableData = data.data.values.reduce(
    (prev, curr) => ({
      ...prev,
      [curr[0].split(":")[1]]: curr.slice(1).reduce(
        (p, c) => ({
          ...p,
          [c.split(":")[0]]: parseFloat(c.split(":")[1]),
        }),
        {}
      ),
    }),
    {}
  );

  return formattedTableData;
};

module.exports = {
  getTableStats,
};
