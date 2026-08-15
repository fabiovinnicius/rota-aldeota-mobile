export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export function validateReadingInput(input: string, previousReading: number): ValidationResult {
  if (!input || input.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'O campo de leitura é obrigatório.',
    };
  }

  const numericValue = Number(input.trim());

  if (isNaN(numericValue)) {
    return {
      isValid: false,
      errorMessage: 'O valor da leitura deve ser um número válido.',
    };
  }

  if (numericValue < 0) {
    return {
      isValid: false,
      errorMessage: 'O valor da leitura não pode ser negativo.',
    };
  }

  if (numericValue < previousReading) {
    return {
      isValid: true,
      errorMessage: `Atenção: A nova leitura (${numericValue}) é inferior à leitura anterior (${previousReading}).`,
    };
  }

  return {
    isValid: true,
  };
}
