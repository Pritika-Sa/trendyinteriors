// Password validation utility
export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\\[\]{};':"|,.<>/?]/.test(password);
    return {
        isValid: password.length >= minLength && hasUpperCase && hasSymbol,
        errors: {
            minLength: password.length < minLength ? `Password must be at least ${minLength} characters` : '',
            uppercase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : '',
            symbol: !hasSymbol ? 'Password must contain at least one symbol (!@#$%^&*)' : ''
        }
    };
};

export const getPasswordStrengthMessage = () => {
    return 'Password must be at least 8 characters with 1 uppercase letter and 1 symbol';
};
