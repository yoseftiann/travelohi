package initializers

import (
	"backend_travelohi/models"
)

func doMigration() {
	// Auto Migrate for each table
	DB.AutoMigrate(&models.User{}, &models.CreditCard{})
	DB.AutoMigrate(&models.OTP{})
	DB.AutoMigrate(&models.Promo{})
	DB.AutoMigrate(&models.Facility{}, &models.HotelReview{}, &models.Hotel{})
	DB.AutoMigrate(&models.RoomFacility{}, &models.Room{}, &models.RoomAvailability{})
	DB.AutoMigrate(&models.Flight{})
	DB.AutoMigrate(&models.Country{})

	DB.AutoMigrate(&models.HotelCart{})
}
