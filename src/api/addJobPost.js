const { google } = require("googleapis");
require("dotenv").config();
// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_KEY);

const addJobPost = async ({
  titleText,
  descriptionText,
  url,
  company,
  lastUpdated,
}) => {
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

    const newData = [[company, lastUpdated, titleText, descriptionText, url]];

    const range = "A1:E1";
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: newData,
      },
    });

    // resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: "joel@buhrmansolutions.com",
    //   subject: "Added new job post",
    //   html: `<p>Just added <strong>${titleText}</strong> from <strong>${company}</strong>!</p>`,
    // });

    return { success: true };
  } catch (e) {
    console.error("ERROR: ", e);
    return { success: false, error: e };
  }
};

module.exports = {
  addJobPost,
};
