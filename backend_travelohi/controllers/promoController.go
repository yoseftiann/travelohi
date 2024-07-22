package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllPromos(c *gin.Context) {
	promos, err := models.GetAllPromos()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": "Failed to fetch promos",
		})
		return
	}

	c.JSON(http.StatusOK, promos)
}

// CreatePromo adds a new promotional code to the system
// @Summary Add new promo code
// @Description Adds a new promotional code with details including type, discount, code, expiry, and image.
// @Tags promo
// @Accept  multipart/form-data
// @Produce  json
// @Param   type     formData    string  true  "Type of the promo"
// @Param   discount  formData    int     true  "Discount percentage"
// @Param   code      formData    string  true  "Unique code for the promo"
// @Param   expiry    formData    string  true  "Expiry date of the promo"
// @Param   image     formData    file    true  "Image associated with the promo"
// @Success 200       {object}    map[string]interface{}  "success: {}"
// @Failure 400       {object}    map[string]interface{}  "error: Invalid discount value / Invalid expiry date format / Promo with this RedeemCode already exists / Error while parsing / Failed to save file"
// @Failure 500       {object}    map[string]interface{}  "error: Failed to create new promo"
// @Router /promo/create [post]
func CreatePromo(c *gin.Context) {
	// Form Value
	typee := c.PostForm("type")
	discountStr := c.PostForm("discount")
	code := c.PostForm("code")
	expiryStr := c.PostForm("expiry")

	// Typecast to int
	discount, err := strconv.Atoi(discountStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid discount value",
		})
		return
	}

	// Typecast to time'
	const layout = "2006-01-02" // Adjust layout as needed based on the expected format
	expiry, err := time.Parse(layout, expiryStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid expiry date format",
		})
		return
	}

	// Validate promo code cant duplicate
	var existingPromo models.Promo
	found := initializers.DB.Where("redeem_code = ?", code).First(&existingPromo)
	if found.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Promo with this RedeemCode already exists",
		})
		return
	}

	// Parse Image
	file, err := c.FormFile("image")
	fmt.Printf("Received file: %+v\n", file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error while parsing",
		})

		return
	}
	fmt.Println("Parse success")

	imagePath := filepath.Join("public/promos", filepath.Base(file.Filename))

	// Save to static server
	if err := c.SaveUploadedFile(file, imagePath); err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": "Failed to save file",
		})

		return
	}

	// Create model
	promo := models.Promo{
		Image:      imagePath,
		Percent:    discount,
		RedeemCode: code,
		ExpiryDate: expiry,
		Type:       typee,
	}

	result := initializers.DB.Create(&promo)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create new promo",
		})

		return
	}

	// Success
	c.JSON(http.StatusOK, gin.H{})
}

func GetPromoByCode(c *gin.Context) {
	// Param from endpoints
	promoCode := c.Param("code")
	// promoCode := "YNGAN"

	var promo models.Promo
	result := initializers.DB.Where("redeem_code = ?", promoCode).First(&promo)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Promo not found",
			})
			return
		}
	}

	c.JSON(http.StatusOK, promo)
}
