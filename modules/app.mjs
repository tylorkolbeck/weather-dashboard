import { getWeatherData } from './getWeatherData.mjs'
import { updateStateWithLocalStorage, updateLocalStorageWithSearches, clearLocalStorage } from './local-storage.mjs'

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
    storedSearches: null,

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
    // Listen for change in unit
    $('.controls-setting').on('click', () => unitClickedHandler(event, appState))
    // listen for input submit of new city
    $('#input-city-search').on('submit', formSubmitHandler)
    $('#clear-recent-searches-btn').on('click', handleClearRecentSearches)

    // look for recent searches in localStorage
    appState = updateStateWithLocalStorage(appState)
    getData(appState)
    buildRecentSearchCard(appState)

}


function setAppState(dataObj) {
    appState = {
        ...dataObj
    }

    updateLocalStorageWithSearches(appState.storedSearches)
    buildUi(appState)
    buildRecentSearchCard(appState)
}

// This function will be triggered by input submit
function getData(appState) {
    getWeatherData(appState)
        .then(res => {
            $('#error-text').text('')
            setAppState({
                ...res,
                storedSearches: {
                    ...appState.storedSearches,
                    [res.todaysWeather.name]: {
                        temp: res.todaysWeather.temp
                    }
                }
            })
        })
        .catch(err => {
            $('#error-text').text('City Not Found')
        })
}


function buildUi(appState) {
    clearUI()
    if (appState.storedSearches) {
        $('#clear-recent-searches-btn').css('display', 'block')

    }
    $('#current-city').text(appState.todaysWeather.name)

    let fiveDayForcast = buildFiveDayForcast(appState.forcast)
    $('.five-day-wrapper').append(fiveDayForcast)

    buildTodaysHighlights(appState)
    buildSideWeatherUi(appState)
}

function clearUI() {
    $('.five-day-wrapper').empty()
}

function buildFiveDayForcast(forcast) {
    let days = []
    for (let key in forcast) {
        days.push(weatherCard(forcast[key]))
    }

    return days
}

function buildTodaysHighlights(appState) {
    const { todaysWeather: weatherData } = appState

    $('#humidity h2').text(`${weatherData.humidity}%`)
    // WIND
    $('#wind h2').text(`${weatherData.wind_speed} ${appState.unit === 'imperial' ? 'mph' : 'kph'}`)
    $('#wind span').text(`${weatherData.wind_direction}°`)
    // UV 
    $('#uv-index h2').text(`${weatherData.uvIndex}`)
    weatherData.uvIndex > 8 ? $('.uv-scale').css('background', '#c4292e') : $('.uv-scale').css('background', '#32a852')
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

    $('.setting').each(function () {
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

function formSubmitHandler(event) {
    event.preventDefault()
    let inputValue = $(event.target).children('input').val()
    $(event.target).children('input').val('')

    let newState = {
        ...appState,
        currentCity: inputValue
    }

    getData(newState)
}


function buildRecentSearchCard(appState) {
    let stored = { ...appState.storedSearches }

    let searchWrapper = $('.recent-search-wrapper')

    searchWrapper.empty()

    // let searchCount = 0


    for (let key in stored) {
        let divEl = $('<div>').addClass('recent')
        divEl.attr('data-city', key)
        let nameEl = $('<h2>').text(key)
        let tempEl = $('<p>').text(`${stored[key].temp}°`)
        divEl.append(nameEl, tempEl)
        $(divEl).on('click', searchHistoryCardClickedHandler)
        searchWrapper.prepend(divEl)
    }

    // If stored searches length greater than 3 then show scroll indicator
    if (Object.keys(stored).length > 2) {
        $('#scroll-indicator').css('display', 'flex')
    }
}

function searchHistoryCardClickedHandler(event) {
    let city = $(event.target).attr('data-city')

    let newState = {
        ...appState,
        currentCity: city
    }

    getData(newState)
}

function handleClearRecentSearches(event) {
    let stateClone = {...appState}
    stateClone.storedSearches = null
    clearLocalStorage()
    $('#clear-recent-searches-btn').css('display', 'none')

    setAppState(stateClone)
}