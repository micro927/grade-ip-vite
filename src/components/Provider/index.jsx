import { createContext, useEffect } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';

const AppContext = createContext();
const AppContextProvider = (props) => {
    const AppThisSemester = import.meta.env.VITE_THIS_SEMESTER
    const AppThisYear = import.meta.env.VITE_THIS_YEAR
    const appApiHost = import.meta.env.VITE_API_HOST
    const userToken = localStorage.getItem('userToken') ?? ''
    let tokenValidation = false

    useEffect(() => {
        (async () => {
            await axios
                .get(`${appApiHost}/checkusertoken`,
                    {
                        headers: { 'Authorization': 'Bearer ' + userToken },
                    }
                )
                .then(async (response) => {
                    tokenValidation = await response.data.isAuthorized
                    if (!tokenValidation) {
                        clearLocalStorage()
                    }
                })
                .catch(async (error) => {
                    tokenValidation = await error?.response?.data?.isAuthorized || false
                    // console.error('API CHECK ERROR : ' + error.code)
                    console.log('NOT LOGIN')
                })
        })()
    }, []);

    const context = {
        AppThisSemester,
        AppThisYear,
        tokenValidation
    }

    return (
        <AppContext.Provider value={context}>
            {props.children}
        </AppContext.Provider>
    )
}

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}
AppContext.propTypes = {
    value: PropTypes.object
}


export { AppContextProvider, AppContext }