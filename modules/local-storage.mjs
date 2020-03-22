const APPNAME = 'weatherApp'

export function updateStateWithLocalStorage(appState) {
    let savedData = _getSearchesFromLocalStorage()

    let newState = {
        ...appState,
        storedSearches: savedData
    }
    return newState 
}

export function updateLocalStorageWithSearches(recentSearches) {
    let pastSearches = _getSearchesFromLocalStorage()

    if (pastSearches) {
        for (let key in recentSearches) {
            if (!(key in pastSearches)) {
                pastSearches[key] = recentSearches[key]
            }
        }
    }
    localStorage.setItem(APPNAME, JSON.stringify(recentSearches))
}


function _getSearchesFromLocalStorage() {
    let storedSearches = localStorage.getItem(APPNAME)

    if (storedSearches) {
        return JSON.parse(storedSearches)
    } else {
        return null
    }
}

export function clearLocalStorage() {
    localStorage.setItem(APPNAME, null)
}