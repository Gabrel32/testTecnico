import React from 'react';
import ConfirmModal from './ConfirmModal';
function SimulationResults({
  result,
  formData,
  setModal,
  exportToCSV,
  formatCurrency,
  fee,
  percentage,
  totalReceived,
  handleConfirm,
  handleCancel,
  modal,
  setIsOpen
}) {
  return (
    <>
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
                ["Monto inicial", `${formData.currency} ${parseFloat(formData.amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
                ["Plazo", `${formData.investmentTime} meses`],
                ["Tasa mensual", `${formData.percentage}%`],
                ["Tipo de interés", formData.benefitType],
                ["Interés generado", `${formData.currency} ${result.interest.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
                ["Monto total", `${formData.currency} ${result.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, true]
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
            aria-label='retirar'
            className="btn-effect mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 active:scale-95 animate-fade-in-up"
            style={{ animationDelay: '0.45s' }}
          >
            Retirar ahora
          </button>
        </div>
      </div>
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
                aria-label='aceptar'
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium active:scale-95 active:shadow-inner hover:scale-105 btn-effect"
              >
                Aceptar
              </button>
              <button
                onClick={() => {
                  handleCancel();
                  setModal(false);
                }}
                aria-label='declinar'
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all font-medium active:scale-95 active:shadow-inner hover:scale-105 btn-effect"
              >
                Declinar
              </button>
            </div>
          </div>
        </ConfirmModal>
      )}
    </>
  );
}
export default SimulationResults;