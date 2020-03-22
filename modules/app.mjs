import { getWeatherData } from './getWeatherData.mjs'

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
    console.log(appState)
}


getWeatherData(appState, 'San Diego')
    .then(res => {
        setAppState(res)
    })
