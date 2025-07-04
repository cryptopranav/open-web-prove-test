import { Builder, By } from 'selenium-webdriver'


async function runTestOnSafari() {
    let currentfuncalltime = Date.now();
    let maxsecondsfunctioncall = 360 * 6;
    const driver = await new Builder().forBrowser('safari').build();

    try {
        const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjI5NjY3MiIsInV1aWQiOiI0MGJkNzJjYi1lYmU1LTQzYTktYWU3Yi0yYzJmZDJlYjhmYmYiLCJ1c2VybmFtZSI6IjB4ZTY4YjhjYWEwYmM3NmM0ZGM0MTE5MTY0MTU5MTRhMjg4OTZiNjViOSIsImJhblVudGlsIjpudWxsLCJpc0FjdGl2ZSI6dHJ1ZSwicHJvZmlsZSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNS0wNi0zMFQwNzoxODo1Ni4zMzNaIiwidXBkYXRlZEF0IjoiMjAyNS0wNi0zMFQwNzoxODo1Ni4zMzNaIiwic2lkIjoiNWI4ZjlkOWEtMGFmZS00MTg4LWFhOTMtZWNkZWZhZWE1MzQwIiwiZXhwIjoxNzUzODU5OTM2fQ.8QEuPm_mfQuDN_AirzsyjKukS3B-uiDr23uHFbNd_BU'
        await driver.manage().addCookie({
            name: 'accessToken',
            value: accessToken,
            domain: 'onprover.orochi.network',
        });
        await driver.sleep(2000);
        await driver.get('https://onprover.orochi.network/');
        console.log("page loaded button clicking");
        await driver.sleep(3000);

        const buttonSelectorXPath = '//*[@id="root"]/div/div/div/main/div/div/div[1]/div[1]/div[2]/button';
        await driver.findElement(By.xpath(buttonSelectorXPath)).click();
        await driver.sleep(5000);
        console.log("button clicked, waiting for 5 seconds");

        const proofNumberTextXPath = '//*[@id="root"]/div/div/div/main/div/div/div[1]/div[1]/div[2]/div/div[3]/p[1]';
        let round = 0;
        const maxRounds = 2;
        let startTime = Date.now();
        let prev = 0;
        while (round < maxRounds) {
            const proofNumberText = await driver.findElement(By.xpath(proofNumberTextXPath)).getText();
            const balance = await driver.findElement(By.xpath('//*[@id="root"]/div/div/div/main/div/div/div[1]/div[1]/div[2]/div/div[1]/p[1]/span[1]')).getText();
            //console.log("Proof Number Text:", proofNumberText);
            const proofNumber = parseInt(proofNumberText, 10);
            if(prev != proofNumber){
                console.log(`Proof Number ${proofNumber} ON:${balance}`)
                prev = proofNumber
            }
            if(Date.now() - currentfuncalltime > maxsecondsfunctioncall * 1000) {
                console.log("Function call exceeded maximum time limit, breaking the loop");
                process.exit(1);
            }
            if (proofNumber >= 14) {
                let temp = 14;
                while (true) {
                    if(Date.now() - currentfuncalltime > maxsecondsfunctioncall * 1000) {
                        console.log("Function call exceeded maximum time limit, breaking the loop");
                        process.exit(1);
                    }
                    const ttt = await driver.findElement(By.xpath(proofNumberTextXPath)).getText();
                    temp = parseInt(ttt, 10);
                    //console.log("waiting proofNumber to be zero");
                    if (temp === 0) {
                        console.log("Proof number is zero, breaking the loop");
                        break;
                    }
                }
                round++;
                const elapsedTime = Date.now() - startTime;
                console.log(`Round ${round} completed in ${elapsedTime / 1000} seconds`);
                startTime = Date.now();
            }
        }
    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await driver.quit();
    }
}

async function main() {
        try {
            await runTestOnSafari();
            await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds before next run
        } catch (error) {
            console.error('Error during test execution:', error);
        }
}
main();
