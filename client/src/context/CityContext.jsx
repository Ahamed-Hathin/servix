import { createContext, useContext, useState, useEffect } from "react";

const CityContext = createContext();

export const useCity = () => useContext(CityContext);

const TN_CITIES = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
    "Tirunelveli",
    "Vellore",
    "Erode",
    "Thanjavur",
];

export function CityProvider({ children }) {
    const [city, setCity] = useState(() => {
        return localStorage.getItem("selectedCity") || "";
    });
    const [showSelector, setShowSelector] = useState(false);

    useEffect(() => {
        if (city) {
            localStorage.setItem("selectedCity", city);
        }
    }, [city]);

    const selectCity = (c) => {
        setCity(c);
        setShowSelector(false);
    };

    return (
        <CityContext.Provider
            value={{ city, selectCity, showSelector, setShowSelector, cities: TN_CITIES }}
        >
            {children}
        </CityContext.Provider>
    );
}
