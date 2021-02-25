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
     * @returns {{maxMaskedChars: number, maskWith: string, unmaskedEndChars: number, unmaskedStartChars: number}}
     */
    get defaultMaskOptions() {
        return {
            maskWith: '*',
            maxMaskedChars: 16,
            unmaskedStartChars: 0,
            unmaskedEndChars: 0
        };
    }

    /**
     * Merges provided configuration with a default one.
     *
     * @private
     * @param {Object} [maskOptions={}] Mask options. Optional
     * @returns {{maxMaskedChars: number, maskWith: string, unmaskedEndChars: number, unmaskedStartChars: number}}
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
     * @returns {{maxMaskedChars: number, unmaskedEndChars: number, unmaskedStartChars: number}}
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

        ['maxMaskedChars', 'unmaskedStartChars', 'unmaskedEndChars']
            .filter((option) => isNaN(normalizedOptions[option]) || normalizedOptions[option] < 0)
            .forEach((option) => reasons.push(`'${option}' option value must be a positive integer.`));


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
     * Masks sensitive data.
     *
     * @param {*} sensitiveData
     * @returns {string|*}
     */
    mask(sensitiveData) {
        if (!sensitiveData) {
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
}
