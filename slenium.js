import { Builder, By } from 'selenium-webdriver'

const USERNAME = 'pranavkdileep_5qbSfc';
const ACCESS_KEY = 'uUxksqa5SuAoZMBX3pxN';

async function runTestOnSafari() {
    let currentfuncalltime = Date.now();
    let maxsecondsfunctioncall = 360;
    const capabilities = {
        'browserName': 'Safari',
        'browserVersion': 'latest',
        'bstack:options': {
            'os': 'OS X',
            'osVersion': 'Sequoia',
            'projectName': 'My Safari Test',
            'buildName': 'Build #1',
            'sessionName': 'Safari automation test',
            'local': 'false',
            'seleniumVersion': '4.0.0',
        }
    };

    const driver = await new Builder()
        .usingServer(`https://${USERNAME}:${ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
        .withCapabilities(capabilities)
        .build();

    try {
        const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiNjI1YzM5YTAtM2UwMy00ZjYxLTlmNDMtMjdkNmFlODU5MGFhIiwidXNlcm5hbWUiOiIweDRkYmZlNzhiMWUwNTQ1NmM3N2Y5MDQ4ZGNhZWJiODVjZDk2NjY1MmUiLCJpZCI6IjEyNDg0MCIsImJhblVudGlsIjpudWxsLCJzaWQiOiJmNzZlODY0Zi05NGE4LTRkZGQtOTk5OS03ODY5ZTlmZDRiYWIiLCJleHAiOjE3NTM1MjUxMzN9.26SN_LwmMZaEHoXpiB7eivhJoL4nQREwSPymxpDxDTs'
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
        const maxRounds = 4;
        let startTime = Date.now();

        while (round < maxRounds) {
            const proofNumberText = await driver.findElement(By.xpath(proofNumberTextXPath)).getText();
            console.log("Proof Number Text:", proofNumberText);
            const proofNumber = parseInt(proofNumberText, 10);
            if(Date.now() - currentfuncalltime > maxsecondsfunctioncall * 1000) {
                console.log("Function call exceeded maximum time limit, breaking the loop");
                break;
            }
            if (proofNumber >= 14) {
                let temp = 14;
                while (true) {
                    if(Date.now() - currentfuncalltime > maxsecondsfunctioncall * 1000) {
                        console.log("Function call exceeded maximum time limit, breaking the loop");
                        break;
                    }
                    const ttt = await driver.findElement(By.xpath(proofNumberTextXPath)).getText();
                    temp = parseInt(ttt, 10);
                    console.log("waiting proofNumber to be zero");
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
    while (true) {
        try {
            await runTestOnSafari();
            await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds before next run
        } catch (error) {
            console.error('Error during test execution:', error);
        }
    }
}
main();
