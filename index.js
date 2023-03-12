const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searhForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially needed variables

// for default tab

let currentTab = userTab;
//my api key
// const API_KEY = "9fafdb7be04ec8334971c56825822918";
//love bhai key
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");

//might possible coordinates are present in storage thats why initialy call this function
getfromSessionStorage();


//tab switch function logic
function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searhForm.classList.contains("active")) {
            //search form conainer is invisible ? if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searhForm.classList.add("active");
        }
        else {
            //previously on search tab now visible 'your weather' tab
            searhForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //now in 'your weather' tab so wheather dispaly has to show for user wheather for that lets check local storage first
            //for cordinates, if we haved saved them there
            getfromSessionStorage();
            //this function checks corinates in session storage
        }
    }
};

userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});


//checks if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //if local coordinates not found
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        //fetch users weather
        fetchUserWeatherInfo(coordinates);
    }
}

//API CALLING FUNC
async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader gif visible for showing that api call is ongoing to fetch weather details
    loadingScreen.classList.add("active");

    //API CALL
    try{
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        //my api link
        // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        //love bhai api link
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // this func put api data into 'user Information COntainer' UI
        renderWeatherInfo(data);
    }
    catch (err){
        // getting error here = check api
        alert("coordinates invalid, try again");
        loadingScreen.classList.remove("active");
        grantAccessContainer.classList.add("active");
    }
};


// weatherInfo is parameter passed in this func for the json object recived from api call for weather data
function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch elements in which we render the diffrent weather data

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherInfo object and put it in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windSpeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
};

//function to get geo location after getting longitude and latitude coordinates
function getLocation() {
    if(navigator.geolocation) {
        //this is geo location api/syntax for finding coordinates
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Your Browser doesnot have Geo Location support");
    }
};

//finding longitude and latitude coordinates
function showPosition(position) {
    //store value of coordinates in object
    const userCoordinates = {
        //syntax to find longi.. lati... on w3school
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
};


//grant location button on-click listner
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

// search button all functning start from here

const searchInput = document.querySelector("[data-seachInput]");

searhForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(cityName);
    }
});

//api call for search weather tab
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        //my api link
        // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?q=${city}&appid=${API_KEY}`);

        //love bhai api link
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch (err){
        // getting error here , check city api
        alert ("city api not working");
    }
}

