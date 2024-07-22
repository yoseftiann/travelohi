import { IconDefinition, faHotel, faNewspaper, faPlane, faReceipt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

interface IAdminMenu {
    element: JSX.Element | JSX.Element[];
    name: string;
    icon: IconDefinition;
}

export const ADMIN_LIST: IAdminMenu[] = [
    {
        element: <></>,
        name: "Promo",
        icon: faReceipt
    },
    {
        element : <></>,
        name: "Hotel",
        icon: faHotel
    },
    {
        element: <></>,
        name: "Airline",
        icon: faPlane
    },
    {
        element: <></>,
        name: "User",
        icon: faUser
    },
    {
        element: <></>,
        name: "News",
        icon: faNewspaper
    }
]