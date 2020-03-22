import { getWeatherData } from './getWeatherData.mjs'
import onChange from './on-change.mjs'

import weatherCard from './weather-card.mjs'

// let currentCity = 'San Diego'

let appState = {
    currentCity: 'San Diego',
    error: null,
    loading: false,
    fOrC: 'f',
    todaysDate: null,
    lat: null,
    lon: null,
    unit: 'imperial',

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

init()

function init() {
    $('.controls-setting').on('click', () => unitClickedHandler(event, appState))
    getData(appState)
}


function setAppState(dataObj) {
    appState = {
        ...dataObj
    }

    buildUi(appState)
}

// This function will be triggered by input submit
function getData(appState) {
    console.log('GETTING WEATHER DATA')
    getWeatherData(appState)
    .then(res => {
        setAppState(res)
    })
    .catch(err => console.log(err))
}




function buildUi(appState) {
    $('.five-day-wrapper').empty()

    let fiveDayForcast = buildFiveDayForcast(appState.forcast)
    $('.five-day-wrapper').append(fiveDayForcast)

    buildTodaysHighlights(appState.todaysWeather)
    buildSideWeatherUi(appState)
    
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

function buildSideWeatherUi(appState) {
    $('#current-weather-icon').attr('src', `http://openweathermap.org/img/wn/${appState.todaysWeather.icon}@2x.png`)
    $('.date-wrapper h2').text(moment().format('dddd'))
    $('.date-wrapper h3').text(moment().format('HH:mm a'))
    $('.weather-deg-lg').text(`${appState.todaysWeather.temp}°`)
}

function unitClickedHandler(event, appState) {
    let unit = $(event.target).attr('data-unit')

    $('.setting').each(function() {
        $(this).removeClass('active')
        if ($(this).attr('data-unit') === unit) {
            $(this).addClass('active')

        } 
    })

    appState = {
        ...appState,
        unit: unit
    }

    getData(appState)
}

