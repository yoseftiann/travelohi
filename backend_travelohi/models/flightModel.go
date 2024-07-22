package models

import (
	"time"
)

type Flight struct {
	FlightID        string
	AirplaneID      string
	Departure       string
	DepartureCode   string
	DepartureTime   time.Time
	Destination     string
	DestinationCode string
	DestinationTime time.Time
}

type DestinationCount struct {
	Destination string
	Count       int
}

func Top5Destination() ([]DestinationCount, error) {
	var destinationCounts []DestinationCount

	result := db.Model(Flight{}).
		Select("destination, count(destination) as count").
		Group("destination").
		Order("count DESC").
		Limit(5).
		Find(&destinationCounts)

	if result.Error != nil {
		return nil, result.Error
	}

	return destinationCounts, nil
}
