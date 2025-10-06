const { google } = require("googleapis");
require("dotenv").config();

const updateSheetsStatistics = async (statistics) => {
  try {
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

    const sheetsFormattedData = Object.keys(statistics).reduce(
      (prev, curr) => [
        ...prev,
        [
          `team:${curr}`,
          ...Object.keys(statistics[curr]).map(
            (key) => `${key}:${statistics[curr][key]}`
          ),
        ],
      ],
      []
    );

    const range = "A1:V16";
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: sheetsFormattedData,
      },
    });

    return { success: true };
  } catch (e) {
    console.error("ERROR: ", e);
    return { success: false, error: e };
  }
};

module.exports = {
  updateSheetsStatistics,
};
