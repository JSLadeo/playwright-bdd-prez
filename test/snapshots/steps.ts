import { expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('I am on example.com', async ({ page }) => {
  // await page.goto(pathToFileURL('example.html').toString());
  await page.goto('https://www.google.fr');
});

Then('snapshot contains text {string}', async ({}, text: string) => {
  expect(text).toMatchSnapshot('title.txt');
});

Then('screenshot matches previous one', async ({ page }) => {
  //Activer le clique sur cookie  "Accepter tout" pour montrer que la verification de l'image marche fonctionne
  // await page.getByRole('button', { name: 'Tout accepter' }).click();
  await expect(page).toHaveScreenshot({
    maxDiffPixelRatio: 0.02,
  });
});
