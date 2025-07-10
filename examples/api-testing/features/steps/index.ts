import { expect } from '@playwright/test';
import { When, Then, Given } from './fixtures';

When('GET {string}', async ({ request, ctx }, url: string) => {
  ctx.response = await request.get(url);
  const requestUrl = await request.get(url);
  console.log('header age:', requestUrl.headers().age);
  // console.log('body:', await requestUrl.json());
  console.log('body:', await ctx.response.body());
  // console.log('body:', await requestUrl.text());

  //example classic fetch get
  // await request.get('https://example.com/api/getText', {
  //   params: {
  //     'isbn': '1234',
  //     'page': 23,
  //   }
  // });
});

When('POST {string}', async ({ request, ctx }, url: string, data: string) => {
  ctx.response = await request.post(url, { data });
  //Example classic fetch post
  // await request.fetch('https://example.com/api/createBook', {
  //   method: 'post',
  //   data: {
  //     title: 'Book Title',
  //     author: 'John Doe',
  //   }
  // });
});

Then('status is {int}', async ({ ctx }, status: number) => {
  expect(ctx.response.status()).toEqual(status);
  expect(ctx.response.status()).toEqual(301);
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
