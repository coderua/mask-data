import MaskDataOptions from '../src/mask-data-options';
import MaskDataInvalidOptionException from '../src/mask-data-invalid-option-exception';

describe('Tests MaskDataOptions class with defaults', () => {
  test('it should create an instance of MaskDataOptions class', () => {
    expect(new MaskDataOptions()).toBeInstanceOf(MaskDataOptions);
  });

  test('it should clone an instance of MaskDataOptions class', () => {
    const instance = new MaskDataOptions();
    const cloned = new MaskDataOptions().clone();

    expect(instance).toBeInstanceOf(MaskDataOptions);
    expect(cloned).toBeInstanceOf(MaskDataOptions);
    expect(instance !== cloned).toBe(true);
    expect(cloned.options).toStrictEqual(instance.options);
  });

  test('it should return Default MaskDataOptions for instance', () => {
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
    expect(new MaskDataOptions().defaultOptions).toStrictEqual(expected);
    expect(new MaskDataOptions().options).toStrictEqual(expected);
  });
});

describe('Tests MaskDataOptions class with different "options"', () => {
  test.each([
    // Options supports positive integers values only
    { maxMaskedChars: 'not supported' },
    { unmaskedStartChars: 'not supported' },
    { unmaskedEndChars: 'not supported' },

    // Options supports boolean values only
    { maskString: 'not supported' },
    { maskNumber: 'not supported' },
    { maskBoolean: 'not supported' },
    { maskUndefined: 'not supported' },
    { maskNull: 'not supported' },
  ])(
    'it should throw an "MaskDataInvalidOptionException" if instantiate "MaskDataOptions" with an invalid masking option "%o"',
    (options) => {
      expect(() => new MaskDataOptions(options)).toThrowError(MaskDataInvalidOptionException);
    }
  );

  test('it should return the same MaskDataOptions configuration as was passed in the constructor', () => {
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

    // 2. Assert
    expect(new MaskDataOptions(options).options).toStrictEqual(options);
  });

  test('it should return the same MaskDataOptions configuration as was set by setter', () => {
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
    const instance = new MaskDataOptions();
    instance.options = options;

    // 3. Assert
    expect(instance.options).toStrictEqual(options);
  });

  test('it should return the MaskDataOptions configuration if the instance of MaskDataOptions passed in the constructor param', () => {
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
    const instance = new MaskDataOptions(new MaskDataOptions(options));

    // 3. Assert
    expect(instance.options).toStrictEqual(options);
  });

  test('it should update only new options in the existent MaskDataOptions configuration', () => {
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
    const instance = new MaskDataOptions(options);
    instance.options = { maskWith: 'x', maxMaskedChars: 24, unmaskedStartChars: 2 };

    // 3. Assert
    expect(instance.options).toStrictEqual({
      maskWith: 'x',
      maxMaskedChars: 24,
      unmaskedStartChars: 2,
      unmaskedEndChars: 0,
      maskString: false,
      maskNumber: false,
      maskBoolean: false,
      maskUndefined: false,
      maskNull: false,
    });
  });
});
