import { useContext, useEffect, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import { ACTIVE_CUSTOMER } from 'graphql/queries'
import { useQuery } from '@apollo/client'
import { UserContext } from 'utils/userContext'

import UserProfile from 'components/UserProfile'
import UserOrders from 'components/UserOrders'
import { useRouter } from 'next/router'

export default function Profile() {
    const { user } = useContext(UserContext)
    const { data, loading, error } = useQuery(ACTIVE_CUSTOMER)
    const [customerActive, setCustomerActive] = useState(undefined)

    const router = useRouter()

    useEffect(() => {
        !user && router.push('/')
    }, [user])

    useEffect(() => {
        if (data && !error) {
            setCustomerActive(data.activeCustomer)
        }
    }, [data, error])

    if (loading) return <CircularProgress />

    return (
        <Container maxWidth="xl" style={{ marginTop: '2rem' }}>
            <Grid container spacing={1}>
                <Grid item xs={12} lg={4}>
                    {user && (
                        <Typography
                            variant="h6"
                            style={{ marginBottom: '1rem' }}
                        >
                            Hola, {user.me.identifier}
                        </Typography>
                    )}
                    <UserProfile user={user} customerActive={customerActive} />
                </Grid>
                <Grid item xs={12} lg={8}>
                    {customerActive && (
                        <UserOrders orders={customerActive.orders} />
                    )}
                </Grid>
            </Grid>
        </Container>
    )
}
