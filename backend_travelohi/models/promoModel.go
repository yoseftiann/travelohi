package models

import (
	"time"

	"gorm.io/gorm"
)

type Promo struct {
	gorm.Model
	Image       string
	Title       string
	Description string
	Percent     int
	RedeemCode  string
	Type        string
	ExpiryDate  time.Time
}

func GetAllPromos() ([]Promo, error) {

	var promos []Promo

	result := db.Find(&promos)
	if result.Error != nil {
		return nil, result.Error
	}

	return promos, nil
}
