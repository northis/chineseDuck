module.exports = {
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "env": {
        "browser": false,
        "es6": true,
        "node": true
    },
    "rules": {
        'no-console': [
            'error',
            {
                allow: ['warn', 'error', 'info'],
            },
        ]
    }
};