package models

import (
	"gorm.io/gorm"
)

type Hotel struct {
	gorm.Model
	Image       string
	Name        string
	Location    string
	Rating      float64
	Price       float64
	Description string
	Stars       int32
	Facilities  []Facility `gorm:"many2many:hotel_facilities"`
	Room        []Room
	Reviews     []HotelReview `gorm:"many2many:hotel_hotel_reviews"`
}

func GetAllHotels() ([]Hotel, error) {
	var hotels []Hotel

	result := db.Find(&hotels)
	if result.Error != nil {
		return nil, result.Error
	}

	return hotels, nil
}
