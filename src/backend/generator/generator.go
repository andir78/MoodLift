package generator

import (
	"bytes"
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// GeminiRequest represents the request body for Gemini API
type GeminiRequest struct {
	Contents []Content `json:"contents"`
}

type Content struct {
	Parts []Part `json:"parts"`
}

type Part struct {
	Text string `json:"text"`
}

// GeminiResponse represents the response from Gemini API
type GeminiResponse struct {
	Candidates []Candidate `json:"candidates"`
}

type Candidate struct {
	Content Content `json:"content"`
}

// ImageGenerator handles image generation
type ImageGenerator struct {
	outputDir string
	apiKey    string
}

// NewImageGenerator creates a new ImageGenerator instance
func NewImageGenerator(outputDir string, apiKey string) (*ImageGenerator, error) {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return nil, err
	}
	return &ImageGenerator{outputDir: outputDir, apiKey: apiKey}, nil
}

// GenerateImage creates a new image based on mood
func (g *ImageGenerator) GenerateImage(mood string, size int, grayscale bool) (string, error) {
	// Create a new image
	img := image.NewRGBA(image.Rect(0, 0, size, size))

	// Generate colors based on mood
	bgColor := generateMoodColor(mood)
	draw.Draw(img, img.Bounds(), &image.Uniform{bgColor}, image.Point{}, draw.Src)

	// Add some random shapes
	rand.Seed(time.Now().UnixNano())
	for i := 0; i < 5; i++ {
		x := rand.Intn(size)
		y := rand.Intn(size)
		shapeColor := generateMoodColor(mood)
		if grayscale {
			shapeColor = colorToGrayscale(shapeColor)
		}
		drawShape(img, x, y, 20, shapeColor)
	}

	// Save the image
	filename := fmt.Sprintf("mood_%s_%d.png", mood, time.Now().Unix())
	path := filepath.Join(g.outputDir, filename)
	file, err := os.Create(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	if err := png.Encode(file, img); err != nil {
		return "", err
	}

	return path, nil
}

// GenerateASCIIArt creates ASCII art based on mood using Gemini API
func (g *ImageGenerator) GenerateASCIIArt(mood string) (string, error) {
	// Create the prompt for Gemini
	prompt := fmt.Sprintf("Generate a simple ASCII art face that represents the mood: %s. The ASCII art should be small, simple, and fit within 10 lines. Use only basic ASCII characters like |, -, /, \\, ., ', etc.", mood)

	// Create the request body
	reqBody := GeminiRequest{
		Contents: []Content{
			{
				Parts: []Part{
					{
						Text: prompt,
					},
				},
			},
		},
	}

	// Convert request body to JSON
	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=%s", g.apiKey)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Parse response
	var geminiResp GeminiResponse
	if err := json.NewDecoder(resp.Body).Decode(&geminiResp); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("no content generated")
	}

	return geminiResp.Candidates[0].Content.Parts[0].Text, nil
}

// Helper functions for image generation
func generateMoodColor(mood string) color.Color {
	colors := map[string]color.RGBA{
		"happy":    {R: 255, G: 255, B: 0, A: 255},   // Yellow
		"sad":      {R: 0, G: 0, B: 255, A: 255},     // Blue
		"angry":    {R: 255, G: 0, B: 0, A: 255},     // Red
		"calm":     {R: 0, G: 255, B: 0, A: 255},     // Green
		"excited":  {R: 255, G: 0, B: 255, A: 255},   // Magenta
	}

	if c, exists := colors[mood]; exists {
		return c
	}
	return color.RGBA{R: 128, G: 128, B: 128, A: 255} // Default to gray
}

func colorToGrayscale(c color.Color) color.Color {
	r, g, b, a := c.RGBA()
	gray := uint8((r + g + b) / 3 >> 8)
	return color.RGBA{R: gray, G: gray, B: gray, A: uint8(a >> 8)}
}

func drawShape(img *image.RGBA, x, y, size int, c color.Color) {
	for i := x - size/2; i < x+size/2; i++ {
		for j := y - size/2; j < y+size/2; j++ {
			if i >= 0 && i < img.Bounds().Dx() && j >= 0 && j < img.Bounds().Dy() {
				img.Set(i, j, c)
			}
		}
	}
}
