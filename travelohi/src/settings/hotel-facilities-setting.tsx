import { IconDefinition, faDumbbell, faHandshake, faHouse, faJugDetergent, faKitchenSet, faParking, faPersonBooth, faPersonSwimming, faQuestionCircle, faSmoking, faSpa, faSun, faSunPlantWilt, faSwimmingPool, faUtensils, faWifi } from "@fortawesome/free-solid-svg-icons";

export const HOTEL_FACILITIES_LIST: { name: string, description?: string, icon: IconDefinition}[] = [
    { icon: faUtensils, name: "Restaurant", description: "A place within the hotel where guests can dine." },
    { icon: faSpa, name: "Spa", description: "A facility offering health and beauty treatments." },
    { icon: faPersonSwimming, name: "Swimming Pool", description: "An area for guests to swim and relax." },
    { icon: faDumbbell, name: "Gym", description: "A place equipped for physical exercise." },
    { icon: faWifi, name: "Free WiFi", description: "Internet access provided to guests at no extra cost." },
    { icon: faParking, name: "Parking", description: "A space provided for guest vehicles." },
    { icon: faPersonBooth, name: "Room Service", description: "A service that allows guests to order food and drinks to their room." },
    { icon: faHandshake, name: "Conference Rooms", description: "Rooms designed for meetings and events." },
    { icon: faJugDetergent, name: "Laundry Service", description: "A service for cleaning guests' clothes." }
];

export const ROOM_FACILITIEST_LIST: { name: string, description?: string,icon: IconDefinition }[] = [
    { icon: faSmoking,name: "Smoking", description: "Designated for guests who prefer smoking." },
    { icon: faSwimmingPool,name: "Pool View", description: "Access to a swimming pool, providing relaxation and recreation." },
    { icon: faHouse,name: "Balcony", description: "An outdoor space attached to the room for guests to enjoy." },
    { icon: faKitchenSet,name: "Kitchenette", description: "A small kitchen area with basic appliances for convenience." },
    { icon: faSun,name: "Sunset View", description: "Rooms with west-facing views, offering stunning sunset vistas in the evening." },
    { icon: faSunPlantWilt,name: "Sunrise View", description: "East-facing rooms that provide a beautiful view of the sunrise each morning." },
];

export function getIconByName(facilityName: string): IconDefinition {
    const facility = HOTEL_FACILITIES_LIST.find(facility => facility.name === facilityName);
    return facility? facility.icon : faQuestionCircle;
}

export function getRoomIconByName(facilityName: string): IconDefinition {
    const facility = ROOM_FACILITIEST_LIST.find(facility => facility.name === facilityName);
    return facility? facility.icon : faQuestionCircle;
}


