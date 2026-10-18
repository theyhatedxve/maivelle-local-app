// Render real components through React Native Web without adding a test framework.
// These checks cover rendered semantics; device interactions are checked manually.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const babel = require('@babel/core');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const sourceRoot = path.resolve(__dirname, '../src');

function rewriteImports() {
  return {
    visitor: {
      ImportDeclaration(importPath) {
        const source = importPath.node.source.value;
        if (source === 'react-native') {
          importPath.node.source.value = 'react-native-web';
        } else if (source.startsWith('@/')) {
          const target = path.join(sourceRoot, source.slice(2));
          importPath.node.source.value = fs.existsSync(`${target}.web.js`) ? `${target}.web.js` : target;
        }
      },
    },
  };
}

// Restrict transpilation to app source. Expo's existing Babel dependencies are used.
for (const extension of ['.js', '.jsx']) {
  const originalLoader = require.extensions[extension] || require.extensions['.js'];
  require.extensions[extension] = (module, filename) => {
    if (!filename.startsWith(sourceRoot + path.sep) || filename.endsWith(path.join('theme', 'tokens.js'))) {
      return originalLoader(module, filename);
    }
    const result = babel.transformFileSync(filename, {
      babelrc: false,
      configFile: false,
      plugins: [
        rewriteImports,
        ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
        '@babel/plugin-transform-modules-commonjs',
      ],
    });
    module._compile(result.code, filename);
  };
}

const { AppText } = require('../src/frontend/components/ui/app-text.jsx');
const { Button } = require('../src/frontend/components/ui/button.jsx');
const { TextField } = require('../src/frontend/components/forms/text-field.jsx');
const { EmptyState } = require('../src/frontend/components/ui/empty-state.jsx');
const { ErrorState } = require('../src/frontend/components/ui/error-state.jsx');
const { LoadingState } = require('../src/frontend/components/ui/loading-state.jsx');
const { colors } = require('../src/frontend/theme/tokens.js');

const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
const noAction = () => {};

test('application source remains JavaScript/JSX with no TypeScript-only syntax', () => {
  const parser = require('@babel/parser');
  function check(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filename = path.join(dir, entry.name);
      if (entry.isDirectory()) check(filename);
      else {
        assert.ok(!/\.tsx?$/.test(filename), `Unexpected TypeScript source: ${filename}`);
        if (/\.jsx?$/.test(filename)) {
          parser.parse(fs.readFileSync(filename, 'utf8'), { sourceType: 'unambiguous', plugins: ['jsx'] });
        }
      }
    }
  }
  check(sourceRoot);
});

test('loading buttons announce busy/disabled and preserve their accessible name', () => {
  const html = render(Button, { label: 'Save note', loading: true, onPress: noAction });
  assert.match(html, /role="button"/);
  assert.match(html, /aria-label="Save note"/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /aria-busy="true"/);
});

test('disabled buttons announce disabled without reporting a pending operation', () => {
  const html = render(Button, { label: 'Save', disabled: true, onPress: noAction });
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /aria-busy="false"/);
});

test('text fields associate visible labels with inputs and announce validation errors', () => {
  const html = render(TextField, { label: 'Note title', nativeID: 'note-title', hint: 'A short title.', error: 'Enter a title.' });
  assert.match(html, /id="note-title-label"/);
  assert.match(html, /aria-labelledby="note-title-label"/);
  assert.match(html, /role="alert"/);
  assert.match(html, /Enter a title\./);
  assert.doesNotMatch(html, /A short title\./);
});

test('masked text fields render password inputs with autofill disabled by default', () => {
  const html = render(TextField, { label: 'Password', secureTextEntry: true });
  assert.match(html, /type="password"/);
  assert.match(html, /autoComplete="off"/i);
});

test('an explicit accessible label overrides the visible-label association', () => {
  const html = render(TextField, { label: 'Title', accessibilityLabel: 'Note title' });
  assert.match(html, /aria-label="Note title"/);
  assert.doesNotMatch(html, /aria-labelledby=/);
});

test('empty/error/loading states expose useful names and optional actions', () => {
  const empty = render(EmptyState, { title: 'No notes yet', action: { label: 'Create note', onPress: noAction } });
  assert.match(empty, /No notes yet/);
  assert.match(empty, /aria-label="Create note"/);
  const error = render(ErrorState, { description: 'Try again.', action: { label: 'Retry', onPress: noAction } });
  assert.match(error, /role="alert"/);
  assert.match(error, /aria-label="Retry"/);
  const loading = render(LoadingState, { label: 'Loading notes' });
  assert.match(loading, /aria-label="Loading notes"/);
  assert.match(loading, /aria-busy="true"/);
});

test('heading variants carry heading semantics', () => {
  assert.match(render(AppText, { variant: 'pageTitle', children: 'Notes' }), /role="heading"/);
  assert.doesNotMatch(render(AppText, { children: 'Body text' }), /role="heading"/);
});

function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

test('small text and button labels meet 4.5:1 contrast in both themes', () => {
  for (const mode of ['light', 'dark']) {
    const palette = colors[mode];
    const pairs = [
      [palette.text, palette.background],
      [palette.textSecondary, palette.surface],
      [palette.errorText, palette.surface],
      [palette.onPrimary, palette.primary],
      [palette.onPrimary, palette.errorText],
      [palette.primary, palette.surfaceSelected],
    ];
    for (const [foreground, background] of pairs) {
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      const ratio = (values[0] + 0.05) / (values[1] + 0.05);
      assert.ok(ratio >= 4.5, `${mode}: ${foreground} on ${background} has contrast ${ratio.toFixed(2)}:1`);
    }
  }
});

test('NativeWind compiles brand classes into the expected Android styles and dark-mode rules', async () => {
  const postcss = require('postcss');
  const tailwind = require('tailwindcss');
  const config = require('../tailwind.config');
  const tokens = require('../src/frontend/theme/tokens.js');
  const { cssToReactNativeRuntime } = require('react-native-css-interop/css-to-rn');
  const input = fs.readFileSync(path.join(sourceRoot, 'frontend/theme/global.css'), 'utf8');
  const result = await postcss([tailwind(config)]).process(input, { from: undefined });
  const { rules } = cssToReactNativeRuntime(result.css, { inlineRem: 14 });

  function findDeclaration(node, key) {
    if (!node || typeof node !== 'object') return undefined;
    if (Object.hasOwn(node, key)) return node[key];
    for (const value of Object.values(node)) {
      const found = findDeclaration(value, key);
      if (found !== undefined) return found;
    }
  }

  assert.equal(findDeclaration(rules['min-h-touch'], 'minHeight'), tokens.layout.minimumTouchTarget);
  assert.equal(findDeclaration(rules['p-screen'], 'padding'), tokens.layout.screenPadding);
  assert.equal(findDeclaration(rules['rounded-button'], 'borderRadius'), tokens.radius.button);
  assert.equal(findDeclaration(rules['text-page-title'], 'fontSize'), tokens.typography.pageTitle);
  assert.equal(config.theme.colors.primary, tokens.colors.light.primary);
  assert.equal(config.theme.colors.dark.background, tokens.colors.dark.background);
  assert.ok(JSON.stringify(rules['dark:bg-dark-background']).includes('prefers-color-scheme'));
  assert.equal(config.theme.colors.blue, undefined, 'Do not introduce a second/default brand palette');
});
