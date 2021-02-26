/* eslint-disable no-restricted-globals */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

import MaskDataInvalidOptionException from './mask-data-invalid-option-exception';

/**
 * Class for masking sensitive data
 */
export default class MaskData {
    /**
     * Class constructor
     *
     * @param {Object} [maskOptions={}] Mask options. Optional
     */
    constructor(maskOptions = {}) {
        this.options = this._validateOptions(
            this._mergeWithDefaultValues(maskOptions)
        );
    }

    /**
     * Getter for a mask default configuration.
     *
     * @returns {{maskNull: boolean, maskString: boolean, maxMaskedChars: number, maskWith: string, unmaskedEndChars: number, maskNumber: boolean, unmaskedStartChars: number, maskUndefined: boolean, maskBoolean: boolean}}
     */
    get defaultMaskOptions() {
        return {
            // A symbol for masking
            maskWith: '*',
            // Limits the output string length to 16
            maxMaskedChars: 16,
            // First N symbols that won't be masked
            unmaskedStartChars: 0,
            // Last N symbols that won't be masked
            unmaskedEndChars: 0,
            // Mask data with type 'string'
            maskString: true,
            // Mask data with type 'number'
            maskNumber: true,
            // Mask data with type 'boolean'
            maskBoolean: true,
            // Mask 'undefined' data
            maskUndefined: true,
            // Mask 'null' data
            maskNull: true,
        };
    }

    /**
     * Merges provided configuration with a default one.
     *
     * @private
     * @param {Object} [maskOptions={}] Mask options. Optional
     * @returns {{[p: string]: *}}
     */
    _mergeWithDefaultValues(maskOptions = {}) {
        const mergedOptions = {
            ...this.defaultMaskOptions,
            ...typeof maskOptions === 'object' ? maskOptions : {},
        };

        Object.keys(this.defaultMaskOptions)
            .forEach((name) => {
                if (mergedOptions[name] === undefined || mergedOptions[name] === null) {
                    mergedOptions[name] = this.defaultMaskOptions[name];
                }
            });

        return mergedOptions;
    }

    /**
     * Validates configuration options.
     *
     * @private
     * @param {Object} [maskOptions={}] Mask options to validate
     * @returns {{maskNull: boolean, maskString: boolean, maxMaskedChars: number, maskWith: string, unmaskedEndChars: number, maskNumber: boolean, unmaskedStartChars: number, maskUndefined: boolean, maskBoolean: boolean}}
     * @throws MaskDataInvalidOptionException
     */
    _validateOptions(maskOptions = {}) {
        const reasons = [];
        const normalizedOptions = {
            ...typeof maskOptions === 'object' ? maskOptions : {},
            maxMaskedChars: parseInt(maskOptions.maxMaskedChars, 10),
            unmaskedStartChars: parseInt(maskOptions.unmaskedStartChars, 10),
            unmaskedEndChars: parseInt(maskOptions.unmaskedEndChars, 10),
        };

        // Options supports positive integers values only
        ['maxMaskedChars', 'unmaskedStartChars', 'unmaskedEndChars']
            .filter((option) => isNaN(normalizedOptions[option]) || normalizedOptions[option] < 0)
            .forEach((option) => reasons.push(`'${option}' option value must be a positive integer.`));

        // Options supports boolean values only
        [
            'maskString',
            'maskNumber',
            'maskBoolean',
            'maskUndefined',
            'maskNull',
        ]
            .filter((option) => normalizedOptions[option] !== true && normalizedOptions[option] !== false)
            .forEach((option) => reasons.push(`'${option}' option value must be a boolean.`));


        if (!normalizedOptions.maskWith || normalizedOptions.maskWith.toString().length <= 0) {
            normalizedOptions.maskWith = this.defaultMaskOptions.maskWith;
        }

        if (reasons.length > 0) {
            console.log('Errors => ', reasons);
            throw new MaskDataInvalidOptionException('Invalid mask configuration', reasons);
        }

        return normalizedOptions;
    }

    /**
     * Checks if sensitive data should be masked.
     *
     * @private
     * @param {*} sensitiveData
     * @returns {boolean}
     */
    _shouldBeMasked(sensitiveData) {
        if (sensitiveData === null) {
            return this.options.maskNull;
        }

        if (sensitiveData === undefined) {
            return this.options.maskUndefined;
        }

        if (sensitiveData === true || sensitiveData === false) {
            return this.options.maskBoolean;
        }

        if (typeof sensitiveData === 'string') {
            return this.options.maskString;
        }

        if (typeof sensitiveData === 'number') {
            return this.options.maskNumber;
        }

        return true;
    }

    /**
     * Do all the job to mask a sensitive data.
     *
     * @private
     * @param {*} sensitiveData
     * @returns {string|*}
     */
    _doMask(sensitiveData) {
        if (this._shouldBeMasked(sensitiveData) === false) {
            return sensitiveData;
        }

        const data = typeof sensitiveData === 'string' ? sensitiveData : String(sensitiveData);
        let maskLength = data.length;

        if (data.length > this.options.maxMaskedChars) {
            maskLength = parseInt(this.options.maxMaskedChars, 10);
        }

        const maskingCharacters = maskLength - this.options.unmaskedStartChars - this.options.unmaskedEndChars;

        if (maskingCharacters < 0) {
            if (maskLength <= this.options.unmaskedStartChars) {
                return data.substr(0, maskLength);
            }

            let maskedData = data.substr(0, this.options.unmaskedStartChars);
            const remainingChars = maskLength - this.options.unmaskedStartChars;

            for (let i = data.length - remainingChars; i < data.length; i += 1) {
                maskedData += data[i];
            }

            return maskedData;
        }

        let maskedData = data.substr(0, this.options.unmaskedStartChars);

        maskedData += `${this.options.maskWith}`.repeat(maskingCharacters);

        for (let i = data.length - this.options.unmaskedEndChars; i < data.length; i += 1) {
            maskedData += data[i];
        }

        return maskedData;
    }

    /**
     * Masks sensitive data.
     *
     * Recursive method that support different types of Sensitive Data.
     * You can provide strings, numbers, booleans, arrays, objects.
     *
     * @public
     * @param {*} sensitiveData
     * @param {Array} whiteListFields The fields that won't be masked at all. Used if sensitiveData is an object.
     * @param {Array} blackListFields The fields won't be appeared in a result. Used if sensitiveData is an object
     * @returns {*}
     */
    mask(sensitiveData, whiteListFields = [], blackListFields = []) {
        if (Array.isArray(sensitiveData)) {
            return sensitiveData.map((item) => this.mask(item, whiteListFields, blackListFields));
        }

        if (sensitiveData === undefined || sensitiveData === null) {
            return this._doMask(sensitiveData);
        }

        if (typeof sensitiveData === 'object') {
            const maskedData = {};

            Object.keys(sensitiveData)
                .filter((key) => !blackListFields.includes(key))
                .forEach((key) => {
                    maskedData[key] = whiteListFields.includes(key)
                        ? sensitiveData[key]
                        : this.mask(sensitiveData[key], whiteListFields, blackListFields);
                });

            return maskedData;
        }

        return this._doMask(sensitiveData);
    }
}
