const puppeteer = require("puppeteer");
const { updateSheetsStatistics } = require("./api/updateSheetsStatistics");

const { results, GRASS_TEAMS } = require("./teams");

const createResultsData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log(`-------- Create results data for 2024 --------`);

  const resultsPage = results[2024]; // hard code to 2024 for now

  await page.goto(resultsPage);
  await page.setViewport({ width: 1080, height: 1024 });

  await page.waitForSelector("table", {
    visible: true,
    timeout: 5000,
  });

  const titleNode = await page.$$("tr");

  let result = [];
  for (let t of titleNode) {
    const data = await t.evaluate((x) => {
      const teams = new RegExp(/(.* - .*(\n)?)/)
        .exec(x.textContent)?.[0]
        .trim()
        .split("-");
      const result = new RegExp(/(\d{1,2} - \d{1,2})/)
        .exec(x.textContent)?.[0]
        .trim()
        .split("-");

      return teams && result
        ? {
            home: teams?.[0].trim(),
            away: teams?.[1].trim(),
            homeScore: Number(result?.[0]),
            awayScore: Number(result?.[1]),
          }
        : undefined;
    });
    if (data) {
      result.push(data);
    }
  }
  await browser.close();

  return result.toReversed(); // To have round 1 first etc
};

const fixResults = (resultRows) =>
  resultRows.map(({ home, away, homeScore, awayScore }) => ({
    home: home === "IF Elfborg" ? "IF Elfsborg" : home,
    away: away === "IF Elfborg" ? "IF Elfsborg" : away,
    homeScore,
    awayScore,
  }));

const flattenStatistics = (statistics) =>
  Object.keys(statistics).reduce((acc, curr) => {
    const currStat = statistics[curr];

    return {
      ...acc,
      [curr]: {
        homeTeam: +(
          (currStat.homeGames.wins * 3 + currStat.homeGames.draws * 1) /
          (15 * 3)
        ).toFixed(2),
        awayTeamGrass: +(
          (currStat.awayGamesGrass.wins * 3 +
            currStat.awayGamesGrass.draws * 1) /
          (3 *
            (currStat.awayGamesGrass.wins +
              currStat.awayGamesGrass.draws +
              currStat.awayGamesGrass.losses))
        ).toFixed(2),
        awayTeamPlastic: +(
          (currStat.awayGamesPlastic.wins * 3 +
            currStat.awayGamesPlastic.draws * 1) /
          (3 *
            (currStat.awayGamesPlastic.wins +
              currStat.awayGamesPlastic.draws +
              currStat.awayGamesPlastic.losses))
        ).toFixed(2),
        last5Games: +(
          currStat.last5Games.reduce((partialSum, a) => partialSum + a, 0) /
          (currStat.last5Games.length * 3)
        ).toFixed(2),
        probOfDraw: +(currStat.draws / 30).toFixed(2),
        "IF Elfsborg": +(
          currStat["IF Elfsborg"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["IF Elfsborg"]?.length)
        ).toFixed(2),
        "IFK Värnamo": +(
          currStat["IFK Värnamo"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["IFK Värnamo"]?.length)
        ).toFixed(2),
        GAIS: +(
          currStat["GAIS"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["GAIS"]?.length)
        ).toFixed(2),
        "Malmö FF": +(
          currStat["Malmö FF"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["Malmö FF"]?.length)
        ).toFixed(2),
        "IK Sirius FK": +(
          currStat["IK Sirius FK"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["IK Sirius FK"]?.length)
        ).toFixed(2),
        AIK: +(
          currStat["AIK"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["AIK"]?.length)
        ).toFixed(2),
        Halmstad: +(
          currStat["Halmstad"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["Halmstad"]?.length)
        ).toFixed(2),
        Hammarby: +(
          currStat["Hammarby"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["Hammarby"]?.length)
        ).toFixed(2),
        "IF Brommapojkarna": +(
          currStat["IF Brommapojkarna"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["IF Brommapojkarna"]?.length)
        ).toFixed(2),
        "Västerås SK FK": +(
          currStat["Västerås SK FK"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["Västerås SK FK"]?.length)
        ).toFixed(2),
        "Kalmar FF": +(
          currStat["Kalmar FF"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["Kalmar FF"]?.length)
        ).toFixed(2),
        "IFK Norrköping FK": +(
          currStat["IFK Norrköping FK"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["IFK Norrköping FK"]?.length)
        ).toFixed(2),
        "Mjällby AIF": +(
          currStat["Mjällby AIF"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["Mjällby AIF"]?.length)
        ).toFixed(2),
        "IFK Göteborg": +(
          currStat["IFK Göteborg"]?.reduce(
            (partialSum, a) => partialSum + a,
            0
          ) /
          (3 * currStat["IFK Göteborg"]?.length)
        ).toFixed(2),
        Djurgården: +(
          currStat["Djurgården"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["Djurgården"]?.length)
        ).toFixed(2),
        "BK Häcken": +(
          currStat["BK Häcken"]?.reduce((partialSum, a) => partialSum + a, 0) /
          (3 * currStat["BK Häcken"]?.length)
        ).toFixed(2),
      },
    };
  }, {});

const generateStatistics = (resultRows) => {
  console.log(`-------- Generate statistics data --------`);

  const stats = resultRows.reduce((acc, curr) => {
    const { home, away, homeScore, awayScore } = curr;
    const homeGameWin = homeScore > awayScore;
    const awayGameWin = homeScore < awayScore;
    const draw = homeScore === awayScore;

    const isGrassPitch = GRASS_TEAMS.includes(home);

    const awayGameKey = isGrassPitch ? "awayGamesGrass" : "awayGamesPlastic";

    return {
      ...acc,
      [home]: {
        ...acc[home],
        homeGames: {
          wins: (acc[home]?.homeGames?.wins || 0) + (homeGameWin ? 1 : 0),
          losses: (acc[home]?.homeGames?.losses || 0) + (awayGameWin ? 1 : 0),
          draws: (acc[home]?.homeGames?.draws || 0) + (draw ? 1 : 0),
        },
        draws: (acc[home]?.draws || 0) + (draw ? 1 : 0),
        last5Games:
          acc[home]?.last5Games.length === 5
            ? [
                ...acc[home]?.last5Games?.slice(1, 5),
                homeGameWin ? 3 : awayGameWin ? 0 : 1,
              ]
            : [
                ...(acc[home]?.last5Games || []),
                homeGameWin ? 3 : awayGameWin ? 0 : 1,
              ],
        [away]: [
          ...(acc[home]?.[away] || []),
          homeGameWin ? 3 : awayGameWin ? 0 : 1,
        ],
      },
      [away]: {
        ...acc[away],
        [awayGameKey]: {
          wins: (acc[away]?.[awayGameKey]?.wins || 0) + (awayGameWin ? 1 : 0),
          losses:
            (acc[away]?.[awayGameKey]?.losses || 0) + (homeGameWin ? 1 : 0),
          draws: (acc[away]?.[awayGameKey]?.draws || 0) + (draw ? 1 : 0),
        },
        draws: acc[away]?.draws + (draw ? 1 : 0),
        last5Games:
          acc[away]?.last5Games.length === 5
            ? [
                ...acc[away].last5Games?.slice(1, 5),
                homeGameWin ? 0 : awayGameWin ? 3 : 1,
              ]
            : [
                ...(acc[away]?.last5Games || []),
                homeGameWin ? 0 : awayGameWin ? 3 : 1,
              ],
        [home]: [
          ...(acc[away]?.[home] || []),
          homeGameWin ? 0 : awayGameWin ? 3 : 1,
        ],
      },
    };
  }, {});

  return stats;
};

const updateTableStatistics = async () => {
  console.log(`-------- Update table data --------`);

  const results = await createResultsData();
  const fixedResults = fixResults(results);
  const statistics = generateStatistics(fixedResults);
  const flattenedStatistics = flattenStatistics(statistics);
  updateSheetsStatistics(flattenedStatistics);

  return flattenedStatistics;
};

module.exports = {
  updateTableStatistics,
};
