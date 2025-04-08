package generator

import (
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"math/rand"
	"os"
	"path/filepath"
	"time"
)

// ImageGenerator handles the generation of mood-based images
type ImageGenerator struct {
	outputDir    string
	geminiAPIKey string
}

// NewImageGenerator creates a new ImageGenerator instance
func NewImageGenerator(outputDir string, geminiAPIKey string) (*ImageGenerator, error) {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create output directory: %w", err)
	}
	return &ImageGenerator{
		outputDir:    outputDir,
		geminiAPIKey: geminiAPIKey,
	}, nil
}

// GenerateImage creates a new image based on the given parameters
func (g *ImageGenerator) GenerateImage(mood string, size int, grayscale bool) (string, error) {
	// TODO: Implement Gemini AI integration
	// For now, we'll keep the existing image generation logic
	// but we have the API key available in g.geminiAPIKey

	// Create a new image with the specified size
	width := 300 * size / 100
	height := 300 * size / 100
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	// Generate colors based on mood
	colors := getMoodColors(mood)

	// Fill the image with a gradient based on the mood
	drawMoodGradient(img, colors)

	// Apply grayscale if requested
	if grayscale {
		applyGrayscale(img)
	}

	// Generate a unique filename
	filename := fmt.Sprintf("%d.jpg", time.Now().UnixNano())
	filepath := filepath.Join(g.outputDir, filename)

	// Save the image
	file, err := os.Create(filepath)
	if err != nil {
		return "", fmt.Errorf("failed to create image file: %w", err)
	}
	defer file.Close()

	if err := jpeg.Encode(file, img, &jpeg.Options{Quality: 90}); err != nil {
		return "", fmt.Errorf("failed to encode image: %w", err)
	}

	return filepath, nil
}

// getMoodColors returns a list of colors based on the mood
func getMoodColors(mood string) []color.Color {
	switch mood {
	case "Happy":
		return []color.Color{
			color.RGBA{255, 223, 0, 255}, // Yellow
			color.RGBA{255, 165, 0, 255}, // Orange
			color.RGBA{255, 69, 0, 255},  // Red-Orange
		}
	case "Calm":
		return []color.Color{
			color.RGBA{135, 206, 235, 255}, // Sky Blue
			color.RGBA{176, 224, 230, 255}, // Powder Blue
			color.RGBA{173, 216, 230, 255}, // Light Blue
		}
	case "Excited":
		return []color.Color{
			color.RGBA{255, 0, 0, 255},   // Red
			color.RGBA{255, 127, 0, 255}, // Orange
			color.RGBA{255, 255, 0, 255}, // Yellow
		}
	default:
		return []color.Color{
			color.RGBA{128, 128, 128, 255}, // Gray
			color.RGBA{192, 192, 192, 255}, // Silver
			color.RGBA{169, 169, 169, 255}, // Dark Gray
		}
	}
}

// drawMoodGradient fills the image with a gradient using the provided colors
func drawMoodGradient(img *image.RGBA, colors []color.Color) {
	bounds := img.Bounds()
	width := bounds.Max.X
	height := bounds.Max.Y

	// Create a random seed for variation
	rand.Seed(time.Now().UnixNano())

	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			// Choose a random color from the mood colors
			colorIndex := rand.Intn(len(colors))
			img.Set(x, y, colors[colorIndex])
		}
	}
}

// applyGrayscale converts the image to grayscale
func applyGrayscale(img *image.RGBA) {
	bounds := img.Bounds()
	width := bounds.Max.X
	height := bounds.Max.Y

	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			r, g, b, a := img.At(x, y).RGBA()
			gray := uint16((r + g + b) / 3)
			img.Set(x, y, color.RGBA64{gray, gray, gray, uint16(a)})
		}
	}
}
