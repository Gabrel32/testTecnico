import { useState, useEffect } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useMyContext } from "../context/context";
import ConfirmModal from "./ConfirmModal";

function DepositNow() {
    const [showQRModal, setShowQRModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [isPaymentReceived, setIsPaymentReceived] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const {
        createPayment,
        checkPaymentStatus,
        loading,
        error,
        paymentData,
        handleCancel,
        handleConfirm,
        paymentStatus
    } = useMyContext();

    const handleDeposit = async () => {
        setIsAnimating(true);
        await createPayment();
        setShowQRModal(true);
        setIsAnimating(false);
    };

    const handleVerify = async () => {
        setIsAnimating(true);
        await checkPaymentStatus();
        setShowVerifyModal(true);
        setIsAnimating(false);
    };

    const handleCloseModals = () => {
        setShowQRModal(false);
        setShowVerifyModal(false);
        handleCancel();
    };

    useEffect(() => {
        if (paymentStatus?.amount > 0) {
            setIsPaymentReceived(true);
        }
    }, [paymentStatus?.amount]);

    return (
        <div className="flex flex-col items-center w-fit gap-3  md:gap-5">
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <button 
                    onClick={handleDeposit}
                    disabled={loading?.deposit}
                    name="depositar ahora"
                    className={`
                        py-3 px-6 rounded-md font-medium text-white transition-all 
                        duration-300 ease-in-out flex-1 sm:flex-none btn-effect
                        ${loading?.deposit 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
                        }
                        ${isAnimating ? 'animate-pulse' : ''}
                    `}
                >
                    {loading?.deposit ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Generando...
                        </span>
                    ) : 'Depositar ahora'}
                </button>
                
                {error && (
                    <div className="animate-fade-in text-red-500 text-sm text-center py-2 col-span-2 w-full">
                        {error}
                    </div>
                )}
        
                {paymentData?.address && (
                    <button 
                        onClick={handleVerify}
                        disabled={loading?.verify}
                        className={`
                            py-3 px-6 rounded-md font-medium text-white transition-all 
                            duration-300 ease-in-out flex-1 sm:flex-none btn-effect
                            ${loading?.verify 
                                ? 'bg-green-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
                            }
                            animate-fade-in-up
                        `}
                    >
                        {loading?.verify ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Verificando...
                            </span>
                        ) : 'Verificar depósito'}
                    </button>
                )}
            </div>

            {showQRModal && paymentData?.address && (
                <ConfirmModal
                    modal={showQRModal}
                    onConfirm={handleConfirm}
                    onCancel={handleCloseModals}
                    title="Depositar Fondos"
                    hideConfirm={true}
                >
                    <div className="animate-scale-in flex flex-col items-center gap-6 p-6 relative">
                        <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:scale-105 transition-transform duration-300">
                            <QRCodeSVG 
                                value={paymentData.address}
                                size={window.innerWidth < 640 ? 180 : 220}
                                level="H"
                                fgColor="#141b31"
                                bgColor="#ffffff"
                                className="animate-grow"
                            />
                        </div>
                      
                        <div className="text-center animate-fade-in-delay">
                            <p className="text-sm text-gray-600 mb-2">
                                Escanea este código QR con tu wallet para realizar el pago
                            </p>
                           
                        </div>

                        <button
                            onClick={handleCloseModals}
                            id="close-modal"
                            aria-label="×"
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-xl bg-red-500 hover:bg-red-600 rounded-md text-white transition-all duration-300 active:scale-90 btn-effect"
                            >
                          ×
                        </button>
                    </div>
                </ConfirmModal>
            )}

            {showVerifyModal && paymentStatus && (
                <ConfirmModal
                    modal={showVerifyModal}
                    onConfirm={handleConfirm}
                    onCancel={handleCloseModals}
                    title="Estado del Pago"
                >
                    <div className="animate-slide-up flex flex-col gap-4 p-10 relative">
                        <button
                            onClick={handleCloseModals}
                            id="close-modal"
                            aria-label="×"
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-xl bg-red-500 hover:bg-red-600 rounded-md text-white transition-all duration-300 active:scale-90 btn-effect"
                            >
                          ×
                        </button>
                        
                        <div className={`
                            rounded-lg p-4 transition-all duration-500 ease-in-out 
                            ${isPaymentReceived 
                                ? 'bg-green-50 border border-green-100 animate-bounce-in' 
                                : 'bg-yellow-50 border border-yellow-100 animate-pulse'
                            }
                        `}>
                            {isPaymentReceived ? (
                                <>
                                    <p className="text-sm font-medium text-green-800">¡Pago recibido!</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        Hemos recibido tu pago de {paymentStatus?.amount || 0} USD
                                    </p>
                                    <div className="flex justify-center mt-2">
                                        <svg className="w-12 h-12 text-green-500 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-yellow-800">Pago pendiente</p>
                                    <p className="text-lg font-semibold text-yellow-700">
                                        Aún no hemos recibido tu pago
                                    </p>
                                    <div className="flex justify-center mt-2">
                                        <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 animate-slide-in-left">
                            <p className="text-sm font-medium text-gray-600">Estado de la transacción:</p>
                            <p className="text-lg font-semibold text-blue-600 capitalize">
                                {paymentStatus?.status || 'pendiente'}
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 animate-slide-in-right">
                            <p className="text-sm font-medium text-gray-600">Monto en Wallet:</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {paymentStatus?.amount || "0.00"} USD
                            </p>
                        </div>
                    </div>
                </ConfirmModal>
            )}

        </div>
    );
}

export default DepositNow;