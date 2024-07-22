package models

import "gorm.io/gorm"

type HotelReview struct {
	gorm.Model
	Name        string
	Rating      float64
	Description string
	Hotels      []Hotel `gorm:"many2many:hotel_hotel_reviews"`
}
