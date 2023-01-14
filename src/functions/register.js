// REQUIRES
const puppeteer = require('puppeteer');

async function register_user(new_user_user, useremail) {
    // variables
    const Dashboard_url = 'https://developer.spotify.com/dashboard';
    const app_url = 'https://developer.spotify.com/dashboard/applications/c8d20c0f169042d7858341c399cf14d5';

    const user = process.env.SPOTIFY_USER
    const pass = process.env.SPOTIFY_PASS

    const browser = await puppeteer.launch({ // lauch the browser
        headless: false,
        args: ["--no-sandbox"]
    });

    const page = await browser.newPage(); // open a new tab in the browser

    await page.goto(Dashboard_url);   // go to the log in url

    let element = await page.waitForSelector('xpath//html/body/div[1]/div/div/main/section/div[2]/div[2]/div/p[2]/button');
    await element.click();  // click in the submit button 

    console.log('--------------antes del popup----------------')

    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    const popup = await newPagePromise;

    await popup.waitForSelector('[id=login-username]');

    await popup.type('[id=login-username]', user);    // type the user
    await popup.type('[id=login-password]', pass);   // type the password
    await popup.waitForTimeout(1000);
    await popup.click('[id=login-button]');  // click in the submit button 

    console.log('--------------despues del popup----------------')

    await page.waitForTimeout(3000);

    // handle the "Oops! Something went wrong, please try again" alert
    try {
        console.log('handeling "Oops! Something went wrong, please try again" alert')
        if (await popup.$('xpath//html/body/div[1]/div/div[2]/div/div/div[1]/span') !== null) {
            await popup.click('[id=login-button]');  // click in the submit button
            await popup.waitForTimeout(3000);
        }
    } catch (error) {
        console.log("all okey, no Oops alert showed")
    }

    // handle tems of service
    try {
        console.log("handeling no terms for service")
        await page.click('xpath//html/body/div[1]/div/div/main/section/div[2]/div/div/form/div[2]/div/div[1]/label/input');  // click in the submit button
        await page.click('xpath//html/body/div[1]/div/div/main/section/div[2]/div/div/form/div[3]/input');  // click in the submit button
        await page.waitForTimeout(3000);   
    } catch (error) {
        console.log("all okey, no terms for service showed")
        console.log(error)
    }

    await page.goto(app_url)

    await page.waitForTimeout(2000);
    element = await page.waitForSelector('xpath//html/body/div[1]/div/div/main/div/div/section[1]/div[3]/div[2]/div[1]/button[2]');
    await element.click();  // click in the submit button 

    console.log('----------------------kk 1-----------------------')

    element = await page.waitForSelector('xpath//html/body/div[1]/div/div/main/div/div/section[2]/section/div/div[3]/div/a');
    await element.click();  // click in the submit button 

    console.log('----------------------kk 2-----------------------')

    await page.waitForTimeout(1000);
    await page.type('xpath//html/body/div[1]/div/div/main/div/div/section[2]/section/div/div[4]/div/div/div/div/div[2]/div/div[1]/label/input', new_user_user);    // type the user
    await page.type('xpath//html/body/div[1]/div/div/main/div/div/section[2]/section/div/div[4]/div/div/div/div/div[2]/div/div[2]/label/input', useremail);   // type the password
    await page.click('xpath//html/body/div[1]/div/div/main/div/div/section[2]/section/div/div[4]/div/div/div/div/div[3]/div/button[1]');   // type the password

    console.log('----------------------kk 3-----------------------')

    await page.waitForTimeout(1000);
    await browser.close();

    console.log('---------------------- user reguister -----------------------')

    return true
}


module.exports = { register_user };