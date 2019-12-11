const puppeteer = require('puppeteer');
const config = require('./config.json');
require('dotenv').config()

let scrapeGitHub = async () => {

    let browser = await puppeteer.launch({ headless: true })
    let page = await browser.newPage()

    /* Go to GitHub/Login page */
    await page.goto('https://github.com/login', { waitUntil: "networkidle0" })

    /* Write in the username and password*/
    await page.type('#login_field', process.env.USER_KEY, { delay: 30 });
    await page.type('#password', process.env.PASSWORD_KEY, { delay: 30 })

    /* Click login button */
    await page.click('.btn')

    /* Create New Repo*/
    await page.goto('https://github.com/new', { waitUntil: "networkidle0"})

    /* Write RepoName & Description */
    await page.type('#repository_name', config.repoName, { delay: 30 });
    await page.type('#repository_description', config.description, { delay: 30 })

    /* Click create repository */
    await page.click('.btn.btn-primary.first-in-line')

    /* Page Screeshot and save it to */
    await page.waitFor(10000);
    await page.screenshot({ path: './screenshots/GeneratedRepo.png', fullPage: true})

    /* Grab first page information */
    const infoToUpload = await page.evaluate(() => {
        let quickSetup = document.getElementById('empty-setup-clone-url').value
        
        return quickSetup
    })

    browser.close();
    return infoToUpload

}
    scrapeGitHub().then((value) => {
    console.log(value)
})