package main

import (
	"backend_travelohi/controllers"
	"backend_travelohi/docs"
	"backend_travelohi/initializers"
	"backend_travelohi/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	r := gin.Default()

	//Server static folder
	r.Static("/public", "./public")

	//Allow CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
		} else {
			c.Next()
		}
	})

	// Swagger
	docs.SwaggerInfo.BasePath = ""
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	r.POST("/signup", controllers.Signup)
	r.POST("/login", controllers.Login)
	r.GET("/validate", middleware.RequiredAuth, controllers.Validate)
	r.GET("/validate/admin", middleware.RequiredAuth, middleware.RequiredAdminRole, controllers.Validate)
	r.POST("/generate-otp", controllers.GenerateUserOTP)
	r.POST("/otp-login", controllers.LoginOTP)
	r.POST("/validate-email", controllers.ValidateEmail)
	r.POST("/validate-answer", controllers.ValidateAnswer)
	r.POST("/set-new-password", controllers.SetNewPassword)
	r.GET("/fetch-promos", controllers.GetAllPromos)
	r.GET("/fetch-users", controllers.GetAllUsers)
	r.GET("/fetch-hotels", controllers.GetAllHotels)
	r.GET("/get-popular-destination", controllers.GetPopularDestination)
	r.PUT("/user/update-profile", middleware.RequiredAuth, controllers.UpdatePersonalData)
	r.POST("/user/logout", controllers.Logout)
	r.PUT("/user/update-image", controllers.SetNewImage)
	r.GET("/user/:userID/credit-card", controllers.GetCreditCardFromUser)
	r.PUT("/user/:creditCardID/update/credit-card", controllers.UpdateCreditCard)
	r.PUT("/user/update/newsletter", controllers.SetNewsletter)
	r.PUT("/user/update/isbanned", controllers.SetIsBanned)
	r.PUT("/hotel/create", controllers.CreateHotel)
	r.PUT("/hotel/room/create", controllers.CreateRoom)
	r.PUT("/promo/create", controllers.CreatePromo)
	r.POST("/newsletter/broadcast/new", controllers.BroadcastNewsletter)
	r.GET("/hotel/detail/:id", controllers.GetHotelByID)
	r.GET("/hotel/:id/get-facilities", controllers.GetFacilitiesByHotelID)
	r.GET("/hotel/:id/get-reviews", controllers.GetReviewsByHotelID)
	r.GET("/hotel/:id/available-rooms", controllers.FetchAvailableRooms)
	r.GET("/hotel/room/:id/detail", controllers.GetRoomByID)
	r.GET("/hotel/room/:id/get-facilities", controllers.GetRoomFacilitiesByHotelID)
	r.POST("/hotel/cart/add", controllers.AddHotelCart)
	r.GET("/hotel/cart/:id/fetch", controllers.FetchCart)
	r.PUT("/hotel/cart/update/date", controllers.SetCartDate)
	r.GET("/promo/:code/get", controllers.GetPromoByCode)
	r.GET("/user/:userID/add-balance", controllers.AddBalance)
	r.DELETE("/cart/remove", controllers.RemoveCart)
	r.Run()
}

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDb()
	initializers.SyncDatabase()
}
