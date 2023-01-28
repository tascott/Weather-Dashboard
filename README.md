# Module 8 Server-Side APIs: Weather Dashboard

## Description

This application takes a user-inputted city and displays the current weather, and the forecast for the next 5 days. The users search history is shown below the search box. 


## Installation

Just clone or download the repository, and open index.html in your browser. No console viewing is required.

## Usage

Enter a city in the search box and press search. The current weather and next 5 days forecast is shown. This entry is added to the history below the search box. Each of these is clickable and will show that citys weather again. 


[Link to working site](https://tascott.github.io/Weather-Dashboard)

## Limitations

To avoid too many API calls, the weather data itself is saved to localstorage. On searching, if we see data for that city in local storage we display that instead. This could mean that the data is old, so I had to add a button to refresh the data. If I wasn't concerned about limits on the API calls I would skip this and just call the API with every search. 

In an effort to reduce API calls I also tried to use the forecast API for todays data. It gives weather in 3 hour intervals (from the time of the call), so if the current time is after 9pm, the first data set is for the next day - meaning there is NO 'today' data at all. As such there is a second call to get current weather in the code, if it hasn't been found previously.


## Screenshot
<img width="564" alt="Screenshot 2023-01-15 at 20 10 31" src="https://user-images.githubusercontent.com/18272434/215295133-2e20cfca-89ae-4928-8db3-5e46b29a24eb.png">


## Credits

N/A


## License

N/A

