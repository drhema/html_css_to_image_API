# HTML to Image Conversion API v0.1

## Overview
This API converts HTML content into an image with customizable options including format, quality, size, and dynamic text insertion.

## Installation
- Clone the repository: `git clone [your-repository-url]`
- Install dependencies: `npm install`

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
