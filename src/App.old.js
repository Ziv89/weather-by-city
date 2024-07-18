import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Search from "./components/search";
import { cities } from "./data/cities";
import "./App.css";
import WeatherCard from "./components/Card";
import { Fetch } from "react-data-fetching";
import "@radix-ui/themes/styles.css";
import { Theme, Button, Heading, Flex, Radio, Text } from "@radix-ui/themes";
import useLocalStorageState from "./data/useLocalStorageState";
import * as Toolbar from "@radix-ui/react-toolbar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import FavoriteCities from "./components/FavoriteCities";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import * as Switch from "@radix-ui/react-switch";

const defaultOptions = [];
var defaultOptionsTemp = [];
var weatherInfostring;
var isFahrenheit = true;


function handleClick() {
  if (isFahrenheit) {
    isFahrenheit = false;
  } else {
    isFahrenheit = true;
  }
}

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

function App() {
  const [localFavorites, setlocalFavorites] = 
    useLocalStorageState("localFavorites");

  const [search, setSearch] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityWeatherDate, setCityWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // useEffect(() => {

  //   setFavorites([...localFavorites, ...favorites]);

  //     setlocalFavorites(JSON.stringify(favorites));

  //   },[favorites])

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
    console.log(event);
    
    // setFavorites([...localFavorites, ...favorites]);

    if (!localFavorites) {
      setlocalFavorites(JSON.stringify([]));
    } else {
      const parsedFavorites = JSON.parse(localFavorites);
      
      if (Array.isArray(parsedFavorites)) {
        if (parsedFavorites.includes(event.id)) {
          // If event ID already exists, remove it
          const updatedFavorites = [...parsedFavorites, event.id];
          setlocalFavorites(JSON.stringify(updatedFavorites));
        } else {
          // If event ID doesn't exist, add it
          setlocalFavorites(JSON.stringify([...parsedFavorites, event.id]));
        }
      } else {
        // If parsedFavorites is not an array, initialize it as an empty array and add the event ID
        setlocalFavorites(JSON.stringify([event.id]));
      }
    }

    // console.log(event);

    //  setFavorites(event);
  };

  const onCitySelected = (event) => {
    console.log(event);
    setSelectedCity(event);
  };

  return (
    <Theme>
      {/* <Flex maxWidth="100%"> */}
      <Heading
        trim="normal"
        style={{
          background: "var(--gray-a2)",
          borderTop: "1px dashed var(--gray-a7)",
          borderBottom: "1px dashed var(--gray-a7)",
          display: "flex",
        }}
      >
        <Flex align="center" direction="row" gap="5">
          Every Weather
          <form>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label
                className="Label"
                htmlFor="airplane-mode"
                style={{ paddingRight: 15 }}
              >
                Metric
              </label>
              <Switch.Root
                onClick={(e) => {
                  handleClick();

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
                }}
                className="SwitchRoot"
                id="airplane-mode"
              >
                <Switch.Thumb className="SwitchThumb" />
              </Switch.Root>
            </div>
          </form>
          {/* <Flex asChild gap="2">
    <Text as="label" size="2">
      <Radio name="example" value="1" defaultChecked onSelect={handleClick()} />
      Metric
    </Text>
  </Flex> */}
          {/* <Flex asChild gap="2">
    <Text as="label" size="2">
      <Radio name="example" value="2" onChange={handleClick()} />
      Impirial
    </Text>
  </Flex> */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>…</DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  className="DropdownMenuItem"
                  onClick={(e) => {


                  }}
                >
                  localFavorites
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </Flex>
      </Heading>
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
        {/* <div className="buttondiv">
      <Button onClick={handleClick}>
 Change measurement
</Button>

                   </div> */}
        <div className="cards-container">
          {cityWeatherDate?.DailyForecasts?.map((forcast) => (
            <WeatherCard
              min={
                isFahrenheit
                  ? forcast.Temperature.Minimum.Value
                  : (
                      (5 / 9) *
                      (forcast.Temperature.Minimum.Value - 32)
                    ).toFixed(0)
              }
              max={
                isFahrenheit
                  ? forcast.Temperature.Maximum.Value
                  : (
                      (5 / 9) *
                      (forcast.Temperature.Maximum.Value - 32)
                    ).toFixed(2)
              }
              type={isFahrenheit ? forcast.Temperature.Maximum.Unit : "C"}
              summeryDay={forcast.Day.IconPhrase}
              summeryNight={forcast.Night.IconPhrase}
              date={forcast.Date}
              iconDay={forcast.Day.Icon>10 ? forcast.Day.Icon + "-s" : "0" + forcast.Day.Icon + "-s"}
              iconNight={forcast.Night.Icon + "-s"}
            ></WeatherCard>
          ))}
        </div>
        {/* <button className="btn btn-primary">Search</button> */}
      </div>
    </Theme>
  );
}

export default App;
