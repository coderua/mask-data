import MaskDataInvalidOptionException from '../src/mask-data-invalid-option-exception';

describe('Tests MaskDataInvalidOptionException class with defaults', () => {
    let errorInstance;

    beforeEach(() => {
        errorInstance = new MaskDataInvalidOptionException();
    });

    test('it should successfully create an exception instance without params', () => {
        expect(errorInstance).toBeInstanceOf(MaskDataInvalidOptionException);
        expect(errorInstance.name).toBe('MaskDataInvalidOptionException');
    });

    test('it should provide a proper string representation for error instance', () => {
        const expectedErrorMsg = 'Invalid mask configuration';

        expect(errorInstance.message).toBe(expectedErrorMsg);
        expect(String(errorInstance)).toBe(`MaskDataInvalidOptionException: ${expectedErrorMsg}`);
    });
});

describe('Tests MaskDataInvalidOptionException class', () => {
    let errorInstance;

    const message = 'Mask options validation';
    const validationReasons = [
        '\'maxMaskedChars\' option value must be a positive integer.',
        '\'maskNull\' option value must be a boolean.',
    ];

    beforeEach(() => {
        errorInstance = new MaskDataInvalidOptionException(message, validationReasons);
    });

    test('it should successfully create an exception instance', () => {
        expect(errorInstance).toBeInstanceOf(MaskDataInvalidOptionException);
        expect(errorInstance.name).toBe('MaskDataInvalidOptionException');
    });

    test('it should provide a proper string representation for error instance', () => {
        const expectedErrorMsg = 'Mask options validation. Details: {"reasons":["\'maxMaskedChars\' option value must be a positive integer.","\'maskNull\' option value must be a boolean."]}';

        expect(errorInstance.message).toBe(expectedErrorMsg);
        expect(String(errorInstance)).toBe(`MaskDataInvalidOptionException: ${expectedErrorMsg}`);
    });
});
