import puppeteer from 'puppeteer'

const isHeadless = true;
const BASE_URL = "http://localhost:5000"

const email = "somebody@example.com";
const password = "somebody'sPassword123";

let browser
let page

jest.setTimeout(60000);
beforeAll(async () => {
    if (process.env.CI)
        browser = await puppeteer.launch({
            headless: true,
            args: [`--no-sandbox`, `--disable-setuid-sandbox`]
        });
    else
        browser = await puppeteer.launch({ headless: isHeadless });
    page = await browser.newPage();
    
    // Make sure the auth emulator is running
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.waitForSelector(".firebase-emulator-warning");
    if (process.env.CI)
        await page.screenshot({path: "./screenshot.png"});
    const warningText = await getText(".firebase-emulator-warning");
    expect(warningText).toMatch("Running in emulator mode. Do not use with production credentials.");
});
afterAll(async () => {
    browser.close();
});

const getText = async (selector) => {
    const text = await page.$eval(selector, (e) => e.textContent);
    return text;
}


test('Puppeteer is functional', async () => {
    // See if we can connect to example.com
    await page.goto("https://example.com");
    await page.waitForSelector("body > div:nth-child(1) > h1:nth-child(1)");
    const text = await getText("body > div:nth-child(1) > h1:nth-child(1)");
    expect(text).toContain("Example Domain");
});


describe('Home Page', () => {
    
    beforeAll(async () => {
        await page.goto(BASE_URL);
    });

    it('should have the "Welcome" text', async () => {
        await page.waitForSelector("h2.MuiTypography-root");
        const text = await getText("h2.MuiTypography-root");
        expect(text).toContain("Welcome");
    });
    
});


describe('Account Creation Page', () => {
    beforeAll(async () => {
        await page.goto(BASE_URL);
        await page.waitForSelector("#root > header:nth-child(2) > div:nth-child(1) > a:nth-child(4)");
        await page.click("#root > header:nth-child(2) > div:nth-child(1) > a:nth-child(4)");
    });

    it("has \"/signup\" appended to the url", async () => {
        expect(page.url()).toMatch(BASE_URL + "/signup");
    });

    it("should contain the header", async () => {
        await page.waitForSelector(".MuiTypography-root");
        const text = await getText(".MuiTypography-root");
        expect(text).toContain("Account Creation");
    });

    it("redirects to the dashboard after creating a new account", async () => {
        await page.waitForSelector(".MuiBox-root");

        // email
        await page.click("#email");
        await page.type("#email", email);

        // password
        await page.click("#password");
        await page.type("#password", password);

        // submit button
        await page.click("button.MuiButton-root:nth-child(4)");

        // dashboard (header should be visible)
        await page.waitForSelector(".dashboard-header");
        const text = await getText(".dashboard-header");
        expect(text.toLowerCase()).toMatch("dashboard");
    });

    it("can sign out", async () => {
        await page.click("#root > header:nth-child(2) > button:nth-child(2)");
        await page.waitForSelector(".MuiTypography-root");
        const text = await getText(".MuiTypography-root");
        expect(text).toContain("Sign in");
    });

});



describe('Login / Dashboard', () => {
    beforeAll(async () => {
        await page.click("#root > header:nth-child(2) > div:nth-child(1) > a:nth-child(3)");
    });

    it("has \"/login\" appended to the url", async () => {
        expect(page.url()).toMatch(BASE_URL + "/login");
    });

    it("should contain the header", async () => {
        await page.waitForSelector(".MuiTypography-root");
        const text = await getText(".MuiTypography-root");
        expect(text).toContain("Sign in");
    });

    it("can log into the dashboard", async () => {
        await page.waitForSelector(".MuiBox-root");

        // email
        await page.click("#email");
        await page.type("#email", email);

        // password
        await page.click("#password");
        await page.type("#password", password);

        // submit button
        await page.click("button.MuiButton-root:nth-child(4)");

        // dashboard (header should be visible)
        await page.waitForSelector(".dashboard-header");
        const text = await getText(".dashboard-header");
        expect(text.toLowerCase()).toMatch("dashboard");
    });

});