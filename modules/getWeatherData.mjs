

export function getWeatherData(appState, cityName) {
    return _doGetWeatherData(appState, cityName)
}


async function _doGetWeatherData(appState, cityName) {
    // set loading to true
    let appid = '&appid=15b205abad1b5e1fb9ef943d6eccf32c'
    let unit = '&units=imperial'
    if (cityName) {
        let weatherQueryString = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}${appid}${unit}`
        let fiveDayQueryString = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}${appid}${unit}`

        let weather = await $.ajax({url: weatherQueryString, method: 'GET'})
        let uvQueryString = `https://api.openweathermap.org/data/2.5/uvi?lat=${weather.coord.lat}&lon=${weather.coord.lon}${appid}${unit}`

        let uvIndex = await $.ajax({url: uvQueryString, method: 'GET'})

        let forcast = await $.ajax({url: fiveDayQueryString, method: 'GET'})
        
        return setTodaysData(appState, {...weather, uvIndex: uvIndex.value, forcast: filterDaysData(forcast)})
        // set loading to false
    }
}

function setTodaysData(appState, todaysData) {
    let newState = {...appState}
    newState.lat = todaysData.coord.lat
    newState.lon = todaysData.coord.lon
    newState.todaysWeather.name = todaysData.name
    newState.todaysWeather.temp = todaysData.main.temp
    newState.todaysWeather.feelsLike = todaysData.main.feels_like
    newState.todaysWeather.pressure = todaysData.main.pressure
    newState.todaysWeather.humidity = todaysData.main.humidity,
    newState.todaysWeather.clouds = todaysData.clouds.all
    newState.todaysWeather.temp_max = todaysData.main.temp_max
    newState.todaysWeather.wind_speed = todaysData.wind.speed
    newState.todaysWeather.wind_direction = todaysData.wind.deg
    newState.todaysWeather.description = todaysData.weather[0].description
    newState.todaysWeather.icon = todaysData.weather[0].icon
    newState.todaysWeather.uvIndex = todaysData.uvIndex
    newState.todaysDate = moment().format('dddd, h:mm a')
    newState.forcast = todaysData.forcast

    return newState
}

function filterDaysData(forcast) {
    let forcastObj = {}
    forcast.list.forEach(day => {
        let dayString = moment(day.dt * 1000).format('ddd')

        if (!(dayString in forcastObj)) {
            forcastObj[dayString] = {
                day: dayString,
                temp: day.main.temp,
                diff: day.main.temp - day.main.temp_max,
                icon: day.weather[0].icon
            }
        }
    })

    return forcastObj
}