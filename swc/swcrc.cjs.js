module.exports = {
  'env': {
    'targets': {
      'node': 10
    }
  },
  'jsc': {
    'parser': {
      'syntax': 'ecmascript'
    },
    'keepClassNames': true
  },
  'module': {
    'type': 'commonjs'
  },
  'inlineSourcesContent': true,
  'sourceMaps': 'inline',
  'isModule': true
};

