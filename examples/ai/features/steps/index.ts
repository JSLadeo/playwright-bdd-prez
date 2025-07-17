import { expect, Page } from '@playwright/test';
import { Given, When, Then } from './fixtures';

type StepWorld = {
  page: Page;
};

Given('I am on home page', async ({ page }: StepWorld) => {
  await page.goto('https://playwright.dev');
});

When('I click link {string}', async ({ page }: StepWorld, name: string) => {
  await page.getByRole('link', { name }).click();
});

Then('I see header {string}', async ({ page }: StepWorld, text: string) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(text);
});

Given('I am on Amazon homepage', async ({ page }: StepWorld) => {
  await page.goto('https://www.amazon.com');
});

When('I search for {string}', async ({ page }: StepWorld, searchTerm: string) => {
  await page.getByRole('textbox', { name: 'Search Amazon' }).fill(searchTerm);
  await page.getByRole('button', { name: 'Go' }).click();
});

When('I click on product {string}', async ({ page }: StepWorld, productName: string) => {
  await page.getByRole('link', { name: new RegExp(productName, 'i') }).first().click();
});

When('I click {string} button', async ({ page }: StepWorld, buttonName: string) => {
  await page.getByRole('button', { name: buttonName, exact: true }).click();
});

Then('I should see item added to cart confirmation', async ({ page }: StepWorld) => {
  await expect(page.getByText('Added to cart')).toBeVisible();
});

Then('cart count should be {string}', async ({ page }: StepWorld, count: string) => {
  await expect(page.locator('#nav-cart-count')).toHaveText(count);
});

Then('cart subtotal should be {string}', async ({ page }: StepWorld, amount: string) => {
  await expect(page.getByText(`Cart Subtotal: ${amount}`)).toBeVisible();
});
