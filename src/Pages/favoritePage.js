
import React, { useState, useEffect } from 'react';
import { Theme } from '@radix-ui/themes';
import useLocalStorageState from '../data/useLocalStorageState';
import WeatherCard from '../components/Card';
import "@radix-ui/themes/styles.css";

const Favorite = ({ isMetric }) => {
  const [localFavorites, setLocalFavorites] = useLocalStorageState('localFavorites');
  const [cityWeatherData, setCityWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeatherForFavorites = async () => {
      try {
        if (localFavorites) {
          const parsedFavorites = JSON.parse(localFavorites);
          const promises = parsedFavorites.map(async (cityId) => {
            
            const response = await fetch(
              `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityId}?apikey=YwaQ5spXthCAbfnd8RpToPB5w7n8NpuZ&metric=true`
            );
            if (!response.ok) {
              throw new Error('Failed to fetch weather data');
            }
            return response.json();
          });
          const data = await Promise.all(promises);
          console.log("Weather data:", data); // Log weather data
          setCityWeatherData(data);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherForFavorites();
  }, [localFavorites]);
  
  console.log("City weather data:", cityWeatherData); // Log city weather data
  
  return (
    <Theme>
      <div className="App container mt-2 mb-3">
        <div className="cards-container">
          {cityWeatherData && cityWeatherData.map((cityData, cityIndex) => (
            <div key={cityIndex}>
              {cityData && cityData.DailyForecasts && cityData.DailyForecasts.map((forecast, forecastIndex) => (
                <WeatherCard
                  key={forecastIndex}
                  min={!isMetric ? forecast.Temperature.Minimum.Value : ((5 / 9) * (forecast.Temperature.Minimum.Value - 32)).toFixed(0)}
                  max={!isMetric ? forecast.Temperature.Maximum.Value : ((5 / 9) * (forecast.Temperature.Maximum.Value - 32)).toFixed(2)}
                  type={isMetric ? 'C' : 'F'}
                  summeryDay={forecast.Day.IconPhrase}
                  summeryNight={forecast.Night.IconPhrase}
                  date={forecast.Date}
                  iconDay={forecast.Day.Icon>10 ? forecast.Day.Icon + "-s" : "0" + forecast.Day.Icon + "-s"}
                  iconNight={forecast.Night.Icon>10 ? forecast.Night.Icon + "-s" : "0" + forecast.Night.Icon + "-s"} isFavorites={true} cityName={forecast.Link} index={forecastIndex} 
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Theme>
  );
};

export default Favorite;