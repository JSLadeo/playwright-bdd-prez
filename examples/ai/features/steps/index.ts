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

  // Fermer le dialog "International Shopping Transition Alert" s'il apparaît
  try {
    const dismissButton = page.getByRole('button', { name: 'Dismiss' });
    await dismissButton.waitFor({ timeout: 3000 });
    await dismissButton.click();
  } catch {
    // Dialog non présent, continuer normalement
  }
});

When('I search for {string}', async ({ page }: StepWorld, searchTerm: string) => {
  // Attendre que la page soit complètement chargée
  // await page.waitForLoadState('networkidle');

  // Localiser le champ de recherche de manière plus robuste
  const searchBox = page.locator('#twotabsearchtextbox');
  await searchBox.waitFor({ state: 'visible' });
  await searchBox.clear();
  await searchBox.fill(searchTerm);

  // Cliquer sur le bouton de recherche spécifique
  await page.locator('#nav-search-submit-button').click();

  // Attendre que les résultats se chargent
  // await page.waitForLoadState('networkidle');
});

When('I click on product {string}', async ({ page }: StepWorld, productName: string) => {
  // Attendre que les résultats de recherche se chargent
  await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });

  // Chercher le lien du produit qui contient le nom spécifié
  const productLink = page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
  await productLink.waitFor({ state: 'visible' });
  await productLink.click();

  // Attendre que la page produit se charge
  // await page.waitForLoadState('networkidle');
});

When('I click {string} button', async ({ page }: StepWorld, buttonName: string) => {
  // Attendre que le bouton soit visible et cliquable
  const button = page.getByRole('button', { name: buttonName, exact: true }).first();
  await button.waitFor({ state: 'visible' });
  await button.click();

  // Attendre que l'action se termine
  // await page.waitForLoadState('networkidle');
});

Then('I should see item added to cart confirmation', async ({ page }: StepWorld) => {
  await expect(page.getByText('Added to cart').first()).toBeVisible();
});

Then('cart count should be {string}', async ({ page }: StepWorld, count: string) => {
  await expect(page.locator('#nav-cart-count').first()).toHaveText(count);
});

Then('cart subtotal should be {string}', async ({ page }: StepWorld, amount: string) => {
  await expect(page.getByText(`Cart Subtotal: ${amount}`).first()).toBeVisible();
});
