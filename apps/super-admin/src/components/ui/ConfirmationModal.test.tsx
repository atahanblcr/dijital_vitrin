import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmationModal from './ConfirmationModal';
import '@testing-library/jest-dom';

describe('ConfirmationModal (Type-to-Confirm)', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'İşletmeyi Sil',
    description: 'Bu işlem geri alınamaz.',
    confirmText: 'sil',
    expectedValue: 'Test İşletmesi',
  };

  it('Başlangıçta "Sil" butonu pasif olmalı', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const deleteButton = screen.getByRole('button', { name: /kalıcı olarak sil/i });
    expect(deleteButton).toBeDisabled();
  });

  it('Yanlış değer girildiğinde "Sil" butonu hala pasif olmalı', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Test İşletmesi');
    const deleteButton = screen.getByRole('button', { name: /kalıcı olarak sil/i });

    fireEvent.change(input, { target: { value: 'Yanlış İsim' } });
    expect(deleteButton).toBeDisabled();
  });

  it('Doğru değer girildiğinde "Sil" butonu aktifleşmeli', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Test İşletmesi');
    const deleteButton = screen.getByRole('button', { name: /kalıcı olarak sil/i });

    fireEvent.change(input, { target: { value: 'Test İşletmesi' } });
    expect(deleteButton).not.toBeDisabled();
  });

  it('Doğru değer girilip "Sil"e tıklandığında onConfirm çağrılmalı', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Test İşletmesi');
    const deleteButton = screen.getByRole('button', { name: /kalıcı olarak sil/i });

    fireEvent.change(input, { target: { value: 'Test İşletmesi' } });
    fireEvent.click(deleteButton);

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('"Vazgeç" tıklandığında onClose çağrılmalı', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /vazgeç/i });
    
    fireEvent.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
