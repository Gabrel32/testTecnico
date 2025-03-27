import { createContext, useContext, useState, useMemo } from 'react';
const MyContext = createContext();
const apiKey = import.meta.env.VITE_API_KEY;
export function Provider({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState({
        amount: '',
        currency: 'USD',
        investmentTime: '',
        percentage: 0,
        benefitType: 'beneficio simple'
    });
    const { fee, percentage, interestDetails, totalReceived } = useMemo(() => {
        const numericAmount = parseFloat(formData.amount.replace(/,/g, '')) || 0;
        const calculateFeeDetails = (amount) => {
            if (amount <= 1000) return { feeValue: amount * 0.02, selectPercentage: '2%' };
            if (amount <= 10000) return { feeValue: amount * 0.01, selectPercentage: '1%' };
            if (amount <= 35000) return { feeValue: amount * 0.005, selectPercentage: '0.5%' };
            return { feeValue: amount * 0.0025, selectPercentage: '0.25%' };
        };
        const { feeValue, selectPercentage } = numericAmount > 0 ? calculateFeeDetails(numericAmount) : { feeValue: 0, selectPercentage: '0%' };
        const interestResult = formData.amount ? calculateInterest() : { total: 0, interest: 0 };
        const received = numericAmount > 0 ?
            (numericAmount + interestResult.interest - feeValue).toFixed(2) :
            0;
        return {
            fee: feeValue,
            percentage: selectPercentage,
            interestDetails: interestResult,
            totalReceived: received
        };
    }, [formData]);
    const [loading, setLoading] = useState({
        deposit: false,
        verify: false,
        process: false
    });
    const [error, setError] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    function calculateInterest() {
        const amount = parseFloat(formData.amount.replace(/,/g, '')) || 0;
        const months = parseInt(formData.investmentTime) || 0;
        const monthlyRate = formData.percentage / 100;
        if (formData.benefitType === 'beneficio simple') {
            const interest = amount * monthlyRate * months;
            return {
                total: amount + interest,
                interest: interest,
                type: 'simple'
            };
        } else {
            const total = amount * Math.pow(1 + monthlyRate, months);
            return {
                total: total,
                interest: total - amount,
                type: 'compuesto'
            };
        }
    }
    const handleConfirm = () => {
        setIsOpen(false);
    };
    const handleCancel = () => {
        setIsOpen(false);
    };
    const formatCurrency = (value) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return "Invalid amount";
        return `${numericValue.toFixed(2)} ${formData.currency}`;
    };
    const baseUrl = 'https://my.disruptivepayments.io';
    async function createPayment() {
        setLoading({
            deposit: true,
            verify: false,
            process: false
        });
        setError(null);
        try {
            const endpoint = '/api/payments/single';

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    "client-api-key": apiKey,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    network: "BSC",
                    fundsGoal: 5,
                    smartContractAddress: "0xe9e7cea3dedca5984780bafc599bd69add087d56",

                })
            });
            const data = await response.json();
            setPaymentData(data.data);
        } catch (err) {
            console.error('Detalles del error:', {
                message: err.message,
                stack: err.stack
            });
            setError(`Error en la API: ${err.message}`);
        } finally {
            setLoading({
                deposit: false,
                verify: false,
                process: false
            });
        }
    }
    async function checkPaymentStatus() {
        if (!paymentData?.address) return;
        setLoading({
            deposit: false,
            verify: true,
            process: false
        });
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/payments/status?network=${paymentData.network}&address=${paymentData.address}`, {
                headers: {
                    'client-api-key': apiKey,
                    "content-type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error('Error al verificar el pago');
            }
            const statusData = await response.json();
            // simulacion para verificar transaccion

            // setPaymentStatus({
            //     amount: 100, 
            //     status: "completed",
            //     currency: "USD",
            //     timestamp: new Date().toISOString()
            // });
            setPaymentStatus(statusData.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading({
                deposit: false,
                verify: false,
                process: false
            });
        }
    }
    const value = {
        isOpen,
        setIsOpen,
        handleConfirm,
        formatCurrency,
        fee,
        percentage,
        totalReceived,
        handleCancel,
        formData,
        setFormData,
        calculateInterest,
        interest: interestDetails.interest,
        interestType: interestDetails.type,
        createPayment,
        checkPaymentStatus,
        loading,
        setLoading,
        error,
        setError,
        paymentData,
        setPaymentData,
        paymentStatus,
        setPaymentStatus
    };
    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    );
}
export function useMyContext() {
    const context = useContext(MyContext);
    if (context === undefined) {
        throw new Error('useMyContext debe usarse dentro de un Provider');
    }
    return context;
}