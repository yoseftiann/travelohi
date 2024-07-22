package models

type CreditCard struct {
	UserID         uint `gorm:"primaryKey"`
	User           User `gorm:"foreignKey:UserID"`
	CardNumber     string
	CardHolderName string
	CVV            string
	City           string
	State          string
	ZIPCode        string
	Expiry         string
}
