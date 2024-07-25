
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
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Main from './Pages/main'; // Correct import path
import Favorite from "./Pages/favoritePage";
import * as Switch from "@radix-ui/react-switch";


// function handleClick() {
//   if (isMetric) {
//     isMetric = false;
//   } else {
//     isMetric = true;
//   }
// }

function App() {
  const [isMetric, setisMetric] = useState(false);

  const toggleTemperatureUnit = () => {
    setisMetric((previsMetric) => !previsMetric);

  };
  return (
    //  basename="/<weather-by-city-wedpage>"
    <BrowserRouter>
      <>
      <Heading
  trim="normal"
  style={{
    background: "var(--gray-a2)",
    borderTop: "1px dashed var(--gray-a7)",
    borderBottom: "1px dashed var(--gray-a7)",
    display: "flex",
    justifyContent: "space-between", // Align items to the left and right edges
    alignItems: "center", // Vertically center the items
    padding: "10px", // Add padding for spacing
  }}
>
  <Flex align="stretch" direction="row" gap="5">
    Every Weather&nbsp;
    <form>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Your form elements */}
      </div>
    </form>
  </Flex>
  <Flex align="center" direction="row" gap="10"> {/* Add gap between elements */}
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
          className="SwitchRoot"
          onCheckedChange={(e) => toggleTemperatureUnit()}
          checked={isMetric}
        >
          <Switch.Thumb className="SwitchThumb" />
        </Switch.Root>
      </div>
    </form>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>...</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <Link to="/">
            <DropdownMenu.Item>Main</DropdownMenu.Item>
          </Link>
          <Link to="/Favorite">
            <DropdownMenu.Item>Favorites</DropdownMenu.Item>
          </Link>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </Flex>
</Heading>

        {/* Define routes for different pages */}
        <Routes>
          <Route path="/" element={<Main isMetric={isMetric} />}>
            <Route index element={<Main />} />
          </Route>
          <Route path="/Favorite" element={<Favorite isMetric={isMetric} />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

  export default App;