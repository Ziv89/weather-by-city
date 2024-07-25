
import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import data from "./ListData.json"
import {Dropdown} from 'react-bootstrap'
// import cities from "./cities";
import Select from 'react-select';
import { debounce } from '../utilis/debounce'; 
import Card from './Card';
import '@radix-ui/themes/styles.css';
import { Theme, Button,TextField } from '@radix-ui/themes'
import {HeartIcon,MagnifyingGlassIcon,HeartFilledIcon} from '@radix-ui/react-icons'
var keys;
var citydetails;

function Search(props) {
  const { options, onInputChange, citySelected, addCityToFavorite } = props;
  const ulRef = useRef(null);
  const inputRef = useRef();

  const [favoriteCities, setFavoriteCities] = useState([]);
  const [citydetails, setCityDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (localStorage.getItem("localFavorites")) {
      const storedFavorites = JSON.parse(localStorage.getItem("localFavorites"));
      setFavoriteCities(storedFavorites);
    }
  }, []);

  useEffect(() => {
    setIsFavorite(isCityInFavorites(citydetails?.id));
  }, [citydetails]);


  useEffect(() => {
    setIsButtonDisabled(searchInput.trim() || !citydetails || !citydetails.city);
  }, [searchInput, citydetails]);
  
  const handleClick = (e) => {
    e.preventDefault();
    addCityToFavorite(citydetails);
    setIsFavorite(!isFavorite);
  }

  const handleCitySelect = (city) => {
    setCityDetails(city);
    citySelected(city);
    setIsButtonDisabled(false);
    ulRef.current.style.display = 'none';
    inputRef.current.value = city.LocalizedName;
  };

  const handleSearchButtonClick = () => {
    inputRef.current.value = searchInput;
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    if (ulRef.current) {
      inputRef.current.addEventListener('click', (event) => {
        event.stopPropagation();
        ulRef.current.style.display = 'flex';
        onInputChange(event);
      });
      document.addEventListener('click', (event) => {
        if (ulRef.current) { // Add a null check before accessing style
          ulRef.current.style.display = 'none';
        }
      });
    }
  }, []);
  const isCityInFavorites = (cityId) => {
    return favoriteCities.includes(cityId);
  };




  const onInputChangeWrapper = (e) => {
    onInputChange(e);
    const inputValue = e.target.value;
    const city = options.find(option => option.city.toLowerCase() === inputValue.toLowerCase());
    setCityDetails(city || null);
    setSearchInput(inputValue);
    setIsButtonDisabled(!inputValue.trim() || !city);
  };

  return (
    <Theme>
      <div className="search-button">
        <div className="search-bar-dropdown">
          <TextField.Root placeholder="Search City" autoComplete='true' ref={inputRef} onChange={debounce(onInputChangeWrapper, 300)}>
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Button onClick={handleClick} disabled={isButtonDisabled}>
            <div>
              {isFavorite ? (
                <HeartFilledIcon />
              ) : (
                <HeartIcon />
              )}
            </div>
          </Button>
          <ul id="results" className="list-group" ref={ulRef} style={{ overflow: 'hidden' }}>
            {options.map((option, index) => {
              return (
                <button
                type="button"
                key={index}
                onClick={(e) => {
                  inputRef.current.value = option.city;
                  setCityDetails(option);
                  citySelected(option);
                  setIsButtonDisabled(false); // Enable button when a city is selected
                }}
                className="list-group-item list-group-item-action"
              >
                {option.city}
              </button>
              );
            })}
          </ul>
        </div>
      </div>
    </Theme>
  );
}

export default Search;