const { fetchBettingCompanyOdds } = require("./fetchBettingCompanyOdds");
const { updateTableData } = require("./updateTableData");

const ODDS_TOTAL = 9.7625;

const calculateOurOdds = (game, tableData) => {
  const { homeTeam, awayTeam } = game;
  const homeTeamData = tableData[homeTeam];
  const awayTeamData = tableData[awayTeam];

  const oddsForHomeWin = homeTeamData.homeTeam + homeTeamData[awayTeam];
  const oddsForAwayWin = awayTeamData.awayTeamGrass + awayTeamData[homeTeam];
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
  const tableData = await updateTableData();

  const firstGame = bettingCompanyOdds[2];
  const ourOdds = calculateOurOdds(firstGame, tableData);
  console.log({
    firstGame: {
      home: firstGame.homeTeamWin,
      draw: firstGame.draw,
      away: firstGame.awayTeamWin,
    },
    ourOdds,
  });
};

compareOdds();
