import React, { useState, useEffect } from 'react';
import '@radix-ui/themes/styles.css';
import { Card } from '@radix-ui/themes';
import { MinusIcon } from '@radix-ui/react-icons';
import '../styles.css';

function WeatherCard({ min, max, type, summeryNight, date, iconDay, iconNight, isFavorites, cityName, index }) {
  // Extracting the city name from the URL
  const cityNameFromUrl = cityName.split('/').filter((part) => part !== '')[4];

  // Capitalizing the first letter of the city name
  const formattedCityName = cityNameFromUrl.charAt(0).toUpperCase() + cityNameFromUrl.slice(1);

  // State to track whether the city name has been displayed
  const [cityNameDisplayed, setCityNameDisplayed] = useState(false);

  // Variable to track if formattedCityName has been displayed
  let displayedOnce = false;

  return (
    <>
      {isFavorites && index === 0 && (
        <div className="divdate">
          <h2 className="temprature">
            {formattedCityName}
          </h2>
        </div>
      )}
      <Card className={isFavorites && index === 0 ? 'weather-card first-card' : 'weather-card'}>
        <div className="card">
          <div className="left-div">
            <div className="divdate">
              <h2 className="innerdate">{new Date(date).toLocaleString(undefined, { weekday: 'long' })}</h2>
            </div>
            <div className="summerydaydiv">
              <img src={`https://developer.accuweather.com/sites/default/files/${iconDay}.png`} alt="Day icon" />
              <img src={`https://developer.accuweather.com/sites/default/files/${iconNight}.png`} alt="Night icon" />
            </div>
          </div>
          <div className="right-div">
            <div className="tempratures">
              <MinusIcon />
              <h2 className="temprature">
                {min}&deg; <label className="tempraturetype">{type}</label>
              </h2>
            </div>
            <div className="tempratures">
              <MinusIcon />
              <h2 className="temprature">
                {max}&deg; <label className="tempraturetype">{type}</label>
              </h2>
            </div>
          </div>
        </div>
      </Card>
      {cityNameDisplayed && (displayedOnce = true)}
    </>
  );
}

export default WeatherCard;
