package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email       string `gorm:"unique" json:"Email"`
	Password    string `json:"Password"`
	Subscribe   bool   `json:"Subscribe"`
	DOB         string `json:"DOB"`
	FirstName   string `json:"FirstName"`
	LastName    string `json:"LastName"`
	Image       string `json:"Image"`
	Question    string `gorm:"column:question" json:"Question"`
	Answer      string `gorm:"column:answer" json:"Answer"`
	PhoneNumber string `json:"PhoneNumber"`
	Address     string `json:"Address"`
	IsBanned    bool   `json:"IsBanned"`
	IsLoggedIn  bool   `json:"IsLoggedIn"`
	Role        string `json:"Role"`
	Balance     int

	HotelCarts []HotelCart
}

func FetchAllUser() []User {
	var users []User
	result := db.Find(&users)

	if result.Error != nil {
		return nil
	}

	return users
}
