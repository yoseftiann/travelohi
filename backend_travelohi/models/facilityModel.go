package models

import "gorm.io/gorm"

type Facility struct {
	gorm.Model
	Name   string
	Hotels []Hotel `gorm:"many2many:hotel_facilities"`
}

type RoomFacility struct {
	gorm.Model
	Name        string
	Description string
	Rooms       []Room `gorm:"many2many:room_room_facilities"`
}
