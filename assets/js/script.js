let searchInput = $('#search-input');
let searchButton = $('#search-button');
let apiKey = '72c81f035f8297343fdf3596162bbc5c';
let searchInputValue;

let dayData = {
    day0: [],
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: []
}

let searchHistory = [];

let currentCity;

searchButton.on('click', function (e) {
    e.preventDefault();
    let searchInputValue = searchInput.val();
    currentCity = searchInputValue;

    console.log('current city', currentCity)
    // if the field is not empty
    if (searchInputValue !== '') {
        if (!searchHistory.includes(searchInputValue)) {
            console.log('not in history, obnclick')
            getApiWeather(searchInputValue);
            addSearchToHistory(searchInputValue);
        } else {
            render5daySection();
        }
    }
})

let getApiWeather = function (searchInputValue) {
    let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchInputValue + '&appid=' + apiKey + '&units=metric';
    console.log('CALL API !!!!', searchInputValue)
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log('initial response', response)
        let sorted = [];

        response.list.forEach(function (timeblock) {
            var date = moment(timeblock.dt_txt).format('DD MM YY');
            var tempMax = timeblock.main.temp_max;
            var humidity = timeblock.main.humidity;
            var wind = timeblock.wind.speed;
            var icon = timeblock.weather[0].icon;
            sorted.push({   //pushing the data into the array
                date: date,
                tempMax: tempMax,
                humidity: humidity,
                wind: wind,
                icon: icon
            });
        });
       // get the unique dates from the array
        let uniqueDates = [...new Set(sorted.map(item => item.date))];
        // Clear the dayData object arrays for the new day
        dayData.day0 = [];
        dayData.day1 = [];
        dayData.day2 = [];
        dayData.day3 = [];
        dayData.day4 = [];
        dayData.day5 = [];
        // push all the data that matches each unique date into a new array to sort later
        uniqueDates.forEach(function (date) {
            let day = sorted.filter(function (item) {
                return item.date === date;
            });
            // push each day array into a new array
            if (dayData.day0.length === 0) {
                dayData.day0.push(day);
            } else if (dayData.day1.length === 0) {
                dayData.day1.push(day);
            } else if (dayData.day2.length === 0) {
                dayData.day2.push(day);
            } else if (dayData.day3.length === 0) {
               dayData.day3.push(day);
            } else if (dayData.day4.length === 0) {
                dayData.day4.push(day);
            } else if (dayData.day5.length === 0) {
                dayData.day5.push(day);
            }
        });

        localStorage.setItem(currentCity, JSON.stringify(dayData));
        localStorage.setItem('lastSearchedCity', currentCity);

        // Some more filtering of this crazy data set
        render5daySection();
    });
};

let addSearchToHistory = function (searchInputValue) {
    // add the search to the search history array
    searchHistory.push(searchInputValue);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    let html = `<li class="list-group-item">${searchInputValue}</li>`;
    $('#history').append(html);
};

// grab the data from local storage for this item if it exists, otherwise call the API
$(document).on('click', '.list-group-item', function (e) {
    e.preventDefault();
    let searchValue = $(this).text();
    currentCity = searchValue;
    if (!searchHistory.includes(searchValue)) {
        addSearchToHistory(searchValue);
        getApiWeather(searchValue);
    } else {
        render5daySection();
    }
});


let render5daySection = function () {
    // If we have some data for this city already, grab it from local storage and use it instead of calling the API
    if (localStorage.getItem(currentCity)) {
        dayData = JSON.parse(localStorage.getItem(currentCity));
    }
    // Empty the forecast section
    $('#forecast').empty();
    $('#today').empty();

    for (const key in dayData) {
        if (dayData.hasOwnProperty(key)) {
            let day = dayData[key];

            day.forEach(function (timeblock) {
                let maxTemp = Math.max.apply(null,
                    timeblock.map(function (o) {
                        return o.tempMax;
                    }));
                let maxHumidity = Math.max.apply(null,
                    timeblock.map(function (o) {
                        return o.humidity;
                    }));
                let wind = Math.max.apply(null,
                    timeblock.map(function (o) {
                        return o.wind;
                    }));
                renderDay(timeblock[0].date, maxTemp, maxHumidity, wind, timeblock[0].icon);
            });

        }
    }
};

//TODO: if it's close to midnight, the date will be wrong as the data[0] will be the next day

let renderDay = function (date, maxTemp, maxHumidity, wind, icon) {
    let today = moment().format('DD MM YY');
    let html;
    if (date === today) {
        html = `<div class="card">
            <div class="card-body">
                <h3 class="card-title">${currentCity} ${date} <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon"></h3>
                <p class="card-text">Max Temp: ${maxTemp}&deg;C</p>
                <p class="card-text">Humidity: ${maxHumidity}%</p>
                <p class="card-text">Wind: ${wind}m/s</p>

            </div>
         </div>`;
        $('#today').append(html);
    } else {
        html = `<div class="card">
            <div class="card-body">
                <h5 class="card-title">${currentCity} - ${date}</h5>
                <p class="card-text">Max Temp: ${maxTemp}&deg;C</p>
                <p class="card-text">Humidity: ${maxHumidity}%</p>
                <p class="card-text">Wind: ${wind}m/s</p>
                <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon">
            </div>
         </div>`;

         $('#forecast').append(html);
    }
};

// Load up something on the first visit
if (localStorage.getItem('lastSearchedCity')) {
    let lastSearchedCity = localStorage.getItem('lastSearchedCity');
    console.log('last searched city from storage',  lastSearchedCity )
    dayData = JSON.parse(localStorage.getItem(lastSearchedCity));
    currentCity = lastSearchedCity;
    // If we have a last searched city, get the data from local storage and render it
    render5daySection();
}

// if (localStorage.getItem('searchHistory')) {
//     searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
//     searchHistory.forEach(function (city) {
//         addSearchToHistory(city);
//     });
// }