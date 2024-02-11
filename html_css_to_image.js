const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const sharp = require('sharp');

const app = express();
const port = 3000;

app.use(bodyParser.json({limit: '50mb'}));

app.post('/htmlToImage', async (req, res) => {
    const { htmlContent, format = 'png', quality, width, height, filename = 'image', custom_text } = req.body;

    // Replace $custom_text placeholder in the htmlContent with the provided custom_text
    const processedHtmlContent = htmlContent.replace(/\$custom_text/g, custom_text);

    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(processedHtmlContent, { waitUntil: 'networkidle0' });

        let screenshotOptions = { type: format };
        if (format === 'jpeg' || format === 'webp') {
            screenshotOptions.quality = quality || 80;
        }
        const imageBuffer = await page.screenshot(screenshotOptions);

        let processedImage = sharp(imageBuffer);
        if (width || height) {
            processedImage = processedImage.resize(width, height);
        }
        if (format === 'avif') {
            processedImage = processedImage.avif({ quality: quality || 50 });
        }

        res.set({
            'Content-Type': `image/${format}`,
            'Content-Disposition': `attachment; filename="${filename}.${format}"`
        });

        processedImage.toBuffer().then(finalBuffer => {
            res.send(finalBuffer);
        });
    } catch (err) {
        console.error('Error processing image:', err);
        res.status(500).send('Failed to process image');
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
