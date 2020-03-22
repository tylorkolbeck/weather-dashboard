const appState = {
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


getWeatherData('San Diego')


async function getWeatherData(cityName) {
    // set loading to true
    let appid = '&appid=15b205abad1b5e1fb9ef943d6eccf32c'
    if (cityName) {
        let weatherQueryString = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}${appid}`
        let fiveDayQueryString = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}${appid}`

        let weather = await $.ajax({url: weatherQueryString, method: 'GET'})
        let uvQueryString = `https://api.openweathermap.org/data/2.5/uvi?lat=${weather.coord.lat}&lon=${weather.coord.lon}${appid}`

        let uvIndex = await $.ajax({url: uvQueryString, method: 'GET'})

        let forcast = await $.ajax({url: fiveDayQueryString, method: 'GET'})
        
        setTodaysData({...weather, uvIndex: uvIndex.value, forcast: filterDaysData(forcast)})
        // set loading to false
    }
}

function setTodaysData(todaysData) {
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


    console.log(newState)
}

function filterDaysData(forcast) {
    console.log(forcast)
    let forcastObj = {}
    forcast.list.forEach(day => {
        let dayString = moment(day.dt * 1000).format('dddd')

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



