import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import { useMyContext } from '../context/context';

function Simulator() {
  const {isOpen,setIsOpen,calculateFeeDetails,handleConfirm,formatCurrency,fee, percentage,totalReceived,handleCancel,formData,setFormData,calculateInterest} = useMyContext()  
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({
    amount: false,
    investmentTime: false
  });
  const [modal, setModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (result) {
      const calculation = calculateInterest();
      setResult(calculation);
    }
  }, [formData]);

  function handleInputChange(e) {
    const { name, value, dataset } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      percentage: name === 'investmentTime' ? parseFloat(dataset.percentage) : prev.percentage
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  }

  function resetForm() {
    setIsAnimating(true);
    setTimeout(() => {
      setFormData({
        amount: '',
        currency: 'MXN',
        benefitType: "beneficio simple",
        investmentTime: "",
        percentage: 0
      });
      setResult(false);
      setErrors({
        amount: false,
        investmentTime: false
      });
      setIsAnimating(false);
    }, 300);
  }

  function validateForm() {
    const newErrors = {
      amount: !formData.amount || isNaN(parseFloat(formData.amount.replace(/,/g, ''))),
      investmentTime: !formData.investmentTime
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }

  function exportToCSV() {
    const headers = ["Concepto", "Valor"];
    const data = [
      ["Monto inicial", `${formData.currency} ${parseFloat(formData.amount).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Plazo", `${formData.investmentTime} meses`],
      ["Tasa mensual", `${formData.percentage}%`],
      ["Tipo de interés", formData.benefitType],
      ["Interés generado", `${formData.currency} ${result.interest.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Total final", `${formData.currency} ${result.total.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`]
    ];
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + data.map(row => row.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "simulacion_ahorros.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function formSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      const calculation = calculateInterest();
      setResult(calculation);
      setIsAnimating(false);
    }, 200);
  }

  const investmentOptions = [
    {months: '3', percentage: 1}, 
    {months: '6', percentage: 2}, 
    {months: '9', percentage: 3}, 
    {months: '12', percentage: 4}
  ];

  return (
    <div className="w-full p-5 md:px-10 lg:px-20 flex justify-center items-center gap-10 flex-wrap ">
      <div className={`bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 max-w-md ${isAnimating ? 'animate-pulse' : ''}`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 animate-fade-in">Simulador de Ahorros</h2>
        
        <form onSubmit={formSubmit} className='flex flex-col gap-4'>
          <div className="mb-2 animate-fade-in-up">
            <label htmlFor="amount" className={`block text-sm font-medium ${errors.amount ? 'text-red-600' : 'text-gray-700'}`}>
              Monto que deseas solicitar *
            </label>
            <div className={`relative rounded-md shadow-sm transition-all duration-200 ${errors.amount ? 'border border-red-500 animate-shake' : 'border-gray-300'}`}>
              <input
                type="text"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 py-3 border rounded-md transition-all duration-200 ${
                  errors.amount ? 'border-red-500 text-red-600 placeholder-red-300' : 'border-gray-300 hover:border-blue-300'
                }`}
                placeholder="10,000"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-700 sm:text-sm rounded-r-md transition-colors duration-200 hover:bg-gray-50"
                >
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">Por favor ingresa un monto válido</p>
            )}
          </div>

          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className={`text-lg font-medium ${errors.investmentTime ? 'text-red-600' : 'text-gray-900'}`}>
              Tiempos de inversión *
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {investmentOptions.map((item, index) => (
                <div 
                  key={item.months} 
                  onClick={handleInputChange} 
                  className={`
                    flex items-start p-3 rounded-lg transition-all duration-200 cursor-pointer
                    ${errors.investmentTime ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50 bg-gray-100 hover:shadow-md'}
                    animate-slide-in-left
                  `}
                  style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                >
                  <div className="flex items-center h-5">
                    <input
                      id={`option-${item.months}`}
                      name="investmentTime"
                      type="radio"
                      value={item.months}
                      data-percentage={item.percentage}
                      checked={formData.investmentTime === item.months}
                      onChange={handleInputChange}
                      className={`focus:ring-blue-500 h-4 w-4 ${
                        errors.investmentTime ? 'text-red-600 border-red-300' : 'text-blue-600 border-gray-300'
                      } rounded transition-colors duration-200`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={`option-${item.months}`} className={`font-medium ${
                      errors.investmentTime ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {item.months} meses
                    </label>
                    <p className={errors.investmentTime ? 'text-red-500' : 'text-gray-500'}>
                      {item.percentage}% de interés mensual
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {errors.investmentTime && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">Por favor selecciona un plazo</p>
            )}
          </div>

          <div className="mt-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de beneficio
            </label>
            <select 
              name="benefitType" 
              id="benefits" 
              value={formData.benefitType}
              onChange={handleInputChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors duration-200 hover:border-blue-300"
            >
              <option value="beneficio simple">Beneficio simple</option>
              <option value="beneficio compuesto">Beneficio compuesto</option>
            </select>
          </div>

          <div className='flex w-full justify-center items-center gap-3 animate-fade-in-up' style={{ animationDelay: '0.4s' }}>
            <div className="mt-2">
              <button
                type="submit"
                className="btn-effect w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                {isAnimating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Calculando...
                  </span>
                ) : 'Simular'}
              </button>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="btn-effect w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Restablecer
              </button>
            </div>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-5 animate-scale-in max-w-md">
          <div className="flex justify-between items-center mb-4 gap-2.5">
            <h3 className="text-xl font-bold text-gray-800">Resultado de la simulación</h3>
            <button
              onClick={exportToCSV}
              className="btn-effect px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition-all duration-200 hover:scale-[1.03] active:scale-95"
            >
              Exportar a CSV
            </button>
          </div>

          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider animate-fade-in">Concepto</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider animate-fade-in" style={{ animationDelay: '0.1s' }}>Valor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  ["Monto inicial", `${formData.currency} ${parseFloat(formData.amount).toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
                  ["Plazo", `${formData.investmentTime} meses`],
                  ["Tasa mensual", `${formData.percentage}%`],
                  ["Tipo de interés", formData.benefitType],
                  ["Interés generado", `${formData.currency} ${result.interest.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
                  ["Total final", `${formData.currency} ${result.total.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, true]
                ].map(([concept, value, isHighlighted], index) => (
                  <tr 
                    key={index} 
                    className={`animate-fade-in-up ${isHighlighted ? 'bg-blue-50' : ''}`}
                    style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                  >
                    <td className={`px-3 py-4 whitespace-nowrap text-sm ${isHighlighted ? 'font-bold text-green-800' : 'font-medium text-gray-900'}`}>
                      {concept}
                    </td>
                    <td className={`px-3 py-4 whitespace-nowrap text-sm ${isHighlighted ? 'font-bold text-green-700' : 'text-gray-500'}`}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={() => {
                setModal(true);
                setIsOpen(true);
              }}
              className="btn-effect mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 active:scale-95 animate-fade-in-up"
              style={{ animationDelay: '0.45s' }}
            >
              Retirar ahora
            </button>
          </div>
        </div>
      )}

      {modal && (
        <ConfirmModal
          modal={modal}
          onConfirm={() => {
            console.log('Retiro cancelado');
            setModal(false);
            setIsOpen(false);
          }}
          onCancel={() => {
            console.log('Retiro cancelado');
            setModal(false);
            setIsOpen(false);
          }}
        >
          <div className="text-center animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Retiro</h3>
                  
            <div className="space-y-3 mb-6 text-left">
              <div className="flex justify-between animate-fade-in">
                <span className="text-gray-600">Monto solicitado:</span>
                <span className="font-semibold">
                  {formatCurrency(parseFloat(result.total))}
                </span>
              </div>
                  
              <div className="flex justify-between animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-gray-600">Fee de servicio ({percentage}):</span>
                <span className="font-semibold text-red-500">
                  -{formatCurrency(fee)}
                </span>
              </div>
                  
              <div className="border-t border-gray-200 pt-3 mt-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total a recibir:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(parseFloat(totalReceived))}
                  </span>
                </div>
              </div>
            </div>
                  
            <p className="text-gray-500 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              ¿Deseas continuar con el retiro?
            </p>
                  
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => {
                  handleConfirm();
                  setModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium active:scale-95 active:shadow-inner hover:scale-105 btn-effect"
              >
                Aceptar
              </button>
              <button
                onClick={() => {
                  handleCancel();
                  setModal(false);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all font-medium active:scale-95 active:shadow-inner hover:scale-105 btn-effect"
              >
                Declinar
              </button>
            </div>
          </div>
        </ConfirmModal>
      )}
    </div>
  );
}

export default Simulator;