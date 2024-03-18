import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import Search from "./components/search";
import { cities } from "./data/cities";
import "./App.css";


const defaultOptions = [];
for (let i = 0; i < 10; i++) {
  defaultOptions.push(`option ${i}`);
  defaultOptions.push(`suggesstion ${i}`);
  defaultOptions.push(`advice ${i}`);
}

function App() {

  let arr = [];
  
  for (let key in cities) {
      arr.push(cities[key]);
  }

  alert(arr);
  const [options, setOptions] = useState([]);
  // alert(defaultOptions);
  const onInputChange = (event) => {
    setOptions(
      arr.filter((id) => id.includes(event.target.value))
    );
  };

  return (
    <div className="App container mt-2 mb-3">
      <Search options={options} onInputChange={onInputChange} />
      <br />
      {/* <button className="btn btn-primary">Search</button> */}
    </div>
  );
}

export default App;