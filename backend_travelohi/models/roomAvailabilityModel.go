package models

import (
	"time"

	"gorm.io/gorm"
)

type RoomAvailability struct {
	gorm.Model
	Date        time.Time
	IsAvailable bool
	RoomID      uint
	Room        Room
}
