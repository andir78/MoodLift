# MoodLift Backend

This is the backend server for the MoodLift application, which generates mood-based images.

## Prerequisites

- Go 1.21 or later
- Git

## Setup

1. Install dependencies:
```bash
go mod download
```

2. Create the static images directory:
```bash
mkdir -p static/images
```

## Running the Server

Start the server:
```bash
go run main.go
```

The server will start on `http://localhost:5000`.

## API Endpoints

### Generate Image

```
POST /api/generate-image
```

Request body:
```json
{
  "mood": "Happy|Calm|Excited",
  "size": 50,
  "grayscale": false
}
```

Response:
```json
{
  "imageUrl": "/static/images/1234567890.jpg"
}
```

## Development

The server uses:
- Gin for the web framework
- CORS middleware for cross-origin requests
- Standard library for image generation

The image generator creates abstract images based on the selected mood, with options for size and grayscale conversion. 