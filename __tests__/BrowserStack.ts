import wd, { asserters } from "wd";

describe("BrowserStack", () => {
  jest.setTimeout(24 * 60 * 60 * 1000);

  let driver = null;

  beforeAll(async () => {
    const desiredCaps = {
      // Set your BrowserStack access credentials
      "browserstack.user": process.env.BROWSERSTACK_USER,
      "browserstack.key": process.env.BROWSERSTACK_KEY,
      // Set URL of the application under test
      app: process.env.BROWSERSTACK_APP,
      // Specify device and os_version for testing
      device: "Google Pixel 3",
      os_version: "9.0",
      // Set other BrowserStack capabilities
      project: "First NodeJS project",
      build: "Node Android",
      name: "first_test",
    };
    driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");
    await driver.init(desiredCaps);
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("runs", async () => {
    const clickElement = async (text: string) => {
      const element = await driver.waitForElementByXPath(
        `//android.widget.TextView[@text='${text}']`,
        asserters.isDisplayed && asserters.isEnabled,
        1000
      );

      await element.click();
      return element;
    };

    const inputText = async (key: string, text: string) => {
      const element = await driver.waitForElementByXPath(
        `//android.widget.EditText[@text='${key}']`,
        asserters.isDisplayed && asserters.isEnabled,
        5000
      );
      await element.sendKeys(text);
    };

    await clickElement("Fortsätt");
    await clickElement("Fortsätt");
    await clickElement("Logga in");
    await clickElement("Fler alternativ");
    await inputText("ååååmmddxxxx", "198602282389");

    await new Promise((resolve) => setTimeout(resolve, 15000));

    expect(true).toBe(true);
  });
});
