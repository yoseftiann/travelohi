package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetHotelByID(c *gin.Context) {
	hotelID := c.Param("id")
	var hotel models.Hotel

	result := initializers.DB.Where("id = ?", hotelID).First(&hotel)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Hotel not found",
			})

			return
		}
	}

	c.JSON(http.StatusOK, hotel)
}

// GetAllHotels retrieves all hotels from the database
// @Summary Retrieves all hotels
// @Description Gets a list of all the hotels available in the database.
// @Tags hotels
// @Accept json
// @Produce json
// @Success 200 {array} models.Hotel
// @Failure 500 {object} map[string]interface{} "Error: Failed to retrieve hotels"
// @Router /fetch-hotels [get]
func GetAllHotels(c *gin.Context) {
	hotels, err := models.GetAllHotels()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": "Failed hotels",
		})
		return
	}

	c.JSON(http.StatusOK, hotels)
}

func CreateHotel(c *gin.Context) {
	//Form Value
	name := c.PostForm("name")
	address := c.PostForm("address")
	description := c.PostForm("description")
	rating, ratingErr := strconv.ParseFloat(c.PostForm("rating"), 64)
	price, priceErr := strconv.ParseFloat(c.PostForm("price"), 64)

	if ratingErr != nil || priceErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid numerical values for rating or price",
		})
		return
	}

	//Facilities
	facilitiesJSON := c.PostForm("facilities")

	var facilityNames []string

	if err := json.Unmarshal([]byte(facilitiesJSON), &facilityNames); err != nil {
		// Handle error if the JSON is malformed
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to parse facilities",
		})
		return
	}

	var facilities []models.Facility
	if len(facilityNames) > 0 {
		initializers.DB.Where("name IN ?", facilityNames).Find(&facilities)
	}

	fmt.Println("Success data and folder created")
	dirPath := filepath.Join("public/hotels", name)

	// Parse Image
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error while parsing",
		})
		return
	}
	fmt.Println("Parse success")

	imagePath := filepath.Join(dirPath, filepath.Base(file.Filename))

	//Save file to static server
	if err := c.SaveUploadedFile(file, imagePath); err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": "Failed to save file",
		})

		return
	}

	hotel := models.Hotel{
		Image:       imagePath,
		Name:        name,
		Location:    address,
		Rating:      rating,
		Price:       price,
		Description: description,
		Stars:       3, //default value of every hotel
		Facilities:  facilities,
	}

	result := initializers.DB.Create(&hotel)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create new hotel",
		})

		return
	}

	// Success
	c.JSON(http.StatusOK, gin.H{})
}
