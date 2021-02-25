/**
 * Validation Exception class for an invalid options.
 */
export default class MaskDataInvalidOptionException extends Error {
    /**
     * Class constructor
     *
     * @param {String} message Error message
     * @param {Array} validationReasons Validation reasons for the error
     */
    constructor(message, validationReasons = []) {
        super(message);
        this.name = this.constructor.name;

        this.validationReasons = validationReasons;
    }

    /**
     * Convert a message to a string
     *
     * @returns {string}
     */
    toString() {
        return `Error: ${this.message}; ${JSON.stringify({
            validationReasons: this.validationReasons
        })}`;
    }
}
