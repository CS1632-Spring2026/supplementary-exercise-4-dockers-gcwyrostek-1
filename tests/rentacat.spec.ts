import { test, expect } from '@playwright/test';
var baseURL = 'http://localhost:8080/';
/**
TEST FIXTURE:

1. Firefox browser version >= 105, or Chrome browser version >= 105 is installed and launched.
2. The URL https://cs1632.appspot.com/ is open on the web browser.
3. The values of cookies "1", "2", and "3" are set to "false" (no cats are rented).
*/

/**
IDENTIFIER: TEST-1-RESET
TEST CASE: Given that cats ID 1, 2, and 3 have been rented out,
           check that resetting the system results in all cats being available.
PRECONDITIONS: The value of cookies "1", "2", and "3" are set to "true" (cats ID 1, 2, 3 are rented).
EXECUTION STEPS:
1. Press the "Reset" link.
POSTCONDITIONS: 
1. The first item in the cat listing is "ID 1. Jennyanydots".
2. The second item in the cat listing is "ID 2. Old Deuteronomy".
3. The third item in the cat listing is "ID 3. Mistoffelees".
*/
test('TEST-1-RESET', async ({ context, page }) => {
    await context.addCookies([
        {name: '1', value: 'true', url: baseURL},
        {name: '2', value: 'true', url: baseURL},
        {name: '3', value: 'true', url: baseURL},
    ]);
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Reset' }).click();
    await expect(page.getByTestId('cat-id1')).toContainText('ID 1. Jennyanydots');
    await expect(page.getByTestId('cat-id2')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.getByTestId('cat-id3')).toContainText('ID 3. Mistoffelees');
});

/**
IDENTIFIER: TEST-2-CATALOG
TEST CASE: Check that the second item in the catalog is an image named "cat2.jpg".
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Catalog" link.
POSTCONDITIONS: The source of the second image in the catalog is "/images/cat2.jpg".
*/
test('TEST-2-CATALOG', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Catalog' }).click();
    await expect(page.locator('//*/div[1]/ol/li[2]/img')).toHaveAttribute('src', '/images/cat2.jpg');
});

/**
IDENTIFIER: TEST-3-LISTING
TEST CASE: Check that the listing has three cats and the third is "ID 3. Mistoffelees".
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Catalog" link.
POSTCONDITIONS: 
1. There are exactly three items in the listing.
2. The text in the third item is "ID 3. Mistoffelees".
*/
test('TEST-3-LISTING', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Catalog' }).click();
    await expect(page.getByTestId('listing').getByRole('list').getByRole('listitem')).toHaveCount(3);
    await expect(page.locator('//*/div[1]/div/ul/li[3]')).toContainText('ID 3. Mistoffelees');
});

/**
IDENTIFIER: TEST-4-RENT-A-CAT
TEST CASE: Check that the "Rent" and "Return" buttons exist in the Rent-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Rent-A-Cat" link.
POSTCONDITIONS: 
1. A "Rent" button exists on the page.
2. A "Return" button exists on the page.
*/
test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

/**
IDENTIFIER: TEST-5-RENT
TEST CASE: Check that renting cat ID 1 works as expected.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Rent-A-Cat" link.
2. Enter "1" into the input box for the rented cat ID.
3. Press the "Rent" button.
POSTCONDITIONS: 
1. The first item in the cat listing is "Rented out".
2. The second item in the cat listing is "ID 2. Old Deuteronomy".
3. The third item in the cat listing is "ID 3. Mistoffelees".
4. The text "Success!" is displayed in the element with ID "rentResult"
*/
test('TEST-5-RENT', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByTestId('rentID').click();
    await page.getByTestId('rentID').fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();
    await expect(page.locator('//*/div[1]/div/ul/li[1]')).toContainText('Rented out');
    await expect(page.locator('//*/div[1]/div/ul/li[2]')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('//*/div[1]/div/ul/li[3]')).toContainText('ID 3. Mistoffelees');
    await expect(page.getByTestId('rentResult')).toContainText('Success!');
});

/**
IDENTIFIER: TEST-6-RETURN
TEST CASE: Check that returning cat ID 2 works as expected.
PRECONDITIONS: The value of cookies "2" and "3" are set to "true" (cats ID 2 and 3 are rented).
EXECUTION STEPS:
1. Press the "Rent-A-Cat" link.
2. Enter "2" into the input box for the returned cat ID.
3. Press the "Return" button.
POSTCONDITIONS: 
1. The first item in the cat listing is "ID 1. Jennyanydots".
2. The second item in the cat listing is "ID 2. Old Deuteronomy".
3. The third item in the cat listing is "Rented out".
4. The text "Success!" is displayed in the element with ID "returnResult"
*/
test('TEST-6-RETURN', async ({ context, page }) => {
    await context.addCookies([
        {name: '2', value: 'true', url: baseURL},
        {name: '3', value: 'true', url: baseURL},
    ]);
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByTestId('returnID').click();
    await page.getByTestId('returnID').fill('2');
    await page.getByRole('button', { name: 'Return' }).click();
    await expect(page.getByTestId('cat-id1')).toContainText('ID 1. Jennyanydots');
    await expect(page.getByTestId('cat-id2')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.getByTestId('cat-id3')).toContainText('Rented out');
    await expect(page.getByTestId('returnResult')).toContainText('Success!');
});

/**
IDENTIFIER: TEST-7-FEED-A-CAT
TEST CASE: Check that the "Feed" button exists in the Feed-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Feed-A-Cat" link.
POSTCONDITIONS: 
1. A "Feed" button exists on the page.
*/
test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

/**
IDENTIFIER: TEST-8-FEED
TEST CASE: Check that feeding 6 catnips to 3 cats results in "Nom, nom, nom.".
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Feed-A-Cat" link.
2. Enter "6" into the input box for number of catnips.
3. Press the "Feed" button.
POSTCONDITIONS: 
1. The text "Nom, nom, nom." is displayed in the element with ID "feedResult"
*/
test('TEST-8-FEED', async ({ page }) => {
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByTestId('catnips').click();
    await page.getByTestId('catnips').fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();
    await expect(page.getByTestId('feedResult')).toContainText('Nom, nom, nom.', { timeout: 10_000 });
});

/**
IDENTIFIER: TEST-9-GREET-A-CAT
TEST CASE: Check that 3 cats respond with three "Meow!"s in the Greet-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Greet-A-Cat" link.
POSTCONDITIONS: 
1. The text "Meow!Meow!Meow!" appears on the page.
*/
test('TEST-9-GREET-A-CAT', async ({ page }) => {
   await page.goto(baseURL);
   await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
   await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible(); 
});

/**
IDENTIFIER: TEST-10-GREET-A-CAT-WITH-NAME
TEST CASE: Check that greeting Jennyanydots results in "Meow!"s in the Greet-A-Cat page.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Navigate to the `/greet-a-cat/Jennyanydots` URL by opening on browser.
POSTCONDITIONS: 
1. The text "Meow! from Jennyanydots." appears on the page.
*/
test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.goto(baseURL);
    await page.goto('https://cs1632.appspot.com/greet-a-cat/Jennyanydots');
    await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
});

/**
IDENTIFIER: TEST-11-FEED-A-CAT-SCREENSHOT
TEST CASE: Check that the Feed-A-Cat page matches the corresponding screenshot in the tests/rentacat.spec.ts.snapshots folder.
PRECONDITIONS: The value of cookies "1", "2", and "3" are set to "true" (cats ID 1, 2, 3 are rented).
EXECUTION STEPS:
1. Press the "Feed-A-Cat" link.
POSTCONDITIONS: 
1. The screenshot of the body of the page matches the one in tests/rentacat.spec.ts.snapshots for the browser and OS.
*/
test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ context, page }) => {
    await context.addCookies([
        {name: '1', value: 'true', url: baseURL},
        {name: '2', value: 'true', url: baseURL},
        {name: '3', value: 'true', url: baseURL},
    ]);
    await page.setViewportSize({ width: 1280, height: 848 });
    await page.goto(baseURL);
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page).toHaveScreenshot({maxDiffPixelRatio:.1});
});