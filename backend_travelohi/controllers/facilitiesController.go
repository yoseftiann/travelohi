package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetFacilitiesByHotelID(c *gin.Context) {
	hotelID := c.Param("id")

	var hotel models.Hotel

	if err := initializers.DB.Preload("Facilities").First(&hotel, hotelID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hotel not found"})
		return
	}

	facilities := make([]string, len(hotel.Facilities))
	for i, facility := range hotel.Facilities {
		facilities[i] = facility.Name
	}

	c.JSON(http.StatusOK, gin.H{"facilities": facilities})
}

func GetRoomFacilitiesByHotelID(c *gin.Context) {
	roomID := c.Param("id")

	var room models.Room

	if err := initializers.DB.Preload("RoomFacilities").First(&room, roomID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	facilities := make([]string, len(room.RoomFacilities))
	for i, facility := range room.RoomFacilities {
		facilities[i] = facility.Name
	}

	c.JSON(http.StatusOK, gin.H{"facilities": facilities})
}
