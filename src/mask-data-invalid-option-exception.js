/**
 * Helper to set a message property in an Error instance.
 *
 * @param {String} message
 * @param {Array} [reasons=[]]
 * @returns {string}
 */
const errorMessage = (message, reasons = []) => {
    return Array.isArray(reasons) && reasons.length > 0
        ? `${message}. Details: ${JSON.stringify({ reasons })}`
        : message;
};

/**
 * Validation Exception class for invalid options.
 *
 * @extends Error
 */
export default class MaskDataInvalidOptionException extends Error {
    /**
     * Class constructor
     *
     * @param {String} [message='Invalid mask configuration'] Error message
     * @param {Array} [reasons=[]] Error reasons for the error
     */
    constructor(message= 'Invalid mask configuration', reasons = []) {
        let x = '';
        super(errorMessage(message || 'Invalid mask configuration', reasons));

        this.name = this.constructor.name;
        this.reasons = reasons;
    }
}
