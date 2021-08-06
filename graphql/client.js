import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

const httpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_URL_SHOP_API}/shop-api`,
    credentials: 'include',
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})

export default client
