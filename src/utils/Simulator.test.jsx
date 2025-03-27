// Simulator.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Simulator from '../components/Simulator';
import { useMyContext } from '../context/context';

// Mock del contexto
vi.mock('../context/context');

describe('Simulator - Flujo de retiro', () => {
  const mockCalculateInterest = vi.fn(() => ({
    interest: 100,
    total: 1100
  }));

  const mockContext = {
    isOpen: false,
    setIsOpen: vi.fn(),
    calculateFeeDetails: vi.fn(),
    handleConfirm: vi.fn(),
    handleCancel: vi.fn(),
    formatCurrency: (value) => `$${value.toFixed(2)}`,
    fee: 10,
    percentage: 1,
    totalReceived: 1090,
    formData: {
      amount: "",
      currency: 'MXN',
      benefitType: "beneficio simple",
      investmentTime: "",
      percentage: 0
    },
    setFormData: vi.fn(),
    calculateInterest: mockCalculateInterest
  };

  beforeEach(() => {
    useMyContext.mockReturnValue(mockContext);
  });

//   it('debe renderizar correctamente el formulario inicial', () => {
//     render(<Simulator />);
    
//     expect(screen.getByText('Simulador de Ahorros')).toBeInTheDocument();
//     expect(screen.getByLabelText('Monto que deseas solicitar *')).toBeInTheDocument();
//     expect(screen.getByText('Tiempos de inversión *')).toBeInTheDocument();
//     expect(screen.getByText('Tipo de beneficio')).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /simular/i })).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /restablecer/i })).toBeInTheDocument();
//   });

//   it('debe mostrar errores cuando el formulario se envía vacío', async () => {
//     render(<Simulator />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /simular/i }));
//     });
    
//     expect(screen.getByText('Por favor ingresa un monto válido')).toBeInTheDocument();
//     expect(screen.getByText('Por favor selecciona un plazo')).toBeInTheDocument();
//   });

//   it('debe mostrar animación de carga al simular', async () => {
//     useMyContext.mockReturnValue({
//       ...mockContext,
//       formData: {
//         ...mockContext.formData,
//         amount: "1000",
//         investmentTime: "3",
//         percentage: 1
//       }
//     });
    
//     render(<Simulator />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /simular/i }));
//     });
    
//     expect(screen.getByText('Calculando...')).toBeInTheDocument();
//   });

//   it('debe mostrar resultados después de una simulación exitosa', async () => {
//     useMyContext.mockReturnValue({
//       ...mockContext,
//       formData: {
//         ...mockContext.formData,
//         amount: "1000",
//         investmentTime: "3",
//         percentage: 1
//       }
//     });
    
//     render(<Simulator />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /simular/i }));
//     });
    
//     expect(screen.getByText('Resultado de la simulación')).toBeInTheDocument();
//     expect(screen.getByText('Monto inicial')).toBeInTheDocument();
//     expect(screen.getByText('Plazo')).toBeInTheDocument();
//     expect(screen.getByText('Tasa mensual')).toBeInTheDocument();
//     expect(screen.getByText('Interés generado')).toBeInTheDocument();
//     expect(screen.getByText('Monto total')).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /exportar a csv/i })).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /retirar ahora/i })).toBeInTheDocument();
//   });

//   it('debe abrir el modal de confirmación al hacer clic en Retirar ahora', async () => {
//     useMyContext.mockReturnValue({
//       ...mockContext,
//       formData: {
//         ...mockContext.formData,
//         amount: "1000",
//         investmentTime: "3",
//         percentage: 1
//       }
//     });
    
//     render(<Simulator />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /simular/i }));
//     });
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /retirar ahora/i }));
//     });
    
//     expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
//     expect(screen.getByText('Confirmar Retiro')).toBeInTheDocument();
//     expect(screen.getByText('Monto solicitado:')).toBeInTheDocument();
//     expect(screen.getByText('Fee de servicio (5%):')).toBeInTheDocument();
//     expect(screen.getByText('Total a recibir:')).toBeInTheDocument();
//   });

//   it('debe restablecer el formulario al hacer clic en Restablecer', async () => {
//     render(<Simulator />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /restablecer/i }));
//     });
    
//     expect(mockContext.setFormData).toHaveBeenCalledWith({
//       amount: "",
//       currency: 'MXN',
//       benefitType: "beneficio simple",
//       investmentTime: "",
//       percentage: 0
//     });
//   });

//   it('debe manejar cambios en los inputs correctamente', async () => {
//     render(<Simulator />);
    
//     const amountInput = screen.getByLabelText('Monto que deseas solicitar *');
//     await act(async () => {
//       fireEvent.change(amountInput, { target: { name: 'amount', value: '5000' } });
//     });
    
//     expect(mockContext.setFormData).toHaveBeenCalled();
    
//     const option3Months = screen.getAllByRole('radio')[0];
//     await act(async () => {
//       fireEvent.click(option3Months);
//     });
    
//     expect(mockContext.setFormData).toHaveBeenCalled();
//   });

//   it('debe cerrar el modal al hacer clic en el botón de cerrar', async () => {
//     useMyContext.mockReturnValue({
//       ...mockContext,
//       formData: {
//         ...mockContext.formData,
//         amount: "1000",
//         investmentTime: "3",
//         percentage: 1
//       }
//     });
    
//     render(<Simulator />);
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /simular/i }));
//     });
    
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /retirar ahora/i }));
//     });
    
//     await act(async () => {
//       fireEvent.click(screen.getByTestId('close-modal'));
//     });
    
//     expect(mockContext.handleCancel).toHaveBeenCalled();
//     expect(mockContext.setIsOpen).toHaveBeenCalledWith(false);
//   });

it('debe confirmar el retiro al hacer clic en Aceptar', async () => {
    render(<Simulator />);

    // 1. Llenar el formulario
    const amountInput = screen.getByLabelText(/monto que deseas solicitar/i);
    fireEvent.change(amountInput, { target: { value: '1000' } });

    const timeOption = screen.getByLabelText(/3 meses/i);
    fireEvent.click(timeOption);

    // 2. Hacer click en Simular
    const simulateButton = screen.getByRole('button', { name: /simular/i });
    await act(async () => {
      fireEvent.click(simulateButton);
    });

    // 3. Verificar que el resultado se muestra
    expect(screen.getByText(/resultado de la simulación/i)).toBeInTheDocument();

    // 4. Hacer click en Retirar ahora
    const withdrawButton = await screen.findByRole('button', { name: /retirar ahora/i });
    await act(async () => {
      fireEvent.click(withdrawButton);
    });

    // 5. Verificar que el modal se abre
    expect(mockContext.setIsOpen).toHaveBeenCalledWith(true);
    expect(screen.getByText(/confirmar retiro/i)).toBeInTheDocument();

    // 6. Hacer click en Aceptar
    const acceptButton = screen.getByRole('button', { name: /aceptar/i });
    await act(async () => {
      fireEvent.click(acceptButton);
    });

    // 7. Verificaciones finales
    expect(mockContext.handleConfirm).toHaveBeenCalled();
    expect(mockContext.setIsOpen).toHaveBeenCalledWith(false);
  });
});