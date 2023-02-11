const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const createTemplate = (templateName, replacements) => {
    const filePath = path.join(__dirname, `./template/${templateName}.html`);
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const htmlToSend = template(replacements);
    return htmlToSend;
};

module.exports = {createTemplate};
