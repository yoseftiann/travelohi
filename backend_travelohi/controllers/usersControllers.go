package controllers

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func UpdateSecurityData(c *gin.Context) {

}

func UpdateImage(c *gin.Context) {

}

func UpdatePersonalData(c *gin.Context) {
	var body struct {
		FirstName   string `json:"firstName"`
		LastName    string `json:"lastName"`
		DOB         string `json:"dob"`
		Email       string `json:"email"`
		Address     string `json:"address"`
		PhoneNumber string `json:"phoneNumber"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	// Check for empty fields, assuming gender can be optional
	if body.FirstName == "" || body.LastName == "" || body.Email == "" || body.PhoneNumber == "" || body.Address == "" || body.DOB == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "All fields except gender are required and must not be empty",
		})
		return
	}

	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	currentUser, ok := userInterface.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assert user type"})
		return
	}

	//Have the updated value
	updateData := models.User{
		FirstName:   body.FirstName,
		LastName:    body.LastName,
		DOB:         body.DOB,
		Email:       body.Email,
		PhoneNumber: body.PhoneNumber,
		Address:     body.Address,
	}
	result := initializers.DB.Model(&currentUser).Updates(updateData)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update profile",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profile updated successfully",
	})
}

func Login(c *gin.Context) {
	//Get the email and pass
	var body struct {
		Email    string
		Password string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	//Look up requested User
	var user models.User
	initializers.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email or password",
		})
		return
	}

	// Not logged in 2 place
	if user.IsLoggedIn {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User is logged in already",
		})
		return
	}

	//User not banned
	if user.IsBanned {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User is banned",
		})
		return
	}

	//Compare sent in pass with saved user pass
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email or password",
		})

		return
	}

	//Generate a jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Minute * 30).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	// Update logged in boolean
	user.IsLoggedIn = true
	initializers.DB.Save(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create jwt token",
		})

		return
	}

	//Send it back then
	//Make a cookie of jwt token
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("Authorization", tokenString, 60*30, "", "", true, true)

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
	})
}

func Signup(c *gin.Context) {
	var body struct {
		Email           string
		Password        string
		ConfirmPassword string
		DOB             string
		FirstName       string
		LastName        string
		Image           string
		Subscribe       bool
		Gender          string
		Question        string
		Answer          string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	fmt.Printf("Received body: %+v\n", body.Subscribe)

	//Validation Firstname & Lastname cant have symbol and number
	var namePattern = regexp.MustCompile(`^[A-Za-z\s]+$`)
	if !namePattern.MatchString(body.FirstName) || !namePattern.MatchString(body.LastName) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Names must not contain numbers or symbols",
		})
		return
	}

	//Validation Email V
	var existingUser models.User
	exist := initializers.DB.Where("email = ?", body.Email).First(&existingUser)
	if exist.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email is already registered"})
		return
	}

	//Newsletter
	if !body.Subscribe {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Subscription must be agreed to"})
		return
	}

	//Email @ and ends with .com / .COM
	var emailPattern = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$`)
	if !emailPattern.MatchString(body.Email) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email must be valid and end with .com",
		})

		return
	}

	//Validation First Name and Last Name V
	if len(body.FirstName) < 5 || len(body.LastName) < 5 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Name doesnt meet the required length",
		})
		return
	}

	//Validation Age V
	dobStr := body.DOB
	dob, err := time.Parse("2006-01-02", dobStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid date of birth format",
		})
		return
	}

	age := time.Now().Year() - dob.Year()

	if age < 13 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Age cant be below 13",
		})
		return
	}

	//Validate Gender V
	if body.Gender == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Gender must be selected",
		})
		return
	}

	//Gender must Male | Female
	if body.Gender != "Male" && body.Gender != "Female" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Gender must be either 'Male' or 'Female'",
		})
		return
	}

	// Validation Password V
	if len(body.Password) < 8 || len(body.Password) > 30 || body.Password != body.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password error",
		})
		return
	}

	//Allowed Character for password
	var (
		hasUpperCase    = regexp.MustCompile(`[A-Z]`)
		hasLowerCase    = regexp.MustCompile(`[a-z]`)
		hasSpecialChars = regexp.MustCompile(`[\@\!\#\$\%\^\&\*\(\)\_\+\.\,\;\:\<\>\?\/\~\-\=\[\]\{\}\|\\]`)
	)

	if !hasUpperCase.MatchString(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must contain at least one uppercase letter"})
		return
	}
	if !hasLowerCase.MatchString(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must contain at least one lowercase letter"})
		return
	}
	if !hasSpecialChars.MatchString(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must contain at least one special character"})
		return
	}

	//Hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	//Create user berdasarkan data yang ada di fields
	user := models.User{Email: body.Email, Password: string(hash), FirstName: body.FirstName, LastName: body.LastName, Image: body.Image, DOB: body.DOB, Question: body.Question, Answer: body.Answer, Subscribe: body.Subscribe}

	result := initializers.DB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Failed to create user",
			"message": result.Error.Error(),
		})
		return
	}

	//Respond
	c.JSON(http.StatusOK, gin.H{})

	//Send Success Email
	fullName := body.FirstName + " " + body.LastName
	go SendSignupSuccess("./templates/success-registration.html", user.Email, fullName)
}

func Validate(c *gin.Context) {
	user, exists := c.Get("user")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized: Missing or malformed token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": user,
	})
}

func LoginOTP(c *gin.Context) {
	var body struct {
		Email string
		Code  string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	//Validate Email Exist
	var otp models.OTP
	initializers.DB.First(&otp, "email = ?", body.Email)

	if otp.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email doesnt have an OTP",
		})
		return
	}

	//Validate OTP Exist
	if otp.Code != body.Code {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid OTP code",
		})
		return
	}

	//Validate OTP Life span
	expiryDuration, err := strconv.Atoi(otp.ExpiryTimeInMinutes)
	if err != nil {
		fmt.Println("Error converting expiry duration : ", err)
	}

	expiryTime := otp.CreatedAt.Add(time.Duration(expiryDuration) * time.Minute)
	if time.Now().After(expiryTime) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "OTP has been expired",
		})
		return
	}

	//OTP is Valid
	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}

func SetNewPassword(c *gin.Context) {
	var body struct {
		Email           string
		NewPassword     string
		ConfirmPassword string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	var user models.User
	result := initializers.DB.First(&user, "email = ?", body.Email)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}

	//Check new == confirm
	if body.NewPassword != body.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to confirm the new password",
		})

		return
	}
	println("chcek compare")
	//Check if it is same
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.NewPassword))

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid password, found as duplicate",
		})

		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), 10)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash the password",
		})
		return
	}
	user.Password = string(hash)
	initializers.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{
		"message": "Password updated successfully",
	})
}

func SetNewImage(c *gin.Context) {
	var body struct {
		Email string
		Image string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	var user models.User
	result := initializers.DB.First(&user, "email = ?", body.Email)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}
	user.Image = body.Image
	if err := initializers.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update image",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Password updated successfully",
	})
}

func ValidateAnswer(c *gin.Context) {
	var body struct {
		Email    string
		Question string
		Answer   string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var user models.User
	initializers.DB.First(&user, "email = ?", body.Email)

	if user.Answer != body.Answer {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid answer",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func ValidateEmail(c *gin.Context) {
	var body struct {
		Email string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}

	var user models.User
	result := initializers.DB.Select("Question", "Answer").Where("email = ?", body.Email).First(&user)

	fmt.Println("result : ", result)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Process initiated",
		})

		return
	}

	if user.IsBanned {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User is banned!",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func SetNewsletter(c *gin.Context) {
	var body struct {
		Email      string
		Newsletter bool
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	var user models.User
	result := initializers.DB.First(&user, "email = ?", body.Email)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})

		return
	}

	//Update the user newsletter with the new value
	user.Subscribe = body.Newsletter
	updateResult := initializers.DB.Save(&user)

	if updateResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update user",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Newsletter subscription updated successfully",
	})

}

func Logout(c *gin.Context) {
	c.SetCookie("Authorization", "", -1, "/", "", true, true)
	//Name = authorization
	//Value = ""
	//MaxAge = -1
	//Path = '/' atau entire domain
	//Secure + Http Only = true

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully logged out",
	})
}

func GetAllUsers(c *gin.Context) {
	users := models.FetchAllUser()
	if users == nil {
		log.Println("No users found or there was an error.")
	} else {
		for _, user := range users {
			log.Printf("User: %+v\n", user)
		}
	}

	c.JSON(http.StatusOK, users)
}

func SetIsBanned(c *gin.Context) {
	var body struct {
		ID       int
		IsBanned bool
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	var user models.User
	result := initializers.DB.First(&user, "id = ?", body.ID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})

		return
	}

	user.IsBanned = body.IsBanned
	initializers.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{
		"message": "User IsBanned has been updated",
	})
}

func AddBalance(c *gin.Context) {
	userID := c.Param("userID")

	id, err := strconv.Atoi(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid user ID",
		})
		return
	}

	//Find the user
	var user models.User
	result := initializers.DB.First(&user, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
	}

	user.Balance += 10

	// Save the updated user back to the database
	if err := initializers.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update user balance",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User balance has been updated successfully",
	})
}

func PayWithWallet() {
	// Get the amount

	// Check the amount

	// Send email
}
