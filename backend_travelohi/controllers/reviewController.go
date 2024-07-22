package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetReviewsByHotelID(c *gin.Context) {
	hotelID := c.Param("id")

	var hotel models.Hotel

	if err := initializers.DB.Preload("Reviews").First(&hotel, hotelID).Error; err != nil {
		// If no hotel is found with the provided ID, return a 404 error.
		c.JSON(http.StatusNotFound, gin.H{"error": "Hotel not found"})
		return
	}

	// Since you want to return the whole HotelReview objects, you can directly return the `Reviews` slice.
	// Ensure that your HotelReview model does not contain any sensitive information before sending it to the client.
	c.JSON(http.StatusOK, gin.H{"reviews": hotel.Reviews})
}
