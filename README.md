# nested-diff

Calculating deep difference for JavaScript objects. Inspired by https://github.com/flitbit/diff

## Example Usage

```js
var nestedDiff = require('nested-diff').nestedDiff;

var lhs = {
    name: 'my object',
    description: 'it\'s an object!',
    details: {
        it: 'has',
        an: 'array',
        with: ['a', 'few', 'elements']
    }
};

var rhs = {
    name: 'updated object',
    hello: 'world',
    details: {
        it: 'has',
        an: 'what',
        with: ['elements', 'a', 'few', 'more', { than: 'before' }]
    }
};

nestedDiff(lhs, rhs);
```

```json
[
    {
        "kind": "E",
        "key": "name",
        "lhs": "my object",
        "rhs": "updated object"
    },
    {
        "kind": "D",
        "key": "description",
        "lhs": "it's an object!"
    },
    {
        "kind": "E",
        "key": "details",
        "lhs": {
            "it": "has",
            "an": "array",
            "with": [
                "a",
                "few",
                "elements"
            ]
        },
        "rhs": {
            "it": "has",
            "an": "what",
            "with": [
                "elements",
                "a",
                "few",
                "more",
                {
                    "than": "before"
                }
            ]
        },
        "differences": [
            {
                "kind": "E",
                "key": "an",
                "lhs": "array",
                "rhs": "what"
            },
            {
                "kind": "A",
                "key": "with",
                "lhs": [
                    "a",
                    "few",
                    "elements"
                ],
                "rhs": [
                    "elements",
                    "a",
                    "few",
                    "more",
                    {
                        "than": "before"
                    }
                ],
                "differences": [
                    {
                        "kind": "E",
                        "key": 0,
                        "lhs": "a",
                        "rhs": "elements"
                    },
                    {
                        "kind": "E",
                        "key": 1,
                        "lhs": "few",
                        "rhs": "a"
                    },
                    {
                        "kind": "E",
                        "key": 2,
                        "lhs": "elements",
                        "rhs": "few"
                    },
                    {
                        "kind": "A",
                        "key": 3,
                        "lhs": "more"
                    },
                    {
                        "kind": "A",
                        "key": 4,
                        "lhs": {
                            "than": "before"
                        }
                    }
                ]
            }
        ]
    },
    {
        "kind": "N",
        "key": "hello",
        "rhs": "world"
    }
]
```

- `kind` - indicates the kind of change; will be one of the following:
    - `N` - indicates a newly added property/element
    - `D` - indicates a property/element was deleted
    - `E` - indicates a property/element was edited
    - `A` - indicates a change occurred within an array
- `key` - the property name
- `lhs` - the value on the left-hand-side of the comparison (undefined if kind === 'N')
- `rhs` - the value on the right-hand-side of the comparison (undefined if kind === 'D')
- `differences` - Nested differences
