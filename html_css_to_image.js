require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const app = express();
const port = 3000;

app.use(bodyParser.json({limit: '50mb'}));

const s3Client = new S3Client({ region: process.env.S3_REGION });

app.post('/htmlToImage', async (req, res) => {
    const { htmlContent, format = 'png', quality, width, height, filename = 'image', custom_text } = req.body;

    const processedHtmlContent = htmlContent.replace(/\$custom_text/g, custom_text);

    let browser = null;
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

        processedImage.toBuffer().then(async finalBuffer => {
            const s3Key = `${process.env.S3_FOLDER}${filename}.${format}`;
            try {
                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: s3Key,
                    Body: finalBuffer,
                    ContentType: `image/${format}`,
                    // ACL parameter removed
                };

                // Perform the upload to S3
                const parallelUploads3 = new Upload({
                    client: s3Client,
                    params: uploadParams,
                });

                await parallelUploads3.done();
                
                const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`;
                res.send({ message: 'Image uploaded successfully', imageUrl: publicUrl });
            } catch (err) {
                console.error('Error uploading image to S3 with SDK v3:', err);
                res.status(500).send('Failed to upload image to S3');
            }
        }).catch(err => {
            console.error('Error processing image with Sharp:', err);
            res.status(500).send('Failed to process image');
        });
    } catch (err) {
        console.error('Error in the HTML to Image process:', err);
        res.status(500).send('Failed to process image');
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
