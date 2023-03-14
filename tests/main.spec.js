import { MaskData, MaskDataOptions, MaskDataInvalidOptionException } from '../src/main';

describe('Tests entry point file', () => {
  test('it should export MaskData class', () => {
    expect(MaskData).toBeInstanceOf(Function);
    expect(new MaskData()).toBeInstanceOf(MaskData);
  });

  test('it should export MaskDataOptions class', () => {
    expect(MaskDataOptions).toBeInstanceOf(Function);
    expect(new MaskDataOptions()).toBeInstanceOf(MaskDataOptions);
  });

  test('it should export MaskDataInvalidOptionException class', () => {
    expect(MaskDataInvalidOptionException).toBeInstanceOf(Function);
    expect(new MaskDataInvalidOptionException()).toBeInstanceOf(MaskDataInvalidOptionException);
  });
});
