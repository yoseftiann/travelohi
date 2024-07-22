package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func generateRandomFourDigitNumber() string {
	rand.Seed(time.Now().UnixNano())

	return strconv.Itoa(rand.Intn(10000-1000) + 1000)
}

func GenerateUserOTP(c *gin.Context) {
	//When this called, user will have to input the email
	var body struct {
		Email           string
		Code            string
		expiryInMinutes string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	//Generate Code
	code := generateRandomFourDigitNumber()

	//Create OTP based on the data
	otp := models.OTP{Email: body.Email, Code: code, ExpiryTimeInMinutes: "5"}

	//Insert the data
	result := initializers.DB.Create(&otp)

	if result.Error != nil {
		fmt.Println(result.Error)
		return
	}

	//Send the email
	go SendOTPMail("./templates/otp-message.html", otp.Email, otp.Code)
}
