/**
 * Automated screenshot tool for cutscene backgrounds
 * Uses the standalone cutscene-preview.html page
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function takeScreenshots() {
    console.log('Launching browser...');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--use-gl=swiftshader',   // Software WebGL renderer
            '--disable-gpu-sandbox'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Load the standalone preview page via Vite dev server
    const previewPath = 'http://localhost:3002/cutscene-preview.html';
    console.log(`Loading: ${previewPath}`);
    await page.goto(previewPath, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for Three.js to initialize (CDN load + scene setup)
    console.log('Waiting for Three.js to initialize...');
    try {
        await page.waitForFunction(() => window.sceneReady === true, { timeout: 30000 });
        console.log('Scene is ready!');
    } catch (e) {
        console.log('Timeout waiting for scene, trying anyway...');
    }
    await wait(1000);

    // Hide the controls UI for clean screenshots
    await page.evaluate(() => {
        document.getElementById('controls').style.display = 'none';
    });

    // ============ CUTSCENE 3: RIO GRANDE ============
    console.log('\n=== CUTSCENE 3: RIO GRANDE ===');

    await page.evaluate(() => window.loadCutscene(3));
    await wait(1000);

    const screenshotPath3 = join(__dirname, 'screenshots', 'cutscene3');

    // Front view
    await page.evaluate(() => window.setView('front'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath3, 'view1_front.png') });
    console.log('Saved: cutscene3/view1_front.png');

    // Elevated view
    await page.evaluate(() => window.setView('elevated'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath3, 'view2_elevated.png') });
    console.log('Saved: cutscene3/view2_elevated.png');

    // Left view
    await page.evaluate(() => window.setView('left'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath3, 'view3_left.png') });
    console.log('Saved: cutscene3/view3_left.png');

    // Right view
    await page.evaluate(() => window.setView('right'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath3, 'view4_right.png') });
    console.log('Saved: cutscene3/view4_right.png');

    // Top down view
    await page.evaluate(() => window.setView('top'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath3, 'view5_topdown.png') });
    console.log('Saved: cutscene3/view5_topdown.png');

    // ============ CUTSCENE 5: SUBURBIA ============
    console.log('\n=== CUTSCENE 5: SUBURBIA ===');

    await page.evaluate(() => window.loadCutscene(5));
    await wait(1000);

    const screenshotPath5 = join(__dirname, 'screenshots', 'cutscene5');

    // Front view
    await page.evaluate(() => window.setView('front'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath5, 'view1_front.png') });
    console.log('Saved: cutscene5/view1_front.png');

    // Elevated view
    await page.evaluate(() => window.setView('elevated'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath5, 'view2_elevated.png') });
    console.log('Saved: cutscene5/view2_elevated.png');

    // Left view
    await page.evaluate(() => window.setView('left'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath5, 'view3_left.png') });
    console.log('Saved: cutscene5/view3_left.png');

    // Right view
    await page.evaluate(() => window.setView('right'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath5, 'view4_right.png') });
    console.log('Saved: cutscene5/view4_right.png');

    // Top down view
    await page.evaluate(() => window.setView('top'));
    await wait(300);
    await page.screenshot({ path: join(screenshotPath5, 'view5_topdown.png') });
    console.log('Saved: cutscene5/view5_topdown.png');

    console.log('\n=== SCREENSHOTS COMPLETE ===');
    console.log('Screenshots saved to screenshots/cutscene3/ and screenshots/cutscene5/');

    await browser.close();
}

takeScreenshots().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
