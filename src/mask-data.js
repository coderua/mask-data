import MaskDataOptions from './mask-data-options';

/**
 * Mask Data Options
 * @typedef {{maskNull: boolean, maskString: boolean, maxMaskedChars: number, maskWith: string, unmaskedEndChars: number, maskNumber: boolean, unmaskedStartChars: number, maskUndefined: boolean, maskBoolean: boolean}} MaskDataOptionsPojo
 */

/**
 * Class for masking sensitive data
 */
export default class MaskData {
  /**
   * @type {MaskDataOptions}
   */
  #options = new MaskDataOptions();

  /**
   * Class constructor
   *
   * @param {MaskDataOptions|MaskDataOptionsPojo|Object} [maskOptions={}] Mask options. Optional. Available options: maskWith, maxMaskedChars, unmaskedStartChars, unmaskedEndChars, maskString, maskNumber, maskBoolean, maskUndefined, maskNull
   */
  constructor(maskOptions = {}) {
    this.options = maskOptions;
  }

  /**
   * Setters for options
   *
   * @param {Object|MaskDataOptions|MaskDataOptionsPojo} options
   */
  set options(options) {
    this.#options.options = options;
  }

  /**
   * Getters for options
   *
   * @returns {MaskDataOptions}
   */
  get options() {
    return this.#options;
  }

  /**
   * Checks if sensitive data should be masked.
   *
   * @private
   * @param {*} sensitiveData
   * @returns {boolean}
   */
  #shouldBeMasked(sensitiveData) {
    if (sensitiveData === null) {
      return this.#options.maskNull;
    }

    if (sensitiveData === undefined) {
      return this.#options.maskUndefined;
    }

    if (sensitiveData === true || sensitiveData === false) {
      return this.#options.maskBoolean;
    }

    if (typeof sensitiveData === 'string') {
      return this.#options.maskString;
    }

    if (typeof sensitiveData === 'number') {
      return this.#options.maskNumber;
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
  #doMask(sensitiveData) {
    if (this.#shouldBeMasked(sensitiveData) === false) {
      return sensitiveData;
    }

    const data = typeof sensitiveData === 'string' ? sensitiveData : String(sensitiveData);
    let maskLength = data.length;

    if (data.length > this.#options.maxMaskedChars) {
      maskLength = parseInt(this.#options.maxMaskedChars, 10);
    }

    const maskingCharacters = maskLength - this.#options.unmaskedStartChars - this.#options.unmaskedEndChars;

    if (maskingCharacters < 0) {
      if (maskLength <= this.#options.unmaskedStartChars) {
        return data.substring(0, maskLength);
      }

      let maskedData = data.substring(0, this.#options.unmaskedStartChars);
      const remainingChars = maskLength - this.#options.unmaskedStartChars;

      for (let i = data.length - remainingChars; i < data.length; i += 1) {
        maskedData += data[i];
      }

      return maskedData;
    }

    let maskedData = data.substring(0, this.#options.unmaskedStartChars);

    maskedData += `${this.#options.maskWith}`.repeat(maskingCharacters);

    for (let i = data.length - this.#options.unmaskedEndChars; i < data.length; i += 1) {
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
      return this.#doMask(sensitiveData);
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

    return this.#doMask(sensitiveData);
  }
}
