// DepositNow.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DepositNow from '../components/DepositNow';
import { useMyContext } from '../context/context';

// Mocks
vi.mock('../context/context', () => ({
  useMyContext: vi.fn()
}));

vi.mock('qrcode.react', () => ({
  QRCodeSVG: vi.fn(() => <div data-testid="qrcode-mock" />)
}));

vi.mock('./ConfirmModal', () => ({
  default: vi.fn(({ children, title }) => (
    <div data-testid="confirm-modal">
      <h2>{title}</h2>
      {children}
    </div>
  ))
}));

describe('DepositNow Component', () => {
  const mockContext = {
    createPayment: vi.fn().mockResolvedValue({}),
    checkPaymentStatus: vi.fn().mockResolvedValue({}),
    loading: { deposit: false, verify: false },
    error: null,
    paymentData: null,
    handleCancel: vi.fn(),
    handleConfirm: vi.fn(),
    paymentStatus: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useMyContext.mockReturnValue(mockContext);
  });

  // Test 1: Renderizado inicial
  it('renderiza correctamente con el botón de depósito', () => {
    render(<DepositNow />);
    expect(screen.getByRole('button', { name: /depositar ahora/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /verificar depósito/i })).not.toBeInTheDocument();
  });

  // Test 2: Estado de carga al depositar
  it('muestra estado de carga al hacer clic en depositar', async () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      loading: { deposit: true, verify: false }
    });
    
    render(<DepositNow />);
    
    expect(screen.getByText('Generando...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generando/i })).toBeDisabled();
  });

  // Test 3: Mostrar botón de verificación cuando hay paymentData
  it('muestra botón de verificación cuando existe paymentData', () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' }
    });
    
    render(<DepositNow />);
    
    expect(screen.getByRole('button', { name: /verificar depósito/i })).toBeInTheDocument();
  });

  // Test 4: Mostrar modal QR al crear pago
  it('muestra modal QR al crear pago exitosamente', async () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' }
    });
    
    render(<DepositNow />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /depositar ahora/i }));
    });
    
    expect(screen.getByTestId('qrcode-mock')).toBeInTheDocument();
    expect(screen.getByText('Depositar Fondos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cerrar modal de depositar fondos/i })).toBeInTheDocument();
  });

  // Test 5: Mostrar modal de verificación
  it('muestra modal de verificación al verificar estado', async () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' },
      paymentStatus: { amount: 0, status: 'pending' }
    });
    
    render(<DepositNow />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /verificar depósito/i }));
    });
    
    expect(screen.getByText('Estado del Pago')).toBeInTheDocument();
    expect(screen.getByText('Pago pendiente')).toBeInTheDocument();
  });

  // Test 6: Mostrar estado de pago recibido
  it('muestra estado de pago recibido cuando amount > 0', async () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' },
      paymentStatus: { amount: 100, status: 'completed' }
    });
    
    render(<DepositNow />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /verificar depósito/i }));
    });
    
    expect(screen.getByText('¡Pago recibido!')).toBeInTheDocument();
    expect(screen.getByText('Hemos recibido tu pago de 100 USD')).toBeInTheDocument();
  });

  // Test 7: Cerrar modales correctamente
  it('cierra modales al hacer clic en el botón de cerrar', async () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' }
    });
    
    render(<DepositNow />);
    
    // Abrir modal QR
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /depositar ahora/i }));
    });
    
    // Cerrar modal
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /cerrar modal de depositar fondos/i }));
    });
    
    expect(mockContext.handleCancel).toHaveBeenCalled();
    expect(screen.queryByText('Depositar Fondos')).not.toBeInTheDocument();
  });

  // Test 8: Mostrar errores del contexto
  it('muestra mensajes de error del contexto', () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      error: 'Error de conexión'
    });
    
    render(<DepositNow />);
    
    expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    expect(screen.getByText('Error de conexión')).toHaveClass('text-red-500');
  });
});