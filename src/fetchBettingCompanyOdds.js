const puppeteer = require("puppeteer");

const { bettingCompanies } = require("./betting-companies");

const getBettingCompaniesOdds = () => {
  const odds = bettingCompanies.reduce(async (acc, curr) => {
    const { name, url, bettingRowRegExp, oddsRegExp, teamsRegExp, queryRow } =
      curr;
    console.log(`-------- Getting odds from ${name} --------`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForFunction(
      'document.querySelector("body").innerText.includes("Malmö")'
    );
    await page.screenshot({ path: "page.png", fullPage: true });

    const rows = await page.$$(queryRow);

    let result = [];
    for (let t of rows) {
      const data = await t.evaluate((x) => x.textContent);
      const isBettingRow = bettingRowRegExp.test(data);
      if (isBettingRow) {
        const [homeTeamWin, draw, awayTeamWin] = data.match(oddsRegExp);
        const [homeTeam, awayTeam] = data.match(teamsRegExp);
        result.push({
          bettingCompany: name,
          homeTeam,
          awayTeam,
          homeTeamWin: Number(homeTeamWin.replace(",", ".")),
          draw: Number(draw.replace(",", ".")),
          awayTeamWin: Number(awayTeamWin.replace(",", ".")),
        });
      }
    }

    return [...acc, ...result];
  }, []);

  return odds;
};

const fetchBettingCompanyOdds = async () => {
  console.log(`-------- Fetch betting companies odds --------`);

  const results = await getBettingCompaniesOdds();
  return results;
};

fetchBettingCompanyOdds();

module.exports = {
  fetchBettingCompanyOdds,
};
