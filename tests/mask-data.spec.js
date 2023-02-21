import MaskData from '../src/mask-data';
import MaskDataOptions from '../src/mask-data-options';

describe('Tests MaskData class with defaults', () => {
  let instance;

  beforeEach(() => {
    instance = new MaskData();
  });

  test('it should create an instance of MaskData class', () => {
    expect(instance).toBeInstanceOf(MaskData);
  });

  test('it should return Default Mask Options for instance', () => {
    // 1. Arrange
    const expected = {
      maskWith: '*',
      maxMaskedChars: 16,
      unmaskedStartChars: 0,
      unmaskedEndChars: 0,
      maskString: true,
      maskNumber: true,
      maskBoolean: true,
      maskUndefined: true,
      maskNull: true,
    };

    // 2. Assert
    expect(instance.options).toBeInstanceOf(MaskDataOptions);
    expect(instance.options.toPojo()).toStrictEqual(expected);
    expect(instance.options.toJSON()).toStrictEqual(expected);
    expect(instance.options.toString()).toStrictEqual(JSON.stringify(expected));
  });

  test('it should mask strings', () => {
    const actual = instance.mask('secret');

    expect(actual).toBe('******');
  });

  test('it should mask numbers', () => {
    const actual = instance.mask(1234567890);

    expect(actual).toBe('**********');
  });

  test('it should mask boolean', () => {
    expect(instance.mask(true)).toBe('****');
    expect(instance.mask(false)).toBe('*****');
  });

  test('it should mask nested objects', () => {
    // 1. Arrange
    const input = {
      key1: 'secret1',
      key2: 'secret2',
      key3: {
        key31: 'secret31',
        key32: {
          key321: 'secret321',
          key322: 'secret322',
        },
      },
    };

    const expected = {
      key1: '*******',
      key2: '*******',
      key3: {
        key31: '********',
        key32: {
          key321: '*********',
          key322: '*********',
        },
      },
    };

    // 2. Act
    const actual = instance.mask(input);

    // 3. Assert
    expect(actual).toStrictEqual(expected);
  });

  test('it should mask nested arrays', () => {
    // 1. Arrange
    const input = [
      'secret1',
      'secret2',
      'secret3',
      ['secret41', 'secret42', 'secret43', ['secret441', 'secret442', 'secret443']],
    ];

    const expected = [
      '*******',
      '*******',
      '*******',
      ['********', '********', '********', ['*********', '*********', '*********']],
    ];

    // 2. Act
    const actual = instance.mask(input);

    // 3. Assert
    expect(actual).toStrictEqual(expected);
  });
});

describe('Tests MaskData class setting masking options', () => {
  test('it should should update only new options for the MaskData instance created with defaults', () => {
    // 1. Act
    const instance = new MaskData();
    instance.options = { maskWith: 'x', maxMaskedChars: 24, unmaskedStartChars: 2 };

    const expected = {
      ...MaskDataOptions.defaultOptions,
      maskWith: 'x',
      maxMaskedChars: 24,
      unmaskedStartChars: 2,
    };

    // 2. Assert
    expect(instance.options).toBeInstanceOf(MaskDataOptions);
    expect(instance.options.toPojo()).toStrictEqual(expected);
    expect(instance.options.toJSON()).toStrictEqual(expected);
    expect(instance.options.toString()).toStrictEqual(JSON.stringify(expected));
  });

  test('it should should update only new options for the MaskData instance created with custom options', () => {
    // 1. Arrange and Act
    const instance = new MaskData({
      maskWith: '*',
      maxMaskedChars: 16,
      unmaskedStartChars: 0,
      unmaskedEndChars: 0,
      maskString: false,
      maskNumber: false,
      maskBoolean: false,
      maskUndefined: false,
      maskNull: false,
    });
    instance.options = { maskWith: 'x', maxMaskedChars: 24, unmaskedStartChars: 2 };
    instance.options = { maskNull: true };

    const expected = {
      maskWith: 'x',
      maxMaskedChars: 24,
      unmaskedStartChars: 2,
      unmaskedEndChars: 0,
      maskString: false,
      maskNumber: false,
      maskBoolean: false,
      maskUndefined: false,
      maskNull: true,
    };

    // 3. Assert
    expect(instance.options).toBeInstanceOf(MaskDataOptions);
    expect(instance.options.toPojo()).toStrictEqual(expected);
    expect(instance.options.toJSON()).toStrictEqual(expected);
    expect(instance.options.toString()).toStrictEqual(JSON.stringify(expected));
  });

  test('it should set new MaskDataOptions for the MaskData instance', () => {
    // 1. Arrange
    const options = {
      maskWith: '*',
      maxMaskedChars: 16,
      unmaskedStartChars: 0,
      unmaskedEndChars: 0,
      maskString: false,
      maskNumber: false,
      maskBoolean: false,
      maskUndefined: false,
      maskNull: false,
    };

    // 2. Act
    const instance = new MaskData(options);
    instance.options = { maskWith: 'x', maxMaskedChars: 24, unmaskedStartChars: 2 };
    instance.options = { maskNull: true };
    instance.options = new MaskDataOptions({ maskNumber: true });

    const expected = {
      ...MaskDataOptions.defaultOptions,
      maskNumber: true,
    };

    // 3. Assert
    expect(instance.options).toBeInstanceOf(MaskDataOptions);
    expect(instance.options.toPojo()).toStrictEqual(expected);
    expect(instance.options.toJSON()).toStrictEqual(expected);
    expect(instance.options.toString()).toStrictEqual(JSON.stringify(expected));
  });
});

describe('Tests MaskData class with different mask options.', () => {
  test('it should return custom Mask Options for instance', () => {
    // 1. Arrange
    const options = {
      maskWith: '*',
      maxMaskedChars: 16,
      unmaskedStartChars: 0,
      unmaskedEndChars: 0,
      maskString: false,
      maskNumber: false,
      maskBoolean: false,
      maskUndefined: false,
      maskNull: false,
    };

    // 2. Act
    const instance = new MaskData(options);

    // 3. Assert
    expect(instance.options).toBeInstanceOf(MaskDataOptions);
    expect(instance.options.toPojo()).toStrictEqual(options);
  });

  test('it should limit masked string to 10 symbols', () => {
    const options = {
      maxMaskedChars: 10,
    };

    const actual = new MaskData(options).mask('Super_D00per_Secret');

    expect(actual.length).toBe(options.maxMaskedChars);
  });

  test('it should left unmasked 2 symbols at the start of a string', () => {
    const options = {
      unmaskedStartChars: 2,
    };

    const actual = new MaskData(options).mask('Super_D00per_Secret');

    expect(actual).toBe('Su**************');
  });

  test('it should left unmasked 3 symbols at the end of a string', () => {
    const options = {
      unmaskedEndChars: 3,
    };

    const actual = new MaskData(options).mask('Super_D00per_Secret');

    expect(actual).toBe('*************ret');
  });

  test('it should not mask a string if it is disabled by options', () => {
    const options = {
      maskString: false,
    };

    const actual = new MaskData(options).mask('Super_D00per_Secret');

    expect(actual).toBe('Super_D00per_Secret');
  });

  test('it should not mask "undefined" if it is disabled by options', () => {
    const options = {
      maskUndefined: false,
    };

    const actual = new MaskData(options).mask(undefined);

    expect(actual).toBe(undefined);
  });

  test('it should not mask "null" if it is disabled by options', () => {
    const options = {
      maskNull: false,
    };

    const actual = new MaskData(options).mask(null);

    expect(actual).toBe(null);
  });

  test.each([true, false])('it should not mask boolean value "%s" if it is disabled by options', (value) => {
    const options = {
      maskBoolean: false,
    };

    const actual = new MaskData(options).mask(value);

    expect(actual).toBe(value);
  });

  test.each([-1, 0, 1, 2, 3, 10, -0.1, 0.1, 1.5])(
    'it should not mask number value "%s" if it is disabled by options',
    (value) => {
      const options = {
        maskNumber: false,
      };

      const actual = new MaskData(options).mask(value);

      expect(actual).toBe(value);
    }
  );
});
