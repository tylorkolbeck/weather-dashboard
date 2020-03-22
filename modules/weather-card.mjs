// day: 'MONDAY',
// icon: "ic0",
// temp: 79,
// temp_diff: -10


function weatherCard(cardData) {

    let cardEl = $('<div>').addClass('weather-card')

    cardEl.append($('<p>').text(cardData.day))
    cardEl.append($('<img>').attr('src', `http://openweathermap.org/img/wn/${cardData.icon}@2x.png`))
    let h4El = $('<h4>').text(`${cardData.temp}°`)
    // h4El.append($('<span>').text('-3'))
    cardEl.append(h4El)

    return cardEl
}

export default weatherCard
