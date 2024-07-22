package models

type Country struct {
	Name  string
	Image string
}

func GetCountryImages(destinations []string) (map[string]string, error) {
	var countries []Country
	result := db.Where("name IN ?", destinations).Find(&countries)
	if result.Error != nil {
		return nil, result.Error
	}

	imageMap := make(map[string]string)
	for _, country := range countries {
		imageMap[country.Name] = country.Image
	}
	return imageMap, nil
}
