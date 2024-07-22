package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateRoom adds a new room to a hotel
// @Summary Add a new room
// @Description Adds a new room to a hotel with provided details such as type, price, capacity, hotel ID, facilities, and an image.
// @Tags rooms
// @Accept  multipart/form-data
// @Produce  json
// @Param   type        formData    string  true  "Type of the room"
// @Param   price       formData    string  true  "Price of the room"
// @Param   capacity    formData    string  true  "Capacity of the room"
// @Param   hotel_id    formData    string  true  "Hotel ID the room belongs to"
// @Param   facilities  formData    string  true  "JSON array of facility names"
// @Param   image       formData    file    true  "Image of the room"
// @Success 200         {object}    map[string]interface{}  "status: Room created successfully"
// @Failure 400         {object}    map[string]interface{}  "error: One or more required fields are empty / Invalid price format / Invalid capacity format / Invalid hotel ID format / Failed to parse facilities / Error while parsing image"
// @Failure 404         {object}    map[string]interface{}  "error: Hotel not found"
// @Failure 500         {object}    map[string]interface{}  "error: Failed to create room directory / Failed to save image file / Failed to create new room"
// @Router /hotel/room/create [put]
func CreateRoom(c *gin.Context) {
	fmt.Printf("Received form values - Price: %s, Capacity: %s, Hotel ID: %s\n", c.PostForm("price"), c.PostForm("capacity"), c.PostForm("hotel_id"))

	//Validation empty
	if c.PostForm("price") == "" || c.PostForm("capacity") == "" || c.PostForm("hotel_id") == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "One or more required fields are empty",
		})
		return
	}

	//Form Value
	typee := c.PostForm("type")
	price, priceErr := strconv.ParseFloat(c.PostForm("price"), 64)
	capacity, capacityErr := strconv.ParseInt(c.PostForm("capacity"), 10, 32)
	hotel_id, hotelIDErr := strconv.ParseInt(c.PostForm("hotel_id"), 10, 32)

	if priceErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}
	if capacityErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid capacity format"})
		return
	}
	if hotelIDErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid hotel ID format"})
		return
	}

	//Room Facility
	roomFacilitiesJSON := c.PostForm("facilities")

	var roomFacilityNames []string

	if err := json.Unmarshal([]byte(roomFacilitiesJSON), &roomFacilityNames); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse facilities",
		})
		return
	}

	var facilities []models.RoomFacility
	if len(roomFacilityNames) > 0 {
		initializers.DB.Where("name IN ?", roomFacilityNames).Find(&facilities)
	}

	//Find the corresponding hotel
	var hotel models.Hotel
	if err := initializers.DB.First(&hotel, "id = ?", c.PostForm("hotel_id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Hotel not found"})
		return
	}

	//Go to folder of the current hotel, then make a subfolder to store room named
	dirPath := filepath.Join("public/hotels", hotel.Name, typee)
	if err := os.MkdirAll(dirPath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room directory"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error while parsing image"})
		return
	}

	imagePath := filepath.Join(dirPath, filepath.Base(file.Filename))

	// Save file to static server
	if err := c.SaveUploadedFile(file, imagePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image file"})
		return
	}

	//Instantiate object
	room := models.Room{
		Type:           typee,
		Price:          price,
		Capacity:       int32(capacity),
		Image:          imagePath,
		HotelID:        uint(hotel_id),
		RoomFacilities: facilities,
	}

	result := initializers.DB.Create(&room)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create new room"})
		return
	}

	//Success
	c.JSON(http.StatusOK, gin.H{
		"status": "Room created successfully",
	})
}

func GetRoomByID(c *gin.Context) {
	roomID := c.Param("id")
	var room models.Room

	result := initializers.DB.Preload("Hotel").Where("id = ?", roomID).First(&room)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Room not found",
			})

			return
		}
	}

	c.JSON(http.StatusOK, room)
}
