package models

import "gorm.io/gorm"

type OTP struct {
	gorm.Model
	Email               string `gorm:"unique"`
	Code                string
	ExpiryTimeInMinutes string
}
