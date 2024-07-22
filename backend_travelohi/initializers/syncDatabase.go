package initializers

func SyncDatabase() {
	//Migrate
	doMigration()

	//Seeding
	seedPromos()
	seedHotels()
	seedFacilities()
	seedRoomFacilities()
	seedFlights()
	seedCountry()
	seedReview()
	// seedRoomAvailability()
	// seedCreditCard()
}
