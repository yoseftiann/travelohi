package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddHotelCart(c *gin.Context) {
	// Form Value
	userID, userErr := strconv.ParseUint(c.PostForm("userid"), 10, 32)
	roomID, roomErr := strconv.ParseUint(c.PostForm("roomid"), 10, 32)

	checkInDateString := c.PostForm("checkindate")
	checkOutDateString := c.PostForm("checkoutdate")

	// Parsing
	if userErr != nil || roomErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID / Invalid room ID"})
		return
	}

	fmt.Println("User ID : ", userID)
	fmt.Println("Room ID : ", roomID)

	const layout = "2006-01-02"

	checkInDate, err := time.Parse(layout, checkInDateString)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error parsing check in date",
		})

		return
	}

	checkOutDate, err := time.Parse(layout, checkOutDateString)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error parsing check in date",
		})

		return
	}

	// Cek kalau dia ada sama apa ga
	var hotelCart models.HotelCart
	result := initializers.DB.Where("user_id = ? AND room_id = ?", userID, roomID).First(&hotelCart)

	// If belom ada roomID dan userID nya, maka kita add baru
	if result.Error == gorm.ErrRecordNotFound {
		newHotelCart := models.HotelCart{
			UserID:       uint(userID),
			RoomID:       uint(roomID),
			Quantity:     1,
			CheckInDate:  checkInDate,
			CheckOutDate: checkOutDate,
		}
		result := initializers.DB.Create(&newHotelCart)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create hotel cart"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Hotel cart created with quantity 1"})
	} else if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
	} else {
		// Else kita tambahin quantity nya aja
		hotelCart.Quantity += 1
		initializers.DB.Save(&hotelCart)
		c.JSON(http.StatusOK, gin.H{"message": "Hotel cart quantity incremented"})
	}
}

func FetchCart(c *gin.Context) {
	// Use params
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)

	if err != nil {
		// It's good practice to handle potential errors from strconv.ParseUint
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid cart ID"})
		return
	}

	uintUserID := uint(userID)

	carts, err := fetchUserCartByID(uintUserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Cart not found"})
		return
	}

	// Return the cart details (consider how you want to include room details)
	c.JSON(http.StatusOK, gin.H{"cart": carts})
}

func fetchUserCartByID(userID uint) ([]models.HotelCart, error) {
	var carts []models.HotelCart
	result := initializers.DB.Preload("Room.Hotel").Where("user_id = ?", userID).Find(&carts)
	if result.Error != nil {
		return nil, result.Error
	}

	return carts, nil
}

func SetCartDate(c *gin.Context) {
	// Post form
	hotelCartID, err := strconv.ParseUint(c.PostForm("id"), 10, 64)

	checkInDateString := c.PostForm("checkindate")
	checkOutDateString := c.PostForm("checkoutdate")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid hotel cart ID",
		})
		return
	}

	const layout = "2006-01-02"

	checkInDate, err := time.Parse(layout, checkInDateString)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error parsing check in date",
		})

		return
	}

	checkOutDate, err := time.Parse(layout, checkOutDateString)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error parsing check in date",
		})

		return
	}

	//Validation check out date gaboleh <= check in date
	if !checkOutDate.After(checkInDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Check-out date must be after check-in date."})
		return
	}
	// Find the Record
	var hotelCart models.HotelCart
	result := initializers.DB.First(&hotelCart, hotelCartID)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Hotel Cart Not Found",
		})

		return
	}

	hotelCart.CheckInDate = checkInDate
	hotelCart.CheckOutDate = checkOutDate

	if err := initializers.DB.Save(&hotelCart).Error; err != nil {
		c.JSON(500, gin.H{
			"error": "Failed to update Hotel Cart",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Hotel Cart updated successfully",
	})
}

// RemoveCart removes a cart based on its ID
// @Summary Remove a cart
// @Description Removes a cart by its ID provided in the form data.
// @Tags cart
// @Accept  x-www-form-urlencoded
// @Produce  json
// @Param   id   formData   string  true  "Cart ID"
// @Success 200  {object}   map[string]interface{}  "message: Cart removed successfully"
// @Failure 400  {object}   map[string]interface{}  "error: Invalid cart ID format"
// @Failure 404  {object}   map[string]interface{}  "message: Cart not found"
// @Failure 500  {object}   map[string]interface{}  "error: Failed to remove cart"
// @Router /cart/remove [delete]
func RemoveCart(c *gin.Context) {
	cartID, err := strconv.ParseUint(c.PostForm("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid cart ID format",
		})
		return
	}

	// Attempt to delete the cart by ID
	result := initializers.DB.Delete(&models.HotelCart{}, cartID)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to remove cart",
		})
		return
	}

	// Check if no rows were affected (meaning the cart was not found)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Cart not found",
		})
		return
	}

	// Return success message
	c.JSON(http.StatusOK, gin.H{
		"message": "Cart removed successfully",
	})
}
