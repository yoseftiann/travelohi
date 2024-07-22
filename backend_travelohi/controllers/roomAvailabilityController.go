package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func FetchAvailableRooms(c *gin.Context) {
	hotelIDStr := c.Param("id")
	checkInStr := c.Query("checkin")
	checkOutStr := c.Query("checkout")

	hotelID, err := strconv.ParseUint(hotelIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid hotel ID format."})
		return
	}

	checkIn, err := time.Parse("2006-01-02", checkInStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid check-in date format. Use YYYY-MM-DD."})
		return
	}

	checkOut, err := time.Parse("2006-01-02", checkOutStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid check-out date format. Use YYYY-MM-DD."})
		return
	}

	// Validation Date
	if !checkOut.After(checkIn) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Check-out date must be after check-in date."})
		return
	}

	var rooms []models.Room
	result := initializers.DB.Joins("JOIN hotels ON hotels.id = rooms.hotel_id").
		Joins("JOIN room_availabilities ON room_availabilities.room_id = rooms.id").
		Where("hotels.id = ? AND room_availabilities.date >= ? AND room_availabilities.date <= ?", hotelID, checkIn, checkOut).
		Find(&rooms)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, rooms)

	// lanjut reference ke Rooms based on its ID
}
