package middleware

import (
	"backend_travelohi/initializers"
	"backend_travelohi/models"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequiredAuth(c *gin.Context) {
	//Get Cookie
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		fmt.Println("DEBUG: Error ", err)
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	//Decode it
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			fmt.Printf("DEBUG: Unexpected signing method: %v\n", token.Header["alg"])
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET")), nil
	})

	if err != nil {
		fmt.Println("DEBUG: Token validation error:", err)
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		//Check the exp using float64
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			fmt.Println("DEBUG: Token has expired")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		//Find the user token sub
		var user models.User
		initializers.DB.First(&user, claims["sub"])

		if user.ID == 0 {
			fmt.Println("DEBUG: User not found")
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		//Attach
		c.Set("user", user)

		//Continue
		c.Next()
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
		// return
	}
}

func RequiredAdminRole(c *gin.Context) {
	// Assuming the user model has a Role field that defines the user's role
	user, exists := c.Get("user")
	if !exists {
		// If for some reason, the user is not set, this means the RequiredAuth middleware failed or was bypassed
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Missing or malformed token"})
		return
	}

	// Type assertion to access the User struct, adjust according to your actual user model
	userInfo, ok := user.(models.User) // Adjust models.User to match your actual user struct
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: User information is invalid"})
		return
	}

	if userInfo.Role != "admin" {
		// The user's role is not admin
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: User does not have admin privileges"})
		return
	}

	// If the user is an admin, continue to the next middleware/handler
	c.Next()
}
