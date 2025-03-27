// DepositNow.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
  default: vi.fn(({ children, title, modal, onCancel }) => (
    modal && (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        {children}
        <button 
          onClick={onCancel} 
          aria-label={`Cerrar modal de ${title}`}
          data-testid="close-modal"
        >
          ×
        </button>
      </div>
    )
  ))
}));

describe('Componente DepositNow', () => {
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

  it('debe mostrar el botón de depósito inicial', () => {
    render(<DepositNow />);
    expect(screen.getByRole('button', { name: /depositar ahora/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /verificar depósito/i })).not.toBeInTheDocument();
  });

  it('debe mostrar estado de carga durante el depósito', () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      loading: { deposit: true, verify: false }
    });
    
    render(<DepositNow />);
    
    const boton = screen.getByRole('button', { name: /generando/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toBeDisabled();
    expect(boton).toHaveClass('bg-blue-400');
  });

  it('debe mostrar botón de verificación cuando hay paymentData', () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' }
    });
    
    render(<DepositNow />);
    expect(screen.getByRole('button', { name: /verificar depósito/i })).toBeInTheDocument();
  });

  it('debe abrir modal QR al crear depósito exitoso', async () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' }
    });
    
    render(<DepositNow />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /depositar ahora/i }));
    });
    
    expect(mockContext.createPayment).toHaveBeenCalled();
    expect(screen.getByTestId('qrcode-mock')).toBeInTheDocument();
  });

  it('debe mostrar modal de verificación con estado pendiente', async () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' },
      paymentStatus: { amount: 0, status: 'pending' }
    });
    
    render(<DepositNow />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /verificar depósito/i }));
    });
    
    expect(mockContext.checkPaymentStatus).toHaveBeenCalled();
    expect(screen.getByText('Pago pendiente')).toBeInTheDocument();
  });

  it('debe mostrar estado de pago recibido cuando el monto es positivo', async () => {
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

  it('debe cerrar modales al hacer clic en botón de cerrar', async () => {
    console.log(screen);
    
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' }
    });
    
    render(<DepositNow />);
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /depositar ahora/i }));
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: "×" })); 
    });
    
    expect(mockContext.handleCancel).toHaveBeenCalled();
  });

  it('debe mostrar mensajes de error del contexto', () => {
    const mensajeError = 'Error de conexión';
    useMyContext.mockReturnValue({
      ...mockContext,
      error: mensajeError
    });
    
    render(<DepositNow />);
    
    const elementoError = screen.getByText(mensajeError);
    expect(elementoError).toBeInTheDocument();
    expect(elementoError).toHaveClass('text-red-500');
  });

  it('debe mostrar estado de carga durante la verificación', () => {
    useMyContext.mockReturnValue({
      ...mockContext,
      paymentData: { address: 'test-address' },
      loading: { deposit: false, verify: true }
    });
    
    render(<DepositNow />);
    
    const boton = screen.getByRole('button', { name: /verificando/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toBeDisabled();
    expect(boton).toHaveClass('bg-green-400');
  });

  it('debe activar animaciones al hacer clic en botones', async () => {
    render(<DepositNow />);
    
    const boton = screen.getByRole('button', { name: /depositar ahora/i });
    expect(boton).toHaveClass('btn-effect');
  });
});