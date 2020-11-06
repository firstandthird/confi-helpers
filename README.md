<h1 align="center">Confi Helpers</h1>

<p align="center">
  <a href="https://github.com/firstandthird/eslint-config-firstandthird/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/confi-helpers/Test/main?label=Tests&style=for-the-badge" alt="Test Status"/>
  </a>
  <a href="https://github.com/firstandthird/eslint-config-firstandthird/actions">
    <img src="https://img.shields.io/github/workflow/status/firstandthird/confi-helpers/Lint/main?label=Lint&style=for-the-badge" alt="Lint Status"/>
  </a>
</p>

Confi Helpers is not designed to be used directly. It is used by [Confi](https://github.com/firstandthird/confi).

## Helpers:

### `exists(name)`

Checks if a var is set.

  - `name` - name of the variable to check.

Returns: _boolean_


### `getEnv(name, [fallback])`

Gets an environment variable.

  - `name` - the environment variable to grab.
  - `fallback` - a fallback value to use if the environment variable is not set.

Returns: _string_ - Value of environment variable or thrown error if `name` doesn't exist and no fallback provided.


### `getEnvInt(name, [fallback])`

Gets an environment variable.

  - `name` - the environment variable to grab.
  - `fallback` - a fallback value to use if the environment variable is not set.

Returns: _int_ - Value of environment variable, casted to an integer or thrown error if `name` doesn't exist and no fallback provided.

### `getEnvOrFilename(name)`

Reads a file or returns value of an environment variable.

  - `name` - Name of the environment variable.

Returns: _string_ - Contents of a file or value of the environment variable. If variable not found error will be thrown.


### `hasValue(value)`

Checks if a passed variable has a value and isn't null, undefined, or empty.

Note: Arrays and objects are not checked.

  - `value` - Passed variable to check.

Returns: _boolean_


### `readFile(name)`

Checks if a passed variable has a value and isn't null, undefined, or empty.

Note: Arrays and objects are not checked.

  - `name` - Filename

Returns: _string_ File contents.


### `truthy(value, [fallback])`

Checks if a value is truthy.

  - `value` - value to check.
  - `fallback` - defaults to `false`

Returns: _boolean_


### `truthyEnv(name, [fallback])`

Checks if an environment variable is truthy.

  - `value` - name of the environment variable.
  - `fallback` - defaults to `false`

Returns: _boolean_


### `ms(value)`

Converts a value to milliseconds. Uses the [ms](https://www.npmjs.com/package/ms) package.

  - `value` - value to convert.

Returns: _mixed_

---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First + Third](https://firstandthird.com) Project_
