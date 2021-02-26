# mask-data
Masks sensitive data

## Install

```
$ npm install @coder.ua/mask-data
```

## Usage

### Mask data with zero configuration
```javascript
import MaskData from '@coder.ua/mask-data';

const maskedData = new MaskData()
    .mask('Your sensitive data to mask.');

// maskedData => '****************'
```

### Default options
```javascript
const options = {
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
}
```

### Mask data with configuration
```javascript
import MaskData from '@coder.ua/mask-data';

const config = { maskWith: 'X', maxMaskedChars: 10, unmaskedStartChars: 2, unmaskedEndChars: 3, };
const maskedData = new MaskData(config)
    .mask('Your sensitive data to mask.');

// maskedData => 'YoXXXXXask'
```

### Mask nested object values
```javascript
import MaskData from '@coder.ua/mask-data';

const sensitiveData = {
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

const maskedData = new MaskData()
    .mask(sensitiveData);

/*
maskedData => 
{
    "key1": "*******",
    "key2": "*******",
    "key3": {
    "key31": "********",
        "key32": {
            "key321": "*********",
            "key322": "*********"
        }
    }
}
 */
```
### Mask nested array values
```javascript
import MaskData from '@coder.ua/mask-data';

const sensitiveData = [
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

const maskedData = new MaskData()
    .mask(sensitiveData);

/*
maskedData => 
[
    "*******",
    "*******",
    "*******",
    [
        "********",
        "********",
        "********",
        [
            "*********",
            "*********",
            "*********"
        ]
    ]
]
 */
```
