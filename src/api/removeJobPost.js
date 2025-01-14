const { google } = require("googleapis");
require("dotenv").config();
const { getExistingJobPosts } = require("./getExistingJobPosts");
// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_KEY);

const removeJobPost = async (indexesToRemove) => {
  try {
    getExistingJobPosts().then(async (existingJobPosts) => {
      console.log(`-------- Removing indexes: ${indexesToRemove} --------`);

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

      const newData = existingJobPosts
        .filter((_post, index) => !indexesToRemove.includes(index))
        .concat(new Array(indexesToRemove.length).fill(new Array(5).fill("")));

      // console.log(
      //   `-------- Removing: --------\n${indexesToRemove.map(
      //     (i) => existingJobPosts[i][2] + "\n"
      //   )} \n------------------------`
      // );
      const range = `A1:E${existingJobPosts.length}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: newData,
        },
      });

      return { success: true };
    });
  } catch (e) {
    console.error("ERROR: ", e);
    return { success: false, error: e };
  }
};

module.exports = {
  removeJobPost,
};
