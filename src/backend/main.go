package main

import (
	"fmt"
	"log"
	"net/http"
	"path/filepath"

	"moodlift/config"
	"moodlift/generator"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// GenerateImageRequest represents the request body for image generation
type GenerateImageRequest struct {
	Mood      string `json:"mood" binding:"required"`
	Size      int    `json:"size" binding:"required,min=0,max=100"`
	Grayscale bool   `json:"grayscale"`
}

// GenerateImageResponse represents the response for image generation
type GenerateImageResponse struct {
	ImageURL string `json:"imageUrl"`
}

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load configuration: ", err)
	}

	// Initialize the image generator
	imgGen, err := generator.NewImageGenerator("static/images", cfg.GeminiAPIKey)
	if err != nil {
		log.Fatal("Failed to initialize image generator: ", err)
	}

	router := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Frontend URL
	config.AllowMethods = []string{"GET", "POST", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type"}
	router.Use(cors.New(config))

	// Serve static files
	router.Static("/static", "./static")

	// API routes
	api := router.Group("/api")
	{
		api.POST("/generate-image", func(c *gin.Context) {
			handleGenerateImage(c, imgGen)
		})
	}

	// Start server
	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	if err := router.Run(serverAddr); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

func handleGenerateImage(c *gin.Context, imgGen *generator.ImageGenerator) {
	var req GenerateImageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate the image
	imagePath, err := imgGen.GenerateImage(req.Mood, req.Size, req.Grayscale)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate image"})
		return
	}

	// Get the port from the request
	port := c.Request.Host
	if port == "" {
		port = "localhost:5000" // Default fallback
	}

	// Convert the file path to a URL with full server address
	imageURL := fmt.Sprintf("http://%s/static/images/%s", port, filepath.Base(imagePath))

	response := GenerateImageResponse{
		ImageURL: imageURL,
	}

	c.JSON(http.StatusOK, response)
}
