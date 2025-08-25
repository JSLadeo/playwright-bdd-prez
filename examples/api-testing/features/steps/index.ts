import { expect } from '@playwright/test';
import { When, Then } from './fixtures';

When('GET {string}', async ({ request, ctx }, url: string) => {
  ctx.response = await request.get(url);
  const requestUrl = await request.get(url);
  console.log('header:', requestUrl.headers());
  const body = await ctx.response.body();
  console.log('body:', body.toString());
  console.log('text:', await ctx.response.text());
});

When('POST {string}', async ({ request, ctx }, url: string, data: string) => {
  ctx.response = await request.post(url, { data });
});

Then('status is {int}', async ({ ctx }, status: number) => {
  expect(ctx.response.status()).toEqual(status);
});

Then('response has prop {string}', async ({ ctx }, keyPath: string) => {
  expect(await ctx.response.json()).toHaveProperty(keyPath);
});

Then('response has prop {string} = {int}', async ({ ctx }, keyPath: string, value: number) => {
  expect(await ctx.response.json()).toHaveProperty(keyPath, value);
});

Then('response has prop {string} = {string}', async ({ ctx }, keyPath: string, value: string) => {
  expect(await ctx.response.json()).toHaveProperty(keyPath, value);
});

Then('response object matches:', async ({ ctx }, data: string) => {
  expect(await ctx.response.json()).toMatchObject(JSON.parse(data));
});

Then('response array contains:', async ({ ctx }, data: string) => {
  expect(await ctx.response.json()).toContainEqual(expect.objectContaining(JSON.parse(data)));
});

When('GET {string} with mock', async ({ page, ctx }, url: string) => {
  const mockData = {
    id: 999,
    name: 'Patrice',
    email: 'patrice@mock.com',
    address: {
      city: 'MockCity',
      zipcode: '12345',
    },
  };

  console.log('🎭 Creating direct mock response:', mockData);

  ctx.response = {
    status: () => 200,
    json: async () => mockData,
    text: async () => JSON.stringify(mockData),
    body: () => Buffer.from(JSON.stringify(mockData)),
  } as any;

  console.log('✅ Mock response created for ctx.response');
});

Then('response has prop {string} = {string} from mock', async ({ ctx }, keyPath: string, expectedValue: string) => {
  const responseData = await ctx.response.json();
  expect(responseData).toHaveProperty(keyPath, expectedValue);
  console.log(`✅ Mock verification: ${keyPath} = ${expectedValue}`);
});
