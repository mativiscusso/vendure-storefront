import { SET_PAYMENT_METHOD_ORDER_MERCADO_PAGO } from 'graphql/mutations'
import useScript from 'hooks/useScript'
import { useEffect } from 'react'

export default function MercadoPagoForm() {
    const { MercadoPago } = useScript(
        'https://sdk.mercadopago.com/js/v2',
        'MercadoPago'
    )

    useEffect(() => {
        if (MercadoPago) {
            const mp = new MercadoPago(
                'TEST-003536dd-9b5a-4b10-b5cc-8758a924b09a' //* Esta es la public key del vendedor
            )
            const cardForm = mp.cardForm({
                amount: '100.5',
                autoMount: true,
                form: {
                    id: 'form-checkout',
                    cardholderName: {
                        id: 'form-checkout__cardholderName',
                        placeholder: 'Titular de la tarjeta',
                    },
                    cardholderEmail: {
                        id: 'form-checkout__cardholderEmail',
                        placeholder: 'E-mail',
                    },
                    cardNumber: {
                        id: 'form-checkout__cardNumber',
                        placeholder: 'Número de la tarjeta',
                    },
                    cardExpirationMonth: {
                        id: 'form-checkout__cardExpirationMonth',
                        placeholder: 'Mes de vencimiento',
                    },
                    cardExpirationYear: {
                        id: 'form-checkout__cardExpirationYear',
                        placeholder: 'Año de vencimiento',
                    },
                    securityCode: {
                        id: 'form-checkout__securityCode',
                        placeholder: 'Código de seguridad',
                    },
                    installments: {
                        id: 'form-checkout__installments',
                        placeholder: 'Cuotas',
                    },
                    identificationType: {
                        id: 'form-checkout__identificationType',
                        placeholder: 'Tipo de documento',
                    },
                    identificationNumber: {
                        id: 'form-checkout__identificationNumber',
                        placeholder: 'Número de documento',
                    },
                    issuer: {
                        id: 'form-checkout__issuer',
                        placeholder: 'Banco emisor',
                    },
                },
                callbacks: {
                    onFormMounted: (error) => {
                        if (error)
                            return console.warn(
                                'Form Mounted handling error: ',
                                error
                            )
                    },
                    onSubmit: (event) => {
                        event.preventDefault()

                        const {
                            // eslint-disable-next-line camelcase
                            paymentMethodId: payment_method_id,
                            // eslint-disable-next-line camelcase
                            issuerId: issuer_id,
                            cardholderEmail: email,
                            amount,
                            token,
                            installments,
                            identificationNumber,
                            identificationType,
                        } = cardForm.getCardFormData()

                        const variables = {
                            input: {
                                method: 'mercado-pago',
                                metadata: {
                                    token,
                                    issuer_id,
                                    payment_method_id,
                                    transaction_amount: Number(amount),
                                    installments: Number(installments),
                                    description: 'Descripción del producto',
                                    payer: {
                                        email,
                                        identification: {
                                            type: identificationType,
                                            number: identificationNumber,
                                        },
                                    },
                                },
                            },
                        }

                        fetch('http://localhost:4000/shop-api', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                query: SET_PAYMENT_METHOD_ORDER_MERCADO_PAGO,
                                variables: variables,
                            }),
                        })
                    },
                    onFetching: (resource) => {
                        // Animate progress bar
                        const progressBar =
                            document.querySelector('.progress-bar')
                        progressBar.removeAttribute('value')

                        return () => {
                            progressBar.setAttribute('value', '0')
                        }
                    },
                },
            })
        }
    }, [MercadoPago])

    return (
        <form id="form-checkout">
            <input
                type="text"
                name="cardNumber"
                id="form-checkout__cardNumber"
            />
            <input
                type="text"
                name="cardExpirationMonth"
                id="form-checkout__cardExpirationMonth"
            />
            <input
                type="text"
                name="cardExpirationYear"
                id="form-checkout__cardExpirationYear"
            />
            <input
                type="text"
                name="cardholderName"
                id="form-checkout__cardholderName"
            />
            <input
                type="email"
                name="cardholderEmail"
                id="form-checkout__cardholderEmail"
            />
            <input
                type="text"
                name="securityCode"
                id="form-checkout__securityCode"
            />
            <select name="issuer" id="form-checkout__issuer"></select>
            <select
                name="identificationType"
                id="form-checkout__identificationType"
            ></select>
            <input
                type="text"
                name="identificationNumber"
                id="form-checkout__identificationNumber"
            />
            <select
                name="installments"
                id="form-checkout__installments"
            ></select>
            <button type="submit" id="form-checkout__submit">
                Pagar
            </button>
            <progress value="0" className="progress-bar">
                Cargando...
            </progress>
        </form>
    )
}
