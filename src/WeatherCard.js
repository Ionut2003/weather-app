import React from "react";

function WeatherCard({ time, temperature, humidity, description, icon }) {
    // Determine the icon based on the weather description
    // Determine the icon based on the weather description
    const iconSrc = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    return (
        <div className="weather-card">
            <div className="weather-card-details">
                <h3 className="weather-time">{time}</h3>
                <p className="weather-temp">
                    Temperature: <span>{temperature} °C</span>
                </p>
                <p className="weather-desc">
                    Description: <span>{description}</span>
                </p>
            </div>
            <img
                className="weather-icon"
                src={iconSrc}
                alt="No weather icon"
                width="100"
                height="100"
            />
        </div>
    );
}

export default WeatherCard;
