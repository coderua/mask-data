import MaskData from '../src/mask-data';

describe('Tests MaskData class with defaults (Full masking).', () => {
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
        expect(instance.defaultMaskOptions).toStrictEqual(expected);
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

            }
        };

        const expected = {
            'key1': '*******',
            'key2': '*******',
            'key3': {
                'key31': '********',
                'key32': {
                    'key321': '*********',
                    'key322': '*********'
                }
            }
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
            [
                'secret41',
                'secret42',
                'secret43',
                [
                    'secret441',
                    'secret442',
                    'secret443'
                ]
            ]
        ];

        const expected = [
            '*******',
            '*******',
            '*******',
            [
                '********',
                '********',
                '********',
                [
                    '*********',
                    '*********',
                    '*********'
                ]
            ]
        ];

        // 2. Act
        const actual = instance.mask(input);

        // 3. Assert
        expect(actual).toStrictEqual(expected);
    });
});

describe('Tests MaskData class with different mask options.', () => {
    test('it should limit masked string to 10 symbols', () => {
        const config = {
            maxMaskedChars: 10
        };

        const actual = new MaskData(config).mask('Super_D00per_Secret');

        expect(actual.length).toBe(config.maxMaskedChars);
    });

    test('it should left unmasked 2 symbols at the start of a string', () => {
        const config = {
            unmaskedStartChars: 2
        };

        const actual = new MaskData(config).mask('Super_D00per_Secret');

        expect(actual).toBe('Su**************');
    });

    test('it should left unmasked 3 symbols at the end of a string', () => {
        const config = {
            unmaskedEndChars: 3
        };

        const actual = new MaskData(config).mask('Super_D00per_Secret');

        expect(actual).toBe('*************ret');
    });

    test('it should not mask a string if it is disabled by config', () => {
        const config = {
            maskString: false
        };

        const actual = new MaskData(config).mask('Super_D00per_Secret');

        expect(actual).toBe('Super_D00per_Secret');
    });
});
