package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UpdateCreditCard(c *gin.Context) {
	creditCardID := c.Param("creditCardID")

	var body struct {
		CardNumber     string `json:"cardNumber"`
		CardHolderName string `json:"cardHolderName"`
		CVV            string `json:"cvv"`
		City           string `json:"city"`
		State          string `json:"state"`
		ZIPCode        string `json:"zipCode"`
		Expiry         string `json:"expiry"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	//Check no empty field
	if body.CardNumber == "" || body.CardHolderName == "" || body.CVV == "" || body.City == "" || body.State == "" || body.ZIPCode == "" || body.Expiry == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields are required and must not be empty",
		})
		return
	}

	id, err := strconv.ParseUint(creditCardID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid credit card ID format"})
		return
	}

	var creditCard models.CreditCard
	result := initializers.DB.First(&creditCard, "user_id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Credit card not found"})
		return
	}

	// Update the credit card details
	updateData := models.CreditCard{
		CardNumber:     body.CardNumber,
		CardHolderName: body.CardHolderName,
		CVV:            body.CVV,
		City:           body.City,
		State:          body.State,
		ZIPCode:        body.ZIPCode,
		Expiry:         body.Expiry,
	}
	initializers.DB.Model(&creditCard).Updates(updateData)

	c.JSON(http.StatusOK, gin.H{"message": "Credit card updated successfully"})
}

func GetCreditCardFromUser(c *gin.Context) {
	var creditCard models.CreditCard
	userID := c.Param("userID")

	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	result := initializers.DB.Where("user_id = ?", uint(id)).First(&creditCard)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": result.Error.Error(),
		})
	}

	c.JSON(http.StatusOK, creditCard)
}
