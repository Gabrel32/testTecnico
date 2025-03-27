import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SimulationResults from '../components/SimulationResults';
vi.mock('../components/ConfirmModal', () => ({
    __esModule: true,
    default: ({ modal, onConfirm, onCancel, children }) => (
        modal && (
            <div data-testid="confirm-modal">
                {children}
                <button onClick={onConfirm} data-testid="confirm-button">Confirmar</button>
                <button onClick={onCancel} data-testid="cancel-button">Cancelar</button>
            </div>
        )
    )
}));
describe('Componente SimulationResults', () => {
    const mockProps = {
        result: {
            interest: 400,
            total: 2400
        },
        formData: {
            amount: "10000",
            currency: 'MXN',
            benefitType: "beneficio simple",
            investmentTime: "6",
            percentage: 2
        },
        setModal: vi.fn(),
        exportToCSV: vi.fn(),
        formatCurrency: (value) => `$${value.toFixed(2)}`,
        fee: 100,
        percentage: '5%',
        totalReceived: 1900,
        handleConfirm: vi.fn(),
        handleCancel: vi.fn(),
        modal: false,
        setIsOpen: vi.fn()
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('llama a exportToCSV al hacer clic en el botón correspondiente', () => {
        render(<SimulationResults {...mockProps} />);
        fireEvent.click(screen.getByRole('button', { name: /exportar a csv/i }));
        expect(mockProps.exportToCSV).toHaveBeenCalled();
    });

    it('muestra el modal de confirmación cuando la prop modal es true', () => {
        render(<SimulationResults {...mockProps} modal={true} />);
        expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
        expect(screen.getByText('Confirmar Retiro')).toBeInTheDocument();
    });
    it('resalta la fila del monto total', () => {
        render(<SimulationResults {...mockProps} />);
        const totalRow = screen.getByText('Monto total').closest('tr');
        expect(totalRow).toHaveClass('bg-blue-50');
    });
    it('no muestra el modal cuando la prop modal es false', () => {
        render(<SimulationResults {...mockProps} modal={false} />);
        expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    });
});