import {
    ApolloClient,
    ApolloLink,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_URL_SHOP_API}/shop-api`,
    withCredentials: true,
})

const afterwareLink = new ApolloLink((operation, forward) => {
    const existTokenInLocalStorage =
        localStorage.getItem('vendure-auth-token') !== null
    return forward(operation).map((response) => {
        const context = operation.getContext()
        const authHeader = context.response.headers.get('vendure-auth-token')
        console.log(authHeader, existTokenInLocalStorage)
        if (authHeader && !existTokenInLocalStorage) {
            localStorage.setItem('vendure-auth-token', authHeader)
        }
        return response
    })
})

const client = new ApolloClient({
    link: ApolloLink.from([
        setContext(() => {
            const authToken = localStorage.getItem('vendure-auth-token')
            if (authToken) {
                return {
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                }
            }
        }),
        afterwareLink.concat(httpLink),
    ]),
    cache: new InMemoryCache(),
})

export default client
