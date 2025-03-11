import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useState for managing component state
import axios from "axios"; // Import Axios for making API requests
import WeatherCard from "./WeatherCard";
function Forecast() {
    const { city } = useParams(); // Get city name from URL
    // OpenWeatherMap API key (replace with your actual API key)
    const API_KEY = "60338c101e36b2f4e5f94eed0b67f3be";
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                // Get the 5-day forecast
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
                const forecastResponse = await axios.get(forecastUrl);
                setForecastData(forecastResponse.data.list);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching forecast data:", err);
                setError(
                    err.response ? err.response.data.message : err.message
                );
                setLoading(false);
            }
        };

        fetchForecast();
    }, [city]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    const getDayName = (dateString) => {
        const date = new Date(dateString); // Create a new Date object from the date string
        const today = new Date();
        if (
            today.toLocaleDateString("en-US", { weekday: "long" }) ===
            date.toLocaleDateString("en-US", { weekday: "long" })
        )
            return "Today";
        return date.toLocaleDateString("en-US", { weekday: "long" }); // Return the day name in 'long' format (e.g., "Monday")
    };

    // Group forecast data by weekdays
    const groupedData = forecastData.reduce((acc, item) => {
        const dayName = getDayName(item.dt_txt); // Get the day name from the date string
        if (!acc[dayName]) {
            acc[dayName] = []; // Initialize array for the day if it doesn't exist
        }
        acc[dayName].push(item); // Add the item to the array for the day
        return acc; // Return the accumulator
    }, {}); // Initial value of the accumulator is an empty object

    return (
        <>
            <div className="forecast-container">
                <Link to="/" className="back-link">
                    <i className="fas fa-arrow-left"></i>Go back
                </Link>
                <h1 className="forecast-header">
                    5-Day Weather Forecast for {city}
                </h1>
                <div className="forecast-content">
                    {Object.keys(groupedData).map((dayName, index) => (
                        <div key={index} className="forecast-day">
                            <h2 className="day-name">{dayName}</h2>{" "}
                            {/* Render the day name */}
                            {groupedData[dayName].map((item, subIndex) => (
                                <WeatherCard
                                    key={subIndex} // Unique key for each WeatherCard component
                                    time={new Date(
                                        item.dt * 1000
                                    ).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        hour12: true,
                                    })} // Convert the timestamp to a time string
                                    temperature={Math.round(item.main.temp)} // Pass temperature to WeatherCard
                                    description={item.weather[0].description} // Pass weather description to WeatherCard
                                    icon={item.weather[0].icon} // Pass weather icon to WeatherCard
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Forecast;
