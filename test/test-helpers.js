'use strict';
const t = require('tap');
const path = require('path');
const helpers = require('../index');
const varson = require('varson');
//t.runOnly = true;
t.test('envExists helper', async (assert) => {
  process.env.TEST_VARIABLE = 'a test variable';
  process.env.TEST_VARIABLE2 = 1;
  process.env.TEST_VAR3 = '';
  const config = await varson({
    string: '{{envExists("TEST_VARIABLE")}}',
    num: '{{envExists("TEST_VARIABLE2")}}',
    no: '{{envExists("DOES_NOT_EXIST")}}',
    var3: '{{envExists("TEST_VAR3")}}'
  }, helpers);
  assert.match(config, {
    string: true,
    num: true,
    no: false,
    var3: true //should this be false?
  });
  assert.end();
});

t.test('ms helper', async (assert) => {
  const config = await varson({
    oneDay: '{{ms("1d")}}'
  }, helpers);
  assert.deepEqual(config, {
    oneDay: 1000 * 60 * 60 * 24
  });
  assert.end();
});

t.test('getEnv helper', async (assert) => {
  process.env.CONFI_TEST = 'yep';
  const config = await varson({
    test: '{{getEnv("CONFI_TEST")}}'
  }, helpers);
  assert.deepEqual(config, {
    test: 'yep',
  });
  assert.end();
});

t.test('getEnv helper with default', async (assert) => {
  const config = await varson({
    test: '{{getEnv("CONFI_TEST2", "nope")}}'
  }, helpers);
  assert.deepEqual(config, {
    test: 'nope',
  });
  assert.end();
});

t.test('getEnv helper with a false default', async (assert) => {
  process.env.DEBUG = 'false';
  const config = await varson({
    envs: {
      debug: '{{getEnv("DEBUG", false)}}',
    },
    enableDebug: '{{truthy(envs.debug)}}'
  }, helpers);
  assert.deepEqual(config, {
    envs: {
      debug: 'false'
    },
    enableDebug: false,
  });
  assert.end();
});

t.test('getEnv helper throws error if not defined and no fallback provided', async (assert) => {
  try {
    await varson({
      test: '{{getEnv("TheArctic")}}'
    }, helpers);
  } catch (e) {
    assert.equal(e.toString(), 'Error: Environment variable TheArctic was not found and no fallback was specified');
    assert.end();
  }
});

t.test('includes truthy helper', async (assert) => {
  process.env.TRUTHY_VAR = '1';
  const config = await varson({
    ENV: process.env,
    anotherVar: 'true',
    envVar: '{{getEnv("TRUTHY_VAR")}}',
    varExists: '{{truthy(anotherVar)}}',
    envVarExists: '{{truthy(ENV.TRUTHY_VAR)}}',
    envVarExists2: '{{truthy(getEnv("TRUTHY_VAR"))}}',
    envVarExists3: '{{truthy(envVar)}}',
    envVarNoExists: '{{truthy(ENV.TRUTHY_VAR2)}}',
    defaultNullVal: '{{truthy(null, true)}}',
    defaultUndefinedVal: '{{truthy(undefined, true)}}',
    stringAmbiguous: '{{truthy("ambiguous")}}',
    stringTrue: '{{truthy("true")}}',
    booleanTrue: '{{truthy(true)}}',
    stringNumTrue: '{{truthy("1")}}',
    stringNum2True: '{{truthy("10")}}',
    numTrue: '{{truthy(1)}}',
    stringFalse: '{{truthy("false")}}',
    booleanFalse: '{{truthy(false)}}',
    stringNumFalse: '{{truthy("-1")}}',
    numFalse: '{{truthy(-1)}}',
    stringNum2False: '{{truthy("-10")}}',
    undef: '{{truthy(undefined)}}',
    blank: '{{truthy("")}}',
    zero: '{{truthy(0)}}',
    zeroString: '{{truthy("0")}}',
    one: '{{truthy(1)}}',
    oneString: '{{truthy("1")}}',
    nullVal: '{{truthy(null)}}',
  }, helpers);
  assert.equal(config.envVar, '1');
  assert.equal(config.varExists, true);
  assert.equal(config.envVarExists, true);
  assert.equal(config.envVarExists2, true);
  assert.equal(config.envVarExists3, true);
  assert.equal(config.envVarNoExists, false);
  assert.equal(config.stringTrue, true);
  assert.equal(config.booleanTrue, true);
  assert.equal(config.stringNumTrue, true);
  assert.equal(config.stringNum2True, true);
  assert.equal(config.numTrue, true);
  assert.equal(config.stringFalse, false);
  assert.equal(config.booleanFalse, false);
  assert.equal(config.stringNumFalse, false);
  assert.equal(config.stringNum2False, false);
  assert.equal(config.numFalse, false);
  assert.equal(config.stringAmbiguous, false);
  assert.equal(config.undef, false);
  assert.equal(config.blank, false);
  assert.equal(config.zero, false);
  assert.equal(config.zeroString, false);
  assert.equal(config.one, true);
  assert.equal(config.oneString, true);
  assert.equal(config.nullVal, false);
  assert.equal(config.defaultNullVal, true);
  assert.equal(config.defaultUndefinedVal, true);
  assert.end();
});

t.test('readFile helper', async (assert) => {
  const config = await varson({
    file: `{{readFile("${path.join(__dirname, 'conf2', 'default.yaml')}")}}`
  }, helpers);
  assert.equal(config.file.startsWith('multiple: true'), true);
  assert.end();
});

t.test('getFileOrEnv helper', async (assert) => {
  process.env.HONGO_URL = 'hongodb://blah.db.com:1331';
  let config = await varson({
    val1: '{{getEnvOrFile("HONGO_URL")}}',
  }, helpers);
  assert.equal(config.val1, process.env.HONGO_URL);
  process.env.HONGO_URL_FILE = `${path.join(__dirname, 'conf2', 'default.yaml')}`;
  config = await varson({
    val1: '{{getEnvOrFile("HONGO_URL")}}',
  }, helpers);
  delete process.env.HONGO_URL_FILE;
  assert.equal(config.val1.startsWith('multiple: true'), true);
  try {
    await varson({
      test: '{{getEnvOrFile("TheArctic")}}'
    }, helpers);
  } catch (e) {
    assert.equal(e.toString(), 'Error: Environment variable TheArctic was not found and no fallback was specified');
    return assert.end();
  }
  assert.fail();
});

t.test('hasValue helper', async (assert) => {
  const config = await varson({
    a: '123',
    ahasValue: '{{hasValue(a)}}', //should be true
    b: '',
    bhasValue: '{{hasValue(b)}}', //false
    c: '{{getEnv("BLAH", "")}}',
    chasValue: '{{hasValue(c)}}'
  }, helpers);
  assert.match(config, {
    a: '123',
    ahasValue: true,
    bhasValue: false,
    c: '',
    chasValue: false
  });
  assert.end();
});

t.test('includes truthyEnv helper', async (assert) => {
  process.env.VAR1 = '1';
  process.env.VAR2 = 'true';
  process.env.VAR3 = true;
  process.env.VAR4 = 'false';
  process.env.VAR5 = '';
  const config = await varson({
    var1: '{{truthyEnv("VAR1", false)}}',
    var2: '{{truthyEnv("VAR2", false)}}',
    var3: '{{truthyEnv("VAR3", false)}}',
    var4: '{{truthyEnv("VAR4", false)}}',
    var5: '{{truthyEnv("VAR5", false)}}',
    undef: '{{truthyEnv("UNDEF", "not defined")}}',
  }, helpers);
  assert.equal(config.var1, true);
  assert.equal(config.var2, true);
  assert.equal(config.var3, true);
  assert.equal(config.var4, false);
  assert.equal(config.var5, false);
  assert.equal(config.undef, 'not defined');
  assert.end();
});

t.test('getEnvInt helper', async (assert) => {
  process.env.CONFI_TEST = '123';
  const config = await varson({
    test: '{{getEnvInt("CONFI_TEST")}}',
    test2: '{{getEnv("CONFI_TEST")}}'
  }, helpers);
  assert.isA(config.test, 'number');
  assert.equal(config.test, 123);
  assert.isA(config.test2, 'string');
  assert.equal(config.test2, '123');
  assert.end();
});
