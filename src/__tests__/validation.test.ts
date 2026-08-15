import { validateReadingInput } from '../utils/validation';

describe('validateReadingInput', () => {
  it('should invalidate empty or whitespace input', () => {
    const result = validateReadingInput('', 1000);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('O campo de leitura é obrigatório.');
  });

  it('should invalidate non-numeric input', () => {
    const result = validateReadingInput('abc', 1000);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('O valor da leitura deve ser um número válido.');
  });

  it('should invalidate negative numeric input', () => {
    const result = validateReadingInput('-50', 1000);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe('O valor da leitura não pode ser negativo.');
  });

  it('should validate valid positive reading greater than previous reading', () => {
    const result = validateReadingInput('1250', 1000);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  it('should return warning message if reading is smaller than previous reading', () => {
    const result = validateReadingInput('800', 1000);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toContain('Atenção: A nova leitura');
  });
});
