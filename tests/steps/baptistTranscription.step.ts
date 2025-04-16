import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { BaptistTranscription } from '../pages/BaptistTranscription'
import { testData } from "../test_data/properties.json";
import * as dotenv from 'dotenv';
dotenv.config();


Given('I open the baptist login page', async function (this: CustomWorld) {
  this.baptistPage = new BaptistTranscription(this);
  await this.baptistPage.gotoLogin();
});

When('I enter {string} and {string}', async function (this: CustomWorld, username: string, password: string) {
    await this.baptistPage.login(testData.USERNAME, testData.PASSWORD);
  });
  

Then('I should see the homepage', async function (this: CustomWorld) {
  const homepageVisible = await this.baptistPage.isHomepageVisible();
  expect(homepageVisible).toBeTruthy();
});

Then('I click on the chatbot', async function (this: CustomWorld) {
  await this.baptistPage.openChatbot();
});

Then('I click on the mic icon', async function (this: CustomWorld) {
  await this.baptistPage.clickMic();
});

Then('I speak {string}', async function (this: CustomWorld, speechText: string) {
  await this.baptistPage.simulateSpeech(speechText);
});

Then('I should see {string} in the input bar', async function (this: CustomWorld, expectedText: string) {
  await this.baptistPage.verifyTranscription(expectedText)
});
