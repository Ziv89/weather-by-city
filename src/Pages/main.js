

import Search from "../components/search";

import useLocalStorageState from "../data/useLocalStorageState";
import { Theme, Button, Heading, Flex, Radio, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import WeatherCard from "../components/Card";
import "../App.css";
import { React, useState, useEffect } from "react";
const defaultOptions = [];
var defaultOptionsTemp = [];
var weatherInfostring;
var DRFSA= false;




function setCities() {
  for (let i = 0; i < defaultOptionsTemp.length; i++) {
    const keys = Object.keys(defaultOptionsTemp[i]);

    defaultOptions.push({
      id: `${defaultOptionsTemp[i][keys[1]]}`,
      city: `${defaultOptionsTemp[i][keys[4]]}`,
    });

    //   defaultOptions.push({
    //  id: defaultOptionsTemp[i][keys[1]],
    //    city: defaultOptionsTemp[i][keys[4]]
    //  });

    //  defaultOptions.push(`${defaultOptionsTemp[i][keys[4]]}`);
  }
  // console.log(defaultOptions);
}

function settingWeatherinfo(childData) {
  weatherInfostring = childData;
  //  console.log(weatherInfostring);
}



const Main = ({ isMetric }) => {
  const [localFavorites, setlocalFavorites] = 
    useLocalStorageState("localFavorites");
    

    
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityWeatherDate, setCityWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    if (search) {
      fetch(
        "http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=rWcJtE6eqJ18yZR2VONEpBLSEedKAY22&q=" +
          search +
          "",
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          defaultOptionsTemp = data;
          setCities();
        })
        .catch((error) => console.log(error));
    }
  }, [search]);

  useEffect(() => {
    if (selectedCity) {
      fetch(
        "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
          selectedCity.id +
          "?apikey=YwaQ5spXthCAbfnd8RpToPB5w7n8NpuZ&metric=true/",
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setCityWeatherData(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedCity]);

  // alert(defaultOptions);
  const setWeatherinfo = (childData) => {
    settingWeatherinfo(childData);
  };

  const onInputChange = (event) => {
    setOptions(
      defaultOptions.filter(
        (option) => option.city.includes(event.target.value),
        setSearch(event.target.value)
      )
    );
  };

  const onAddCityToFavorite = (event) => {
    if (event && event.id) {
      console.log(event);
    
      if (!localFavorites) {
        setlocalFavorites(JSON.stringify([event.id]));
      } else {
        const parsedFavorites = JSON.parse(localFavorites);
    
        if (Array.isArray(parsedFavorites)) {
          if (parsedFavorites.includes(event.id)) {
            const updatedFavorites = parsedFavorites.filter((id) => id !== event.id);
            setlocalFavorites(JSON.stringify(updatedFavorites));
          } else {
            setlocalFavorites(JSON.stringify([...parsedFavorites, event.id]));
          }
        } else {
          setlocalFavorites(JSON.stringify([event.id]));
        }
      }
    }
    
  };

  const onCitySelected = (event) => {
    console.log(event);
    setSelectedCity(event);
  };

  

  return (
    <Theme>
    {/* <Flex maxWidth="100%"> */}

 
    {/* </Flex> */}
    <div className="App container mt-2 mb-3">
      {/* <p>Parent message: {weatherinfo}</p> */}

      <Search
        options={options}
        onInputChange={onInputChange}
        citySelected={onCitySelected}
        addCityToFavorite={onAddCityToFavorite}
      />
      {selectedCity ? (
        <h2>
          The Weather for the next five days in {selectedCity.city} is :{" "}
        </h2>
      ) : null}

      <div className="cards-container">
        {cityWeatherDate?.DailyForecasts?.map((forcast,forecastIndex) => (
          <WeatherCard
            min={
              !isMetric
                ? forcast.Temperature.Minimum.Value
                : (
                    (5 / 9) *
                    (forcast.Temperature.Minimum.Value - 32)
                  ).toFixed(0)
            }
            max={
              !isMetric
                ? forcast.Temperature.Maximum.Value
                : (
                    (5 / 9) *
                    (forcast.Temperature.Maximum.Value - 32)
                  ).toFixed(2)
            }
            type={!isMetric ? forcast.Temperature.Maximum.Unit : "C"}
            summeryDay={forcast.Day.IconPhrase}
            summeryNight={forcast.Night.IconPhrase}
            date={forcast.Date}
            iconDay={forcast.Day.Icon>10 ? forcast.Day.Icon + "-s" : "0" + forcast.Day.Icon + "-s"}
            iconNight={forcast.Night.Icon>10 ? forcast.Night.Icon + "-s" : "0" + forcast.Night.Icon + "-s"} isFavorites={false} cityName={forcast.Link} index={forecastIndex} 
          ></WeatherCard>
        ))}
      </div>
      {/* <button className="btn btn-primary">Search</button> */}
    </div>
  </Theme>
  );
};

export default Main;
