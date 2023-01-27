let searchInput = $('#search-input');
let searchButton = $('#search-button');
let apiKey = '72c81f035f8297343fdf3596162bbc5c';

let dayData = {
    day0: [],
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: []
}

let currentCity;

searchButton.on('click', function (e) {
    e.preventDefault();
    let searchInputValue = searchInput.val();
    currentCity = searchInputValue;
    let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + searchInputValue + '&appid=' + apiKey;
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
            } else if (dayData.day6.length === 0) {
                dayData.day6.push(day);
            }
        });

        // Some more filtering of this crazy data set
        filterData();
    });
});

let filterData = function () {
    // get the data from local storage

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
                renderDay(timeblock[0].date, maxTemp, maxHumidity, wind);
                // console.log(timeblock[0].date, maxTemp, maxHumidity, wind)
            });

        }
    }

    // renderHTML();
};

//TODO: if it's close to midnight, the date will be wrong as the data[0] will be the next day

let renderDay = function (date, maxTemp, maxHumidity, wind) {
    let html = `
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">${date}</h5>
            <p class="card-text">Max Temp: ${maxTemp}</p>
            <p class="card-text">Humidity: ${maxHumidity}</p>
            <p class="card-text">Wind: ${wind}</p>
            <img src="http://openweathermap.org/img/w/${icon}.png" alt="weather icon">
        </div>
    </div>
    `;
    // console.log(html)
    $('#forecast').append(html);
};

// Get todays weather
// $.ajax({
//     url: 'https://api.openweathermap.org/data/2.5/weather?q=' + searchInputValue + '&appid=' + apiKey,
//     method: 'GET'
// }).then(function (response) {
//     console.log('weather today?', response);
// });


