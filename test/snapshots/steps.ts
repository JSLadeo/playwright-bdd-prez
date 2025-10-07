import { expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

// Fonction utilitaire pour afficher les statistiques de comparaison
function logScreenshotStats(testName: string, ratio: number, maxRatio: number) {
  console.log('\n📊 Statistiques Screenshot:', testName);
  console.log('─'.repeat(50));
  console.log(`Ratio de différence: ${ratio.toFixed(6)}`);
  console.log(`Seuil maximum: ${maxRatio.toFixed(6)}`);
  console.log(`Status: ${ratio <= maxRatio ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Marge: ${ratio <= maxRatio ? '+' : ''}${(maxRatio - ratio).toFixed(6)}`);
  console.log('─'.repeat(50));
}

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

  const maxRatio = 0.02;

  try {
    await expect(page).toHaveScreenshot({
      maxDiffPixelRatio: maxRatio,
      threshold: 0.2, // Seuil de différence pour la comparaison
    });
    console.log('✅ Screenshot match: Ratio de différence acceptable (≤ 0.02)');
    logScreenshotStats('Google Homepage', 0, maxRatio);
  } catch (error) {
    // Extraire les informations de ratio depuis l'erreur
    const errorMessage = error.message;
    const diffPixelRatioMatch = errorMessage.match(/(\d+\.?\d*) diff pixel ratio/);
    const actualPixelsMatch = errorMessage.match(/(\d+) actual pixels/);
    const expectedPixelsMatch = errorMessage.match(/(\d+) expected pixels/);

    if (diffPixelRatioMatch) {
      const actualRatio = parseFloat(diffPixelRatioMatch[1]);
      console.log(`❌ Screenshot mismatch:`);
      console.log(`   Ratio de différence actuel: ${actualRatio}`);
      console.log(`   Ratio maximum autorisé: ${maxRatio}`);
      console.log(`   Dépassement: ${(actualRatio - maxRatio).toFixed(4)}`);

      logScreenshotStats('Google Homepage', actualRatio, maxRatio);
    }

    if (actualPixelsMatch && expectedPixelsMatch) {
      console.log(`   Pixels différents: ${actualPixelsMatch[1]}`);
      console.log(`   Total pixels: ${expectedPixelsMatch[1]}`);
    }

    // Relancer l'erreur pour que le test échoue
    throw error;
  }
});

// Nouveau step pour tester avec des ratios différents
Then('screenshot matches with ratio {float}', async ({ page }, maxDiffRatio: number) => {
  console.log(`\n🔍 Test avec ratio personnalisé: ${maxDiffRatio}`);

  try {
    await expect(page).toHaveScreenshot(`screenshot-ratio-${maxDiffRatio}.png`, {
      maxDiffPixelRatio: maxDiffRatio,
      threshold: 0.2,
    });
    console.log(`✅ Screenshot match avec ratio ${maxDiffRatio}`);
    logScreenshotStats(`Custom Ratio ${maxDiffRatio}`, 0, maxDiffRatio);
  } catch (error) {
    const errorMessage = error.message;
    const diffPixelRatioMatch = errorMessage.match(/(\d+\.?\d*) diff pixel ratio/);

    if (diffPixelRatioMatch) {
      const actualRatio = parseFloat(diffPixelRatioMatch[1]);
      console.log(`❌ Screenshot mismatch avec ratio ${maxDiffRatio}:`);
      logScreenshotStats(`Custom Ratio ${maxDiffRatio}`, actualRatio, maxDiffRatio);
    }

    throw error;
  }
});

// Step pour comparer plusieurs ratios d'affilée
Then('I test multiple screenshot ratios', async ({ page }) => {
  const ratios = [0.001, 0.01, 0.02, 0.05, 0.1];

  console.log('\n🎯 Test de comparaison avec plusieurs ratios:');
  console.log('═'.repeat(60));

  for (const ratio of ratios) {
    try {
      await expect(page).toHaveScreenshot(`test-ratio-${ratio}.png`, {
        maxDiffPixelRatio: ratio,
        threshold: 0.2,
      });
      console.log(`✅ PASS avec ratio ${ratio}`);
      logScreenshotStats(`Ratio ${ratio}`, 0, ratio);
    } catch (error) {
      const errorMessage = error.message;
      const diffPixelRatioMatch = errorMessage.match(/(\d+\.?\d*) diff pixel ratio/);

      if (diffPixelRatioMatch) {
        const actualRatio = parseFloat(diffPixelRatioMatch[1]);
        console.log(`❌ FAIL avec ratio ${ratio} (actuel: ${actualRatio})`);
        logScreenshotStats(`Ratio ${ratio}`, actualRatio, ratio);
      }
    }
  }

  console.log('═'.repeat(60));
});
