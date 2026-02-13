// src/users/validation.service.ts
import validator from 'validator';

export class UserValidationService {
  /**
   * Validasi register user
   * @param data object { name, email, password }
   * @returns string error message, kosong jika valid
   */
  static validateRegister(data: {
    name?: string;
    email?: string;
    password?: string;
  }): string {
    const { name, email, password } = data;

    if (!name || name.trim().length === 0) {
      return 'Name is required';
    }

    if (!email || !validator.isEmail(email)) {
      return 'Valid email is required';
    }

    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return ''; // valid
  }
}
