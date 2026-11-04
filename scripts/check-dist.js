// Smoke test of the built package: loads it by its name, as consumers do, with both `require` and `import`.
// Runs after `npm run build`, so a broken entry point (e.g. a CommonJS build loaded as an ES module) fails the build.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const expectedExports = ['MaskData', 'MaskDataInvalidOptionException', 'MaskDataOptions'];

const entries = {
  require: require('@coder.ua/mask-data'),
  import: await import('@coder.ua/mask-data'),
};

Object.entries(entries).forEach(([loader, mod]) => {
  expectedExports.forEach((name) => {
    assert.equal(typeof mod[name], 'function', `${loader}: "${name}" is not exported`);
  });

  assert.equal(new mod.MaskData().mask('secret'), '******', `${loader}: MaskData does not mask data`);
});

console.log(`dist is valid for ${Object.keys(entries).join(' and ')}`);
