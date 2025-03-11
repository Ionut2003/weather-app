import { useState, useEffect } from "react"; // Import useState for managing component state
import { Link } from "react-router-dom";
import axios from "axios"; // Import Axios for making API requests

export const Weather = () => {
    // State to store user-input city name
    const [city, setCity] = useState("");

    // Puts empty array to localStorage if it doesn't exist
    if (!localStorage.getItem("weatherList"))
        localStorage.setItem("weatherList", JSON.stringify([]));

    // Updates the deleted data
    const [deletedData, setDeletedData] = useState(
        JSON.parse(localStorage.getItem("weatherList"))
    );

    // State to store weather data fetched from the API
    const [weather, setWeather] = useState(
        JSON.parse(localStorage.getItem("weatherList"))
    );

    // OpenWeatherMap API key (replace with your actual API key)
    const API_KEY = "60338c101e36b2f4e5f94eed0b67f3be";

    useEffect(() => {
        // get geolocation
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getCityName(latitude, longitude);
        });
    }, []);

    // Get city name
    async function getCityName(lat, lon) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        // Add new city to weatherList
        setWeather((prevWeatherList) => [
            ...prevWeatherList,
            {
                name: data.name,
                isCurrentLocation: true,
                temperature: data.main.temp,
                description: data.weather[0].description,
            },
        ]);
    }

    // Function to fetch weather data from the API
    const fetchWeather = async () => {
        if (!city) return; // Prevent API call if city is empty

        // OpenWeatherMap API URL with dynamic city and API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        setCity("");

        try {
            const response = await axios.get(url); // Send GET request to API
            // Prevent API call if city is already in the list
            let alreadyMet = false; // makes the function stop
            weather.forEach((weather) => {
                if (weather.name === response.data.name) alreadyMet = true;
            });

            if (alreadyMet) {
                alert("This city is already in the list!");
                return;
            }
            // Add new city to weatherList
            setWeather((prevWeatherList) => [
                ...prevWeatherList,
                {
                    name: response.data.name,
                    isCurrentLocation: false,
                    temperature: response.data.main.temp,
                    description: response.data.weather[0].description,
                },
            ]);

            // Stores the data to local storage
            const storedData = JSON.parse(localStorage.getItem("weatherList"));
            storedData.push({
                name: response.data.name,
                isCurrentLocation: false,
                temperature: response.data.main.temp,
                description: response.data.weather[0].description,
            });
            localStorage.setItem("weatherList", JSON.stringify(storedData));
        } catch (error) {
            console.error("Error fetching data:", error); // Log any errors
        }
    };

    // Delete weather
    const deleteWeather = (index) => {
        // Deletes weather from list
        setWeather((prevList) => prevList.filter((_, i) => i !== index));
        setDeletedData(() => {
            return JSON.parse(localStorage.getItem("weatherList")).filter(
                (_, i) => i !== index
            );
        });
    };

    useEffect(() => {
        localStorage.setItem("weatherList", JSON.stringify(deletedData));
    }, [deletedData]);

    // Handle key down event
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            fetchWeather();
        }
    };

    return (
        <>
            <h1 className="title">Your day to day weather!</h1>
            {/* Display weather details if data is available */}
            <div id="weather-section">
                {weather.map((weather, index) => (
                    <div key={index} className="weather-details">
                        <h2>
                            {weather.name}
                            {weather.isCurrentLocation && (
                                <span className="geolocation-span">
                                    {" "}
                                    (Your location)
                                </span>
                            )}
                        </h2>
                        <p>
                            <span>Temperature:</span> {Math.round(weather.temperature)}°C
                        </p>
                        <p>
                            <span>Condition:</span> {weather.description}
                        </p>
                        <div className="forecast-delete-container">
                            <Link to={`/forecast/${weather.name}`}>
                                See forecast
                            </Link>
                            {!weather.isCurrentLocation && (
                                <img
                                    onClick={() => deleteWeather(index)}
                                    width="30"
                                    height="30"
                                    src="https://img.icons8.com/sf-regular-filled/48/FA5252/filled-trash.png"
                                    alt="filled-trash"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input and button container */}
            <div className="input-btn-container">
                {/* Input field for entering city name */}
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)} // Update state as user types
                    onKeyDown={handleKeyDown} // Add key down event handler
                    placeholder="Enter city"
                />
                {/* Button to fetch weather data */}
                <button className="get-weather-btn" onClick={fetchWeather}>
                    Get Weather
                </button>
            </div>
        </>
    );
};
