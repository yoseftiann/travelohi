package controllers

import (
	"backend_travelohi/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetPopularDestination(c *gin.Context) {
	destinationCounts, err := models.Top5Destination()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	//Extract names
	destinations := make([]string, len(destinationCounts))
	for i, dc := range destinationCounts {
		destinations[i] = dc.Destination
	}

	imagePaths, err := models.GetCountryImages(destinations)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	mappedDestinations := make([]map[string]interface{}, len(destinationCounts))
	for i, dc := range destinationCounts {
		mappedDestinations[i] = map[string]interface{}{
			"destination": dc.Destination,
			"count":       dc.Count,
			"imagePath":   imagePaths[dc.Destination],
		}
	}

	c.JSON(http.StatusOK, gin.H{"data: ": mappedDestinations})
}
