package models

import "gorm.io/gorm"

type Room struct {
	gorm.Model
	Type           string
	Price          float64
	Capacity       int32
	Image          string
	HotelID        uint
	Hotel          Hotel              `gorm:"foreignKey:HotelID"`
	RoomFacilities []RoomFacility     `gorm:"many2many:room_room_facilities"`
	Availabilities []RoomAvailability `gorm:"foreignKey:RoomID"`
}
