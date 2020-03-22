import { getWeatherData } from './getWeatherData.mjs'
import onChange from './on-change.mjs'

import weatherCard from './weather-card.mjs'

let appState = {
    error: null,
    loading: false,
    fOrC: 'f',
    todaysDate: null,
    lat: null,
    lon: null,

    todaysWeather: {
        name: null,
        temp: null,
        feelsLike: null,
        pressure: null,
        humidity: null,
        clouds: null,
        temp_max: null,
        wind_speed: null,
        wind_direction: null,
        description: null,
        icon: null
    }
}


function setAppState(dataObj) {
    appState = {
        ...dataObj
    }

    buildUi(dataObj)
}

// This function will be triggered by input submit
getWeatherData(appState, 'San Diego')
    .then(res => {
        setAppState(res)
    })



function buildUi(appState) {
    let fiveDayForcast = buildFiveDayForcast(appState.forcast)
    $('.five-day-wrapper').append(fiveDayForcast)

    buildTodaysHighlights(appState.todaysWeather)
    
}

function buildFiveDayForcast(forcast) {
    let days = []
    for (let key in forcast) {
        days.push(weatherCard(forcast[key]))
    }

    return days
}

function buildTodaysHighlights(weatherData) {
    $('#humidity h2').text(`${weatherData.humidity}%`)
    // WIND
    $('#wind h2').text(`${weatherData.wind_speed} mph`)
    $('#wind span').text(`${weatherData.wind_direction}°`)
    // UV 
    $('#uv-index h2').text(`${weatherData.uvIndex}`)
    // FEELS LIKE
    $('#feels-like h2').text(`${weatherData.feelsLike}°`)
    // $('#feels-like .card-content span').text('3')
    // PRESSURE
    $('#pressure h2').text(`${weatherData.pressure} hPa`)
    $('#pressure h2').text(`${weatherData.pressure} hPa`)
    // CLOUDS
    $('#clouds h2').text(`${weatherData.clouds}%`)
}

