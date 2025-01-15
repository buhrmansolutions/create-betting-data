const TEAM_MAPPINGS = {
  SVENSKA_SPEL: {
    HÄCKEN: "BK Häcken",
    BP: "IF Brommapojkarna",
    DJURGÅRDEN: "Djurgårdens IF",
    MALMÖ: "Malmö FF",
    GAIS: "GAIS",
    AIK: "AIK",
    HALMSTAD: "Halmstads BK",
    DEGERFORS: "Degerfors IF",
    HAMMARBY: "Hammarby IF",
    GÖTEBORG: "IFK Göteborg",
    ELFSBORG: "IF Elfsborg",
    MJÄLLBY: "Mjällby AIF",
    NORRKÖPING: "IFK Norrköping",
    ÖSTER: "Östers IF",
    VÄRNAMO: "IFK Värnamo",
    SIRIUS: "IK Sirius FK",
  },
};
const SVENSKA_SPEL = {
  name: "Svenska Spel",
  url: "https://spela.svenskaspel.se/odds/sv/sports/fotboll/sverige/allsvenskan",
  queryRow: "a",
  bettingRowRegExp: new RegExp(/\d{1,2},\d{2}\d{1,2},\d{2}\d{1,2},\d{2}/),
  oddsRegExp: new RegExp(/(\d{1,2},\d{2})/g),
  teamsRegExp: new RegExp(
    `(?:${Object.values(TEAM_MAPPINGS.SVENSKA_SPEL)
      .map((name) => name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"))
      .join("|")})`,
    "g"
  ),
};

module.exports = {
  bettingCompanies: [SVENSKA_SPEL],
};
