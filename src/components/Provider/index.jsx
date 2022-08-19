import React from 'react'

const AppContext = React.createContext();

function AppContextProvider(props) {
    const AppThisSemester = import.meta.env.VITE_THIS_SEMESTER
    const AppThisYear = import.meta.env.VITE_THIS_YEAR
    const context = {
        AppThisSemester,
        AppThisYear
    }
    return (
        <AppContext.Provider value={context}>
            {props.children}
        </AppContext.Provider>
    )
}

export { AppContextProvider, AppContext }