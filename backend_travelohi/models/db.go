package models

import (
	"gorm.io/gorm"
)

var db *gorm.DB

// SetDB initializes the global DB connection to be used across models
func SetDB(database *gorm.DB) {
	db = database
}
