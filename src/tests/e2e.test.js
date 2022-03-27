import puppeteer from 'puppeteer'

const isHeadless = false;
const BASE_URL = "http://localhost:5000"

const email = "somebody@example.com";
const password = "somebody'sPassword123";

let browser
let page

jest.setTimeout(30000);
beforeAll(async () => {
    if (process.env.CI)
        browser = await puppeteer.launch({ headless: true,
            args: [`--no-sandbox`, `--disable-setuid-sandbox`]
        });
    else
        browser = await puppeteer.launch({ headless: isHeadless, slowMo: 20 });
    page = await browser.newPage();

    // Make sure the auth emulator is running
    await page.goto(BASE_URL);
    await page.waitForSelector(".firebase-emulator-warning");
    if (process.env.CI) // screenshot if on CI server
        await page.screenshot({path: "./screenshot.png"});
    const warningText = await getText(".firebase-emulator-warning");
    expect(warningText).toMatch("Running in emulator mode. Do not use with production credentials.");
});
afterAll(async () => {
    browser.close();
    jest.setTimeout(5000);
});

// ---  HELPER FUNCTIONS ---

const getText = async (selector) => {
    const text = await page.$eval(selector, (e) => e.textContent);
    return text;
};

function wait(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
};

const signOut = async () => { await page.click(".navbar-main > a:nth-child(5)"); };

// --- TESTS BELOW THIS POINT ---

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


describe('Account Creation', () => {
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
        await signOut();
        await page.waitForSelector(".MuiTypography-root");
        const text = await getText(".MuiTypography-root");
        expect(text).toContain("Sign in");
    });

});



describe('Login / Dashboard', () => {
    beforeAll(async () => {
        await signOut();
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

    it("can generate a play ticket", async () => {
        let emailInput = "customer@example.com";
        let memoInput = "e2e test";
        
        await page.waitForSelector("a.MuiButtonBase-root:nth-child(4)");
        const text = await getText("a.MuiButtonBase-root:nth-child(4)");
        expect(text).toMatch("Tickets");

        // Open the tickets tab
        await wait(3000);
        await page.click("a.MuiButtonBase-root:nth-child(4)");

        // Enter an email
        await page.click("#email");
        await page.type("#email", emailInput);

        // Enter a memo
        await page.click("#memo");
        await page.type("#memo", memoInput);

        // Click the submit button
        await page.click(".MuiButton-root");

        // Wait for the snackbar pop-up to verify ticket creation
        await page.waitForSelector(".MuiSnackbarContent-message");

        // Verify the email on the table entry
        await page.waitForSelector("div.MuiDataGrid-row:nth-child(1) > div:nth-child(2)");
        const emailCell = await getText("div.MuiDataGrid-row:nth-child(1) > div:nth-child(2)");

        // Verify the memo on the table entry
        await page.waitForSelector("div.MuiDataGrid-row:nth-child(1) > div:nth-child(5)");
        const memoCell = await getText("div.MuiDataGrid-row:nth-child(1) > div:nth-child(5)");

        expect(emailCell).toMatch(emailInput);
        expect(memoCell).toMatch(memoInput);
    });

});


describe("Google Auth", () => {
    beforeAll(async () => {
        await signOut();
        await page.click("#root > header:nth-child(2) > div:nth-child(1) > a:nth-child(3)");

        // Login checks from above
        expect(page.url()).toMatch(BASE_URL + "/login"); // should have '/login' in the url
        await page.waitForSelector(".MuiTypography-root");
        const text = await getText(".MuiTypography-root");
        expect(text).toContain("Sign in"); // sign in header is displayed
    });

    it("can log in through google", async () => {
        const newPagePromise = new Promise(x => page.once('popup', x));

        // click the google sign-in button
        await page.click("button.MuiButton-root:nth-child(3)");

        // grab and verify the popup window
        const popup = await newPagePromise;
        await popup.waitForSelector("#title > span:nth-child(1)");
        let text = await popup.$eval("#title > span:nth-child(1)", (e) => e.textContent);
        expect(text).toContain("Sign-in with");

        // add a dummy account
        await popup.click("button.mdc-button--outlined:nth-child(1) > div:nth-child(1)"); // "add account"
        await popup.click("#autogen-button > div:nth-child(1)"); // "auto generate user info"
        await popup.click("#sign-in"); // "sign-in with google.com"

        // dashboard (header should be visible)
        await page.waitForSelector(".dashboard-header");
        text = await getText(".dashboard-header");
        expect(text.toLowerCase()).toMatch("dashboard");
    });

    it("can generate a play ticket", async () => {
        let emailInput = "customergoogle@example.com";
        let memoInput = "e2e test";

        await page.waitForSelector("a.MuiButtonBase-root:nth-child(4)");
        let text = await getText("a.MuiButtonBase-root:nth-child(4)");
        expect(text).toMatch("Tickets");

        // Open the tickets tab
        await wait(3000);
        await page.click("a.MuiButtonBase-root:nth-child(4)");

        // Enter an email
        await page.click("#email");
        await page.type("#email", emailInput);

        // Enter a memo
        await page.click("#memo");
        await page.type("#memo", memoInput);

        // Click the submit button
        await page.click(".MuiButton-root");

        // Wait for the snackbar pop-up to verify ticket creation
        await page.waitForSelector(".MuiSnackbarContent-message");

        // Verify the email on the table entry
        await page.waitForSelector("div.MuiDataGrid-row:nth-child(1) > div:nth-child(2)");
        const emailCell = await getText("div.MuiDataGrid-row:nth-child(1) > div:nth-child(2)");

        // Verify the memo on the table entry
        await page.waitForSelector("div.MuiDataGrid-row:nth-child(1) > div:nth-child(5)");
        const memoCell = await getText("div.MuiDataGrid-row:nth-child(1) > div:nth-child(5)");

        expect(emailCell).toMatch(emailInput);
        expect(memoCell).toMatch(memoInput);
    });

});