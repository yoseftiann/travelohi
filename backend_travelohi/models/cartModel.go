package models

import (
	"time"

	"gorm.io/gorm"
)

type HotelCart struct {
	gorm.Model
	UserID       uint
	Quantity     int
	RoomID       uint
	Room         Room `gorm:"foreignKey:RoomID"`
	CheckInDate  time.Time
	CheckOutDate time.Time
}
