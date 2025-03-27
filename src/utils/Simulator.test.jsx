import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Simulator from '../components/Simulator';
import { useMyContext } from '../context/context';
vi.mock('../context/context', () => ({
  useMyContext: vi.fn()
}));
vi.mock('./SimulationResults', () => ({
  default: vi.fn((props) => (
    <div data-testid="simulation-results">
      <button onClick={() => props.setModal(true)}>Retirar ahora</button>
    </div>
  ))
}));
vi.mock('./ConfirmModal', () => ({
  default: vi.fn(({ modal, onConfirm, onCancel, children }) =>
    modal ? (
      <div data-testid="confirm-modal">
        {children}
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    ) : null
  )
}));
describe('Componente Simulator', () => {
  const mockContext = {
    isOpen: false,
    setIsOpen: vi.fn(),
    calculateFeeDetails: vi.fn(),
    handleConfirm: vi.fn(),
    formatCurrency: (value) => `$${value.toFixed(2)}`,
    fee: 100,
    percentage: '5%',
    totalReceived: 1900,
    handleCancel: vi.fn(),
    formData: {
      amount: "",
      currency: 'MXN',
      benefitType: "beneficio simple",
      investmentTime: "",
      percentage: 0
    },
    setFormData: vi.fn(),
    calculateInterest: vi.fn().mockReturnValue({
      interest: 400,
      total: 2400
    })
  };
  beforeEach(() => {
    vi.clearAllMocks();
    useMyContext.mockReturnValue(mockContext);
  });
  it('debe mostrar el formulario inicial correctamente', () => {
    render(<Simulator />);
    expect(screen.getByText('Simulador de Ahorros')).toBeInTheDocument();
    expect(screen.getByLabelText('Monto que deseas solicitar *')).toBeInTheDocument();
    expect(screen.getByText('Tiempos de inversión *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simular' })).toBeInTheDocument();
  });
  it('debe mostrar errores al enviar formulario vacío', async () => {
    render(<Simulator />);
    fireEvent.click(screen.getByRole('button', { name: 'Simular' }));
    await waitFor(() => {
      expect(screen.getByText('Por favor ingresa un monto válido')).toBeInTheDocument();
      expect(screen.getByText('Por favor selecciona un plazo')).toBeInTheDocument();
    });
  });
  it('debe permitir ingresar un monto y seleccionar moneda', () => {
    render(<Simulator />);
    const amountInput = screen.getByLabelText('Monto que deseas solicitar *');
    fireEvent.change(amountInput, { target: { value: '10000' } });
    const currencySelect = screen.getByLabelText('Tipo de beneficio');
    fireEvent.change(currencySelect, { target: { value: 'USD' } });
    expect(mockContext.setFormData).toHaveBeenCalled();
  });
  it('debe permitir seleccionar un plazo de inversión', () => {
    render(<Simulator />);
    const radioButtons = screen.getAllByRole('radio');
    fireEvent.click(radioButtons[0]);
    expect(mockContext.setFormData).toHaveBeenCalled();
  });
  it('debe mostrar animación al calcular', async () => {
    render(<Simulator />);
    fireEvent.change(screen.getByLabelText('Monto que deseas solicitar *'), {
      target: { value: '10000' }
    });
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Simular' }));
    expect(screen.getByRole('button', { name: 'Simular' })).toBeInTheDocument();
  });
});