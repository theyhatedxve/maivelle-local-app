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

test('setup preview validates required input, length and confirmation', () => {
  const { validateSetupPassword } = require('../src/frontend/features/auth/utils/preview-validation.js');
  assert.ok(validateSetupPassword('', ''));
  assert.ok(validateSetupPassword('short', 'short'));
  assert.ok(validateSetupPassword('longenough', 'different'));
  assert.equal(validateSetupPassword('longenough', 'longenough'), '');
});

test('generator honors length, selected classes and every enabled group', async () => {
  const { generatePassword, CHARACTER_GROUPS } = require('../src/frontend/features/password-generator/utils/generate-password.js');
  const bytes = async (count) => new Uint8Array(require('node:crypto').randomBytes(count));
  for (const length of [8, 20, 128]) {
    const result = await generatePassword({ length, options: { uppercase: true, lowercase: true, numbers: true, symbols: true } }, bytes);
    assert.equal(result.length, length);
    for (const group of Object.values(CHARACTER_GROUPS)) assert.ok([...result].some((character) => group.includes(character)));
  }
  const digits = await generatePassword({ length: 20, options: { numbers: true } }, bytes);
  assert.match(digits, /^\d{20}$/);
});

test('generator rejects biased byte range instead of reducing every byte modulo pool size', async () => {
  const { generatePassword } = require('../src/frontend/features/password-generator/utils/generate-password.js');
  const bytes = async () => {
    const buffer = new Uint8Array(256).fill(255);
    buffer.set([250, 251, 252, 253, 254, 255, 0, 1, 2, 3, 4, 5, 6, 7]);
    return buffer;
  };
  assert.equal(await generatePassword({ length: 8, options: { numbers: true } }, bytes), '01234567');
});

test('generator fails closed for invalid settings, bad entropy and stalled providers', async () => {
  const { generatePassword } = require('../src/frontend/features/password-generator/utils/generate-password.js');
  for (const length of [7, 129, 8.5, NaN]) await assert.rejects(generatePassword({ length, options: { numbers: true } }, async () => new Uint8Array(256)), /length/);
  await assert.rejects(generatePassword({ length: 8, options: {} }, async () => new Uint8Array(256)), /group/);
  await assert.rejects(generatePassword({ length: 8, options: { numbers: true } }), /unavailable/);
  await assert.rejects(generatePassword({ length: 8, options: { numbers: true } }, async () => { throw new Error('provider failed'); }), /provider failed/);
  await assert.rejects(generatePassword({ length: 8, options: { numbers: true } }, async () => new Uint8Array(1)), /invalid data/);
  await assert.rejects(generatePassword({ length: 8, options: { numbers: true } }, async () => new Uint8Array(256).fill(255)), /could not finish/);
  await assert.rejects(generatePassword({ length: 8, options: { numbers: true, uppercase: true } }, async () => new Uint8Array(256)), /could not finish/);
});

test('income formatting works when native Intl rejects BigInt and preserves every centavo', () => {
  const { formatIncome } = require('../src/frontend/features/finance/utils/income.js');
  const original = Intl.NumberFormat.prototype.formatToParts;
  try {
    Intl.NumberFormat.prototype.formatToParts = function (value) {
      if (typeof value === 'bigint') throw new TypeError('Cannot convert BigInt to number');
      assert.equal(typeof value, 'number');
      assert.ok(Number.isSafeInteger(value));
      return original.call(this, value);
    };
    for (const [minor, digits] of [[0, '000'], [1, '001'], [99, '099'], [100, '100'], [101, '101'],
      [10800000, '10800000'], [Number.MAX_SAFE_INTEGER, '9007199254740991']]) {
      assert.equal(formatIncome(minor).replace(/\D/g, ''), digits);
    }
  } finally {
    Intl.NumberFormat.prototype.formatToParts = original;
  }
});

test('income decimal input becomes exact centavos and rejects invalid amounts/dates', () => {
  const { parseIncomeAmount, formatIncome, validIncomeDate } = require('../src/frontend/features/finance/utils/income.js');
  assert.equal(parseIncomeAmount(' 12.3 '), 1230);
  assert.equal(parseIncomeAmount('0.10') + parseIncomeAmount('0.20'), 30);
  for (const value of ['', '-1', '1.234', '1e3', '1,200', 'abc', '90071992547410']) assert.equal(parseIncomeAmount(value), null);
  assert.equal(parseIncomeAmount('90071992547409.91'), Number.MAX_SAFE_INTEGER);
  assert.ok(formatIncome(Number.MAX_SAFE_INTEGER).endsWith('91'));
  assert.equal(validIncomeDate('2024-02-29'), true);
  assert.equal(validIncomeDate('2025-02-29'), false);
  assert.equal(validIncomeDate('2026-02-30'), false);
  assert.equal(validIncomeDate('2026-13-01'), false);
});

test('income totals respect month/year, category, transaction kind and currency', () => {
  const { selectIncome, totalIncome } = require('../src/frontend/features/finance/utils/income.js');
  const { createIncomePreview } = require('../src/frontend/features/finance/data/income-preview.js');
  const today = new Date(2026, 0, 18, 12);
  const records = createIncomePreview(today);
  const before = JSON.stringify(records);
  const mixed = [...records, { ...records[0], id: 'expense', kind: 'expense' }, { ...records[0], id: 'usd', currency: 'USD' }];
  assert.equal(totalIncome(selectIncome(mixed, { today })), 10800000);
  assert.equal(totalIncome(selectIncome(mixed, { today, allTime: true })), 27000000);
  assert.equal(totalIncome(selectIncome(mixed, { today, category: 'Consulting' })), 5720000);
  assert.equal(selectIncome(records, { today: new Date(2030, 0, 1) }).length, 0);
  assert.equal(JSON.stringify(records), before);
  assert.throws(() => totalIncome([{ amountMinor: Number.MAX_SAFE_INTEGER }, { amountMinor: 1 }]));
});

test('weekly and monthly income chart buckets reconcile with the displayed totals', () => {
  const { incomeBuckets, totalIncome } = require('../src/frontend/features/finance/utils/income.js');
  const { createIncomePreview } = require('../src/frontend/features/finance/data/income-preview.js');
  const today = new Date(2026, 0, 18, 12);
  const records = createIncomePreview(today);
  const weekly = incomeBuckets(records, today);
  assert.equal(weekly.length, 5);
  assert.equal(totalIncome(weekly), 10800000);
  assert.equal(weekly[0].amountMinor, 8600000);
  const monthly = incomeBuckets(records, today, true);
  assert.deepEqual(monthly.map((bucket) => bucket.key), ['2025-12', '2026-01']);
  assert.equal(totalIncome(monthly), 27000000);
  assert.equal(totalIncome(incomeBuckets([], today)), 0);
});

test('vault preview search combines metadata, tags and favorites without searching passwords', () => {
  const { filterCredentials } = require('../src/frontend/features/vault/utils/filter-credentials.js');
  const { VAULT_DEMO_RECORDS } = require('../src/frontend/features/vault/data/preview.js');
  const records = VAULT_DEMO_RECORDS.map((record, index) => ({ ...record, favorite: index === 0, password: 'excluded-secret-value' }));
  const original = JSON.stringify(records);
  assert.equal(filterCredentials(records, '  ORBIT  ')[0].id, 'demo-orbit');
  assert.equal(filterCredentials(records, 'maivelle.example').length, 4);
  assert.equal(filterCredentials(records, '', 'cloud').length, 2);
  assert.equal(filterCredentials(records, '', 'all', true).length, 1);
  assert.equal(filterCredentials(records, '', 'cloud', true).length, 0);
  assert.equal(filterCredentials(records, 'excluded-secret-value').length, 0);
  assert.equal(filterCredentials(records, 'missing-result').length, 0);
  assert.equal(JSON.stringify(records), original);
});

test('note search includes body, tags and checklist text without mutating source order', () => {
  const { findNotes } = require('../src/frontend/features/notes/utils/notes.js');
  const { createNotesPreview } = require('../src/frontend/features/notes/data/preview.js');
  const notes = createNotesPreview(new Date('2026-10-18T12:00:00Z'));
  const before = JSON.stringify(notes);
  assert.equal(findNotes(notes, '  TRAVEL  ')[0].id, 'sample-note-2');
  assert.equal(findNotes(notes, 'three priorities')[0].id, 'sample-note-1');
  assert.equal(findNotes(notes, 'a little inspiration')[0].id, 'sample-note-5');
  assert.equal(findNotes(notes, '', 'favorites').length, 2);
  assert.equal(findNotes(notes, '', 'checklists').length, 2);
  assert.equal(findNotes(notes, 'no-matching-note').length, 0);
  const reordered = findNotes([{ ...notes[0], updatedAt: '2020-01-01' }, notes[1]]);
  assert.equal(reordered[0].id, notes[0].id, 'Pinned notes stay above newer unpinned notes');
  assert.equal(JSON.stringify(notes), before);
});

test('Markdown tools preserve surrounding text and clamp stale selections', () => {
  const { formatNoteText } = require('../src/frontend/features/notes/utils/notes.js');
  const bold = formatNoteText('hello world', { start: 6, end: 11 }, 'bold');
  assert.equal(bold.text, 'hello **world**');
  assert.deepEqual(bold.selection, { start: 15, end: 15 });
  assert.equal(formatNoteText('word', { start: 0, end: 4 }, 'italic').text, '*word*');
  assert.equal(formatNoteText('hello', { start: 500, end: 600 }, 'bullet').text, 'hello\n- List item');
  assert.equal(formatNoteText('link', { start: -1, end: 4 }, 'link').text, '[link](https://)');
  assert.equal(formatNoteText('text', null, 'numbered').text, 'text\n1. List item');
});

test('calendar month navigation clamps end-of-month dates and crosses years', () => {
  const { moveMonth, dateKey } = require('../src/frontend/features/calendar/utils/calendar.js');
  assert.equal(dateKey(moveMonth(new Date(2024, 0, 31, 12), 1)), '2024-02-29');
  assert.equal(dateKey(moveMonth(new Date(2025, 0, 31, 12), 1)), '2025-02-28');
  assert.equal(dateKey(moveMonth(new Date(2025, 11, 15, 12), 1)), '2026-01-15');
  assert.equal(dateKey(moveMonth(new Date(2025, 0, 15, 12), -1)), '2024-12-15');
});

test('calendar grids contain complete Sunday-first weeks with unique local dates', () => {
  const { monthDays } = require('../src/frontend/features/calendar/utils/calendar.js');
  for (const [year, month, expectedDays] of [[2024, 1, 29], [2025, 1, 28], [2026, 7, 31]]) {
    const days = monthDays(new Date(year, month, 1, 12));
    assert.equal(days.length % 7, 0);
    assert.equal(days[0].date.getDay(), 0);
    assert.equal(days.at(-1).date.getDay(), 6);
    assert.equal(days.filter(day => day.inMonth).length, expectedDays);
    assert.equal(new Set(days.map(day => day.key)).size, days.length);
  }
});

test('segmented controls announce their group, choices, and selected state', () => {
  const { SegmentedControl } = require('../src/frontend/components/ui/segmented-control.jsx');
  const html = render(SegmentedControl, { label: 'Plan view', value: 'calendar', onChange: noAction,
    options: [{ value: 'calendar', label: 'Calendar' }, { value: 'tasks', label: 'Tasks' }] });
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-label="Plan view"/);
  assert.equal((html.match(/role="tab"/g) || []).length, 2);
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
});

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
      [palette.textSecondary, palette.surfaceMuted],
      [palette.successText, palette.surface],
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
