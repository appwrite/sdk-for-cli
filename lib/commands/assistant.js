const fs = require('fs');
const pathLib = require('path');
const tar = require("tar");
const ignore = require("ignore");
const { promisify } = require('util');
const libClient = require('../client.js');
const { getAllFiles } = require('../utils.js');
const { Command } = require('commander');
const { sdkForProject, sdkForConsole } = require('../sdks')
const { parse, actionRunner, parseInteger, parseBool, commandDescriptions, success, log } = require('../parser')
const { localConfig, globalConfig } = require("../config");
const { File } = require('undici');
const { ReadableStream } = require('stream/web');

/**
 * @param {fs.ReadStream} readStream
 * @returns {ReadableStream}
 */
function convertReadStreamToReadableStream(readStream) {
  return new ReadableStream({
    start(controller) {
      readStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      readStream.on("end", () => {
        controller.close();
      });
      readStream.on("error", (err) => {
        controller.error(err);
      });
    },
    cancel() {
      readStream.destroy();
    },
  });
}

const assistant = new Command("assistant").description(commandDescriptions['assistant']).configureHelp({
    helpWidth: process.stdout.columns || 80
})

/**
 * @typedef {Object} AssistantChatRequestParams
 * @property {string} prompt Prompt. A string containing questions asked to the AI assistant.
 * @property {boolean} parseOutput
 * @property {libClient | undefined} sdk
 */

/**
 * @param {AssistantChatRequestParams} params
 */
const assistantChat = async ({ prompt, parseOutput = true, sdk = undefined}) => {
    let client = !sdk ? await sdkForProject() : sdk;
    let apiPath = '/console/assistant';
    let payload = {};
    if (typeof prompt !== 'undefined') {
        payload['prompt'] = prompt;
    }

    let response = undefined;

    response = await client.call('post', apiPath, {
        'content-type': 'application/json',
    }, payload);

    if (parseOutput) {
        parse(response)
        success()
    }
    
    return response;
}

assistant
    .command(`chat`)
    .description(``)
    .requiredOption(`--prompt <prompt>`, `Prompt. A string containing questions asked to the AI assistant.`)
    .action(actionRunner(assistantChat))

module.exports = {
    assistant,
    assistantChat
};