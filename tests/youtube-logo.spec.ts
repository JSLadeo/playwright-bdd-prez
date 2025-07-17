import { test, expect } from '@playwright/test';

test('YouTube logo properties', async ({ page }) => {
  // Go to YouTube and accept cookies if needed
  await page.goto('https://www.youtube.fr');

  // Wait for the logo to be visible
  const logo = page.getByRole('link', { name: 'Accueil YouTube' });
  await logo.waitFor({ state: 'visible' });

  // Verify the logo is a link and not a button
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('role', 'link');

  // Take a screenshot of the logo for visual verification
  await logo.screenshot({ path: 'youtube-logo.png' });

  // Get the logo image element
  const logoImage = logo.locator('img');
  await expect(logoImage).toBeVisible();
});

test('YouTube logo verification 02', async ({ page }) => {
  // Navigate to YouTube France
  await page.goto('https://www.youtube.fr');

  // Locate the YouTube logo
  const logo = await page.locator('#logo-icon');

  // Take a screenshot of the logo for color verification
  await logo.screenshot({ path: 'youtube-logo.png' });

  // Verify the element is not a button
  await expect(logo).not.toHaveAttribute('role', 'button');

  // Verify the logo color using screenshot comparison
  // Note: You would need to have a reference "youtube-logo-red.png" to compare against
  await expect(await logo.screenshot()).toMatchSnapshot('youtube-logo-red.png', {
    threshold: 0.2, // Allow small color variations
  });

  // Alternative: Check CSS color property if available
  const logoColor = await logo.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('color');
  });
  expect(logoColor).toBe('rgb(255, 0, 0)'); // YouTube red
});

test('homepage UI looks good', async ({ page }) => {
  const card = page.locator('.card');
  await card.screenshot({ path: 'card.png' });
  await page.goto('https://example.com');
  await expect(page).toHaveScreenshot();
});

export const compareSnapshotsFixture: TFixture<'compareSnapshots'> = async (
  { page },
  use,
  testConfig,
) => {
  const testName = testConfig.title;
  // Unique -- in case we rerun the test
  const now = ts();
  // Different folders for each test
  const imageFolder = CONFIG.paths.inTestSnapshot(testName);
  // Generate image names on the fly
  const imageName = (prefix: string = '') => `${imageFolder}/${now}---${prefix}.png` as const;

  // import from `playwright-core/lib/utils`
  const compare = getComparator('img/png');

  // The test that uses this fixture
  await use({
    compare,
    page,
    snapImg: async (opts = {}) => {
      await page.mouse.move(0, 0);
      await page.waitForTimeout(300); // wait for any async/animations
      return page.screenshot({ ...opts, path: imageName(opts.prefix) });
    },
    expectDifferent: (buffer1, buffer2, minDiffPixels, message) =>
      expect(compare(buffer1, buffer2, { maxDiffPixels: minDiffPixels }), message).not.toBeNull(),
    expectSimilar: (buffer1, buffer2, maxDiffPixels, message) =>
      expect(compare(buffer1, buffer2, { maxDiffPixels }), message).toBeNull(),
  });
  // //////////////

  if (testConfig.status === 'passed') {
    await test.step('[fixture] Remove screenshots (test succeeded)', async () => {
      await fs.rm(imageFolder, { recursive: true, force: true });
    });
  } else {
    await test.step('[fixture] Not removing screenshots (test did not succeed)', () => {
      expect(1).toEqual(1);
    });
  }
};

test('Test before and after', async ({ compareSnapshots }) => {
  const { expectDifferent, expectSimilar, snapImg, page } = compareSnapshots;
  const one = await snapImg({ prefix: 'before' });

  // DO STUFF
  // page.locator(...).click()

  const two = await snapImg({ prefix: 'after' });

  expectDifferent(one, two, 400);
});
