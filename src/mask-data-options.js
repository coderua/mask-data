import MaskDataInvalidOptionException from './mask-data-invalid-option-exception';

/**
 * Mask Data Options
 * @typedef {{maskNull: boolean, maskString: boolean, maxMaskedChars: number, maskWith: string, unmaskedEndChars: number, maskNumber: boolean, unmaskedStartChars: number, maskUndefined: boolean, maskBoolean: boolean}} MaskDataOptionsPojo
 */

/**
 * Class represents options/configuration for masking sensitive data
 */
export default class MaskDataOptions {
  /**
   * Default options
   *
   * @static
   * @type {Readonly<MaskDataOptionsPojo>}
   */
  static defaultOptions = Object.freeze({
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
  });

  /**
   * Instance options
   *
   * @private
   * @type {MaskDataOptionsPojo}
   */
  #options;

  /**
   * Class constructor
   *
   * @param {MaskDataOptions|Object|MaskDataOptionsPojo|undefined} [maskOptions=undefined] Mask options. Optional
   */
  constructor(maskOptions = undefined) {
    this.options = maskOptions;
  }

  /**
   * Clones an existing instance of MaskDataOptions.
   *
   * @returns {MaskDataOptions}
   */
  clone() {
    return new MaskDataOptions(this.#options);
  }

  /**
   * Getter for a mask default configuration.
   *
   * @returns {Readonly<MaskDataOptionsPojo>}
   */
  get defaultOptions() {
    return MaskDataOptions.defaultOptions;
  }

  /**
   * Getter for a mask configuration.
   *
   * @returns {MaskDataOptionsPojo}
   */
  get options() {
    return this.#options;
  }

  /**
   * Setter for a mask configuration.
   *
   * @param {MaskDataOptionsPojo|MaskDataOptions|{}|undefined} [options=undefined]
   */
  set options(options) {
    this.#options =
      options instanceof MaskDataOptions ? options.options : this.#validateOptions(this.#mergeOptions(options));
  }

  // -------
  // Getters
  // -------

  /**
   * Getter for a mask symbol.
   *
   * @returns {string}
   */
  get maskWith() {
    return this.#options.maskWith;
  }

  /**
   * Getter for a maximum number of masked characters.
   *
   * @returns {number}
   */
  get maxMaskedChars() {
    return this.#options.maxMaskedChars;
  }

  /**
   * Getter for a number of unmasked characters from the start.
   *
   * @returns {number}
   */
  get unmaskedStartChars() {
    return this.#options.unmaskedStartChars;
  }

  /**
   * Getter for a number of unmasked characters from the end.
   *
   * @returns {number}
   */
  get unmaskedEndChars() {
    return this.#options.unmaskedEndChars;
  }

  /**
   * Getter for a maskString option.
   *
   * @returns {boolean}
   */
  get maskString() {
    return this.#options.maskString;
  }

  /**
   * Getter for a maskNumber option.
   *
   * @returns {boolean}
   */
  get maskNumber() {
    return this.#options.maskNumber;
  }

  /**
   * Getter for a maskBoolean option.
   *
   * @returns {boolean}
   */
  get maskBoolean() {
    return this.#options.maskBoolean;
  }

  /**
   * Getter for a maskUndefined option.
   *
   * @returns {boolean}
   */
  get maskUndefined() {
    return this.#options.maskUndefined;
  }

  /**
   * Getter for a maskNull option.
   *
   * @returns {boolean}
   */
  get maskNull() {
    return this.#options.maskNull;
  }

  /**
   * Merges provided configuration with a default one.
   *
   * @private
   * @param {Object|MaskDataOptionsPojo} [maskOptions={}] Mask options. Optional
   * @returns {MaskDataOptionsPojo}
   */
  #mergeOptions(maskOptions = {}) {
    if (!maskOptions || typeof maskOptions !== 'object' || Object.keys(maskOptions).length === 0) {
      return { ...MaskDataOptions.defaultOptions };
    }

    const mergedOptions = {
      ...MaskDataOptions.defaultOptions,
      ...this.#options,
      ...(maskOptions && typeof maskOptions === 'object' ? maskOptions : {}),
    };

    Object.keys(MaskDataOptions.defaultOptions).forEach((name) => {
      if (mergedOptions[name] === undefined || mergedOptions[name] === null) {
        mergedOptions[name] = MaskDataOptions.defaultOptions[name];
      }
    });

    return mergedOptions;
  }

  /**
   * Validates configuration options.
   *
   * @private
   * @param {Object} [maskOptions={}] Mask options to validate
   * @returns {MaskDataOptionsPojo}
   * @throws MaskDataInvalidOptionException
   */
  #validateOptions(maskOptions = {}) {
    const reasons = [];
    const normalizedOptions = {
      ...(typeof maskOptions === 'object' ? maskOptions : {}),
      maxMaskedChars: parseInt(maskOptions.maxMaskedChars, 10),
      unmaskedStartChars: parseInt(maskOptions.unmaskedStartChars, 10),
      unmaskedEndChars: parseInt(maskOptions.unmaskedEndChars, 10),
    };

    // Options supports positive integers values only
    ['maxMaskedChars', 'unmaskedStartChars', 'unmaskedEndChars']
      .filter((option) => isNaN(normalizedOptions[option]) || normalizedOptions[option] < 0)
      .forEach((option) => reasons.push(`'${option}' option value must be a positive integer.`));

    // Options supports boolean values only
    ['maskString', 'maskNumber', 'maskBoolean', 'maskUndefined', 'maskNull']
      .filter((option) => normalizedOptions[option] !== true && normalizedOptions[option] !== false)
      .forEach((option) => reasons.push(`'${option}' option value must be a boolean.`));

    if (!normalizedOptions.maskWith || normalizedOptions.maskWith.toString().length <= 0) {
      normalizedOptions.maskWith = MaskDataOptions.defaultOptions.maskWith;
    }

    if (reasons.length > 0) {
      throw new MaskDataInvalidOptionException('Invalid mask configuration', reasons);
    }

    return normalizedOptions;
  }

  /**
   * Returns a plain object representation of the mask configuration.
   *
   * @returns {MaskDataOptionsPojo}
   */
  toPojo() {
    return this.#options;
  }

  /**
   * Returns a JSON representation of the mask configuration.
   *
   * @returns {MaskDataOptionsPojo}
   */
  toJSON() {
    return this.#options;
  }

  /**
   * Returns a string representation of the mask configuration.
   *
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this.#options);
  }
}
