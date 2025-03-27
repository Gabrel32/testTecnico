import React, { useState, useEffect } from 'react';
import { useMyContext } from '../context/context';
import SimulationResults from './SimulationResults';
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
    setTimeout(() => {
      setFormData({
        amount: "",
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
    const formatNumber = (num) => {
        return parseFloat(num).toFixed(2).replace('.', ',');
    };
    const headers = ["Concepto", "Valor"];
    const data = [
        ["Monto inicial", `${formData.currency} ${formatNumber(formData.amount)}`],
        ["Plazo", `${formData.investmentTime} meses`],
        ["Tasa mensual", `${formData.percentage}%`],
        ["Tipo de interés", formData.benefitType],
        ["Interés generado", `${formData.currency} ${formatNumber(result.interest)}`],
        ["Total final", `${formData.currency} ${formatNumber(result.total)}`]
    ];
    let csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + data.map(row => `"${row[0]}","${row[1]}"`).join("\n");
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
                <label 
                  htmlFor={`option-${item.months}`}
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
                    <span className={`font-medium ${
                      errors.investmentTime ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {item.months} meses
                    </span>
                    <p className={errors.investmentTime ? 'text-red-500' : 'text-gray-500'}>
                      {item.percentage}% de interés mensual
                    </p>
                  </div>
                </label>
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
                aria-label='Simular'
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
                className="btn-effect w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-sky-700 bg-transparent border-2 border-sky-700  focus:outline-none transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Restablecer
              </button>
            </div>
          </div>
        </form>
      </div>
      {result && (
        <SimulationResults 
          result={result}
          formData={formData}
          setModal={setModal}
          exportToCSV={exportToCSV}
          formatCurrency={formatCurrency}
          fee={fee}
          percentage={percentage}
          totalReceived={totalReceived}
          handleConfirm={handleConfirm}
          handleCancel={handleCancel}
          modal={modal}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
export default Simulator;