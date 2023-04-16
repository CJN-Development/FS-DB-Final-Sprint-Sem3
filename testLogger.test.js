const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const logEvents = require("./logevents");
global.DEBUG = false;
describe("logEvents function", () => {
  it("writes log item to file", async () => {
    const event = "test-event";
    const level = "info";
    const message = "test-message";
    await logEvents(event, level, message);
    const fileName = `${format(new Date(), "yyyyMMdd")}_events.log`;
    const logFilePath = path.join(__dirname, "logs", fileName);
    const fileContent = await fsPromises.readFile(logFilePath, "utf8");
    expect(fileContent).toMatch(new RegExp(`${event}\t${message}\t.*`));
  });
});
