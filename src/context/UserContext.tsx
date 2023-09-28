import { createContext, ReactNode, useState} from 'react'
import { Result } from '../models/Result'

type UserContextType = {
    lastResult: Result
    setLastResult: (newValue : Result) => void
    query: string
    setQuery: (newValue : string) => void
}

const initialValue: UserContextType = {
    lastResult: {
        photos: [],
        totalPages: 0
    },
    setLastResult: () => {},
    query: '',
    setQuery: () => {}
}

export const UserContext = createContext(initialValue)

type Props = {
    children: ReactNode
}

export const UserContextProvider = ({children} : Props) => {
    const [lastResult, setLastResult] = useState(initialValue.lastResult)
    const [query, setQuery] = useState(initialValue.query)
    return <UserContext.Provider value={{lastResult, setLastResult, query, setQuery}}>{children}</UserContext.Provider>
}