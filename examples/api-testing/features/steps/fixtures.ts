import { APIResponse, Clock } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';

type Fixtures = {
  ctx: { response: APIResponse };
  clockWait: { wait: Clock };
};

export const test = base.extend<Fixtures>({
  ctx: async ({}, use) => {
    const ctx = {} as Fixtures['ctx'];
    await use(ctx);
  },
  clockWait: async ({}, use) => {
    const clockWait = {} as Fixtures['clockWait'];
    await use(clockWait);
  },
});

export const { Given, When, Then } = createBdd(test);
