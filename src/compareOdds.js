const { fetchBettingCompanyOdds } = require("./fetchBettingCompanyOdds");
const { getTableStats } = require("./api/getTableData");
const { updateTableData } = require("./updateTableData");

const ODDS_TOTAL = 9.7625;
const HIGH_ODDS_THRESHOLD = 1.5;

const normalizeName = (name) => {
  switch (name) {
    case "BK Häcken":
      return "BK Häcken";
    case "IF Brommapojkarna":
      return "IF Brommapojkarna";
    case "Malmö FF":
      return "Malmö FF";
    case "Djurgårdens IF":
      return "Djurgården";
    case "Halmstads BK":
      return "Halmstad";
    case "Hammarby IF":
      return "Hammarby";
    case "IFK Norrköping":
      return "IFK Norrköping FK";
    case "Östers IF":
    case "Degerfors IF":
      return "Halmstad"; // TODO REMOVE
  }
  return name;
};

const calculateOurOdds = (game, tableData) => {
  const { homeTeam, awayTeam } = game;
  const homeTeamNameNormalized = normalizeName(homeTeam);
  const awayTeamNameNormalized = normalizeName(awayTeam);
  const homeTeamData = tableData[homeTeamNameNormalized];
  const awayTeamData = tableData[awayTeamNameNormalized];

  const oddsForHomeWin =
    homeTeamData.homeTeam + homeTeamData[awayTeamNameNormalized];
  const oddsForAwayWin =
    awayTeamData.awayTeamGrass + awayTeamData[homeTeamNameNormalized];
  const oddsForDraw =
    1 -
    Math.abs(oddsForHomeWin, oddsForAwayWin) *
      ((homeTeamData.probOfDraw + awayTeamData.probOfDraw) / 2);

  return {
    home:
      ODDS_TOTAL *
      ((oddsForAwayWin + oddsForDraw) /
        2 /
        (oddsForHomeWin + oddsForAwayWin + oddsForDraw)),
    draw:
      ODDS_TOTAL *
      ((oddsForAwayWin + oddsForHomeWin) /
        2 /
        (oddsForHomeWin + oddsForAwayWin + oddsForDraw)),
    away:
      ODDS_TOTAL *
      ((oddsForHomeWin + oddsForDraw) /
        2 /
        (oddsForHomeWin + oddsForAwayWin + oddsForDraw)),
  };
};

const compareOdds = async () => {
  const bettingCompanyOdds = await fetchBettingCompanyOdds();
  const tableData = await getTableStats();

  bettingCompanyOdds.forEach((game) => {
    const ourOdds = calculateOurOdds(game, tableData);
    const highOddsForHomeTeam =
      game.homeTeamWin - ourOdds.home > HIGH_ODDS_THRESHOLD;
    const highOddsForAwayTeam =
      game.awayTeamWin - ourOdds.away > HIGH_ODDS_THRESHOLD;
    const highOddsForDraw = game.draw - ourOdds.draw > HIGH_ODDS_THRESHOLD;
    if (highOddsForHomeTeam || highOddsForAwayTeam || highOddsForDraw) {
      const ODDS_TYPE = highOddsForHomeTeam
        ? "home win"
        : highOddsForAwayTeam
        ? "away win"
        : "draw";
      console.log(
        `Good betting opportunity for ${ODDS_TYPE} in: `,
        game.homeTeam,
        game.awayTeam,
        {
          theirOdds: {
            home: game.homeTeamWin,
            draw: game.draw,
            away: game.awayTeamWin,
          },
          ourOdds,
        }
      );
    }
  });
};

compareOdds();
