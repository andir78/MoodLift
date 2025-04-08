package config

import (
	"os"
)

// Config holds the application configuration
type Config struct {
	Port         string
	GeminiAPIKey string
}

// Load loads the configuration from environment variables
func Load() (*Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000" // Default port
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		apiKey = "AIzaSyD_ZXCxfu1n14GXRJAulwT1frlmG1qj08I" // Default API key
	}

	return &Config{
		Port:         port,
		GeminiAPIKey: apiKey,
	}, nil
}
