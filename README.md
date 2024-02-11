# HTML to Image Conversion API v0.1

## Overview
This API converts HTML content into an image with customizable options including format, quality, size, and dynamic text insertion.

## Installation
- Clone the repository: `git clone https://github.com/drhema/html_css_to_image_API.git`
- Install dependencies: `npm install`
- npm install dotenv
- npm install aws-sdk
- npm install @aws-sdk/client-s3 @aws-sdk/lib-storage

 #Edit .env with your amazon s3 bucket details

## Running the API
- Start the server: `npm start`
- The API will be available at `http://localhost:3000/htmlToImage`

## API Usage
### Endpoint: `/htmlToImage`
- Method: `POST`
- Content-Type: `application/json`
- Request Body Example:
  ```json
  {
    "htmlContent": "<div>$custom_text</div>",
    "format": "webp",
    "quality": 80,
    "width": 800,
    "height": 600,
    "filename": "custom_name",
    "custom_text": "Dynamic Text Here"
  }

EX:
  ```json
{
  "htmlContent": "<!DOCTYPE html><html><head><link href='https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css' rel='stylesheet'><link href='https://fonts.googleapis.com/css2?family=Roboto:wght@700' rel='stylesheet'><style>body { font-family: 'Roboto', sans-serif; }</style></head><body><div class='p-4 text-center mt-4' style='width: 500px'><span class='tweet-text mb-4'>$custom_text</span><div class='mt-2 p-4'><img src='https://bestfriends.org/sites/default/files/styles/hero_mobile/public/hero-dash/Asana3808_Dashboard_Standard.jpg' class='rounded-circle shadow border mt-4' width='100px'></div><h4 class='mt-2'>WeRateDogs</h4><span class='text-muted'>@dog_rates</span></div></body></html>",
  "format": "webp",
  "quality": 80,
  "width": 800,
  "height": 600,
  "filename": "custom_name",
  "custom_text": "CUSTOM TEXT HERE"
}
