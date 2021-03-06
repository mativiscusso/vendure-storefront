import { gql } from '@apollo/client'
import { CART_FRAGMENT, PAYMENTS } from './fragments'

export const USER_ACCOUNT_VERIFY = gql`
    mutation verifyCustomerAccount($token: String!, $password: String) {
        verifyCustomerAccount(token: $token, password: $password) {
            __typename
            ... on CurrentUser {
                id
                identifier
            }
            ... on VerificationTokenInvalidError {
                message
            }
            ... on VerificationTokenExpiredError {
                message
            }
            ... on MissingPasswordError {
                message
            }
            ... on PasswordAlreadySetError {
                message
            }
            ... on NativeAuthStrategyError {
                message
            }
        }
    }
`

export const USER_LOGIN = gql`
    mutation login($user: String!, $password: String!, $rememberMe: Boolean) {
        login(username: $user, password: $password, rememberMe: $rememberMe) {
            __typename
            ... on CurrentUser {
                id
                identifier
                channels {
                    id
                    token
                    code
                }
            }
            ... on InvalidCredentialsError {
                authenticationError
                message
            }
            ... on NotVerifiedError {
                errorCode
                message
            }
            ... on NativeAuthStrategyError {
                message
            }
        }
    }
`
export const USER_REGISTER = gql`
    mutation Register($data: RegisterCustomerInput!) {
        registerCustomerAccount(input: $data) {
            __typename
            ... on Success {
                success
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`

export const USER_LOGOUT = gql`
    mutation {
        logout {
            success
            __typename
        }
    }
`
export const USER_REQUEST_RESET_PASSWORD = gql`
    mutation requestPasswordReset($email: String!) {
        requestPasswordReset(emailAddress: $email) {
            __typename
        }
    }
`
export const USER_RESET_PASSWORD = gql`
    mutation resetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
            __typename
        }
    }
`

export const ADD_ITEM_CART = gql`
    ${CART_FRAGMENT}
    mutation addItem($productId: ID!, $quantity: Int!) {
        addItemToOrder(productVariantId: $productId, quantity: $quantity) {
            __typename
            ... on InsufficientStockError {
                quantityAvailable
                message
                order {
                    ...Cart
                }
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`
export const CHANGE_QTY_ITEM_CART = gql`
    mutation adjustOrderLine($orderLineId: ID!, $quantity: Int!) {
        adjustOrderLine(orderLineId: $orderLineId, quantity: $quantity) {
            __typename
        }
    }
`
export const REMOVE_ITEM_CART = gql`
    mutation removeOrderLine($orderLineId: ID!) {
        removeOrderLine(orderLineId: $orderLineId) {
            __typename
        }
    }
`

export const EMPTY_CART = gql`
    mutation removeAllOrderLines {
        removeAllOrderLines {
            __typename
        }
    }
`
export const SET_CUSTOMER_ORDER = gql`
    mutation setCustomerForOrder($input: CreateCustomerInput!) {
        setCustomerForOrder(input: $input) {
            __typename
        }
    }
`
export const SET_ADDRESSES_ORDER = gql`
    ${CART_FRAGMENT}
    mutation setShipping($input: CreateAddressInput!) {
        setOrderShippingAddress(input: $input) {
            __typename
            ...Cart
        }
    }
`
export const SET_SHIPPING_METHOD_ORDER = gql`
    mutation setShippingMethod($shippingMethod: ID!) {
        setOrderShippingMethod(shippingMethodId: $shippingMethod) {
            __typename
        }
    }
`
export const CHANGE_STATE_ORDER = gql`
    mutation transitionOrderToState($state: String!) {
        transitionOrderToState(state: $state) {
            __typename
        }
    }
`
export const SET_PAYMENT_METHOD_ORDER = gql`
    ${PAYMENTS}
    mutation addPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            __typename
            ...Payments
        }
    }
`
export const CUSTOMER_UPDATE = gql`
    mutation updateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            id
            firstName
            lastName
            phoneNumber
            emailAddress
        }
    }
`

export const CUSTOMER_ADDRESS_UPDATE = gql`
    mutation updateAddressesCustomer($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            id
            streetLine1
            streetLine2
            city
            province
            postalCode
            phoneNumber
            defaultShippingAddress
            defaultBillingAddress
        }
    }
`

export const USER_PASSWORD_UPDATE = gql`
    mutation updateCustomerPassword(
        $currentPassword: String!
        $newPassword: String!
    ) {
        updateCustomerPassword(
            currentPassword: $currentPassword
            newPassword: $newPassword
        ) {
            __typename
            ... on Success {
                success
            }
            ... on InvalidCredentialsError {
                authenticationError
                message
            }
        }
    }
`

export const SET_PAYMENT_METHOD_ORDER_MERCADO_PAGO = `
    mutation addPaymentToOrder($input: PaymentInput!) {
        addPaymentToOrder(input: $input) {
            __typename
            ... on Order {
                    payments {
                        method
                        state
                        transactionId
                        amount
                        errorMessage
                        refunds {
                            total
                            reason
                        }
                        metadata
                    }
                    currencyCode
                    fulfillments {
                        id
                        state
                        method
                        trackingCode
                    }
               
            }
            ... on PaymentDeclinedError {
                errorCode
                message
                paymentErrorMessage
              }
            
        }
        
    }
`
