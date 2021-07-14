(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.ML_MATRIX = {}));
}(this, function (exports) { 'use strict';

  const toString = Object.prototype.toString; // function isAnyArray(object) {
  //   return toString.call(object).endsWith('Array]');
  // }
  // module.exports = isAnyArray;

  function isAnyArray(object) {
    return toString.call(object).endsWith('Array]');
  }

  /**
   * Computes the maximum of the given values
   * @param {Array<number>} input
   * @return {number}
   */

  function max(input) {
    if (!isAnyArray(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var max = input[0];

    for (var i = 1; i < input.length; i++) {
      if (input[i] > max) max = input[i];
    }

    return max;
  }

  /**
   * Computes the minimum of the given values
   * @param {Array<number>} input
   * @return {number}
   */

  function min(input) {
    if (!isAnyArray(input)) {
      throw new TypeError('input must be an array');
    }

    if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var min = input[0];

    for (var i = 1; i < input.length; i++) {
      if (input[i] < min) min = input[i];
    }

    return min;
  }

  function rescale(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!isAnyArray(input)) {
      throw new TypeError('input must be an array');
    } else if (input.length === 0) {
      throw new TypeError('input must not be empty');
    }

    var output;

    if (options.output !== undefined) {
      if (!isAnyArray(options.output)) {
        throw new TypeError('output option must be an array if specified');
      }

      output = options.output;
    } else {
      output = new Array(input.length);
    }

    var currentMin = min(input);
    var currentMax = max(input);

    if (currentMin === currentMax) {
      throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
    }

    var _options$min = options.min,
        minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
        _options$max = options.max,
        maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;

    if (minValue >= maxValue) {
      throw new RangeError('min option must be smaller than max option');
    }

    var factor = (maxValue - minValue) / (currentMax - currentMin);

    for (var i = 0; i < input.length; i++) {
      output[i] = (input[i] - currentMin) * factor + minValue;
    }

    return output;
  }

  /**
   * @private
   * Check that a row index is not out of bounds
   * @param {Matrix} matrix
   * @param {number} index
   * @param {boolean} [outer]
   */
  function checkRowIndex(matrix, index, outer) {
    var max = outer ? matrix.rows : matrix.rows - 1;

    if (index < 0 || index > max) {
      throw new RangeError('Row index out of range');
    }
  }
  /**
   * @private
   * Check that a column index is not out of bounds
   * @param {Matrix} matrix
   * @param {number} index
   * @param {boolean} [outer]
   */

  function checkColumnIndex(matrix, index, outer) {
    var max = outer ? matrix.columns : matrix.columns - 1;

    if (index < 0 || index > max) {
      throw new RangeError('Column index out of range');
    }
  }
  /**
   * @private
   * Check that the provided vector is an array with the right length
   * @param {Matrix} matrix
   * @param {Array|Matrix} vector
   * @return {Array}
   * @throws {RangeError}
   */

  function checkRowVector(matrix, vector) {
    if (vector.to1DArray) {
      vector = vector.to1DArray();
    }

    if (vector.length !== matrix.columns) {
      throw new RangeError('vector size must be the same as the number of columns');
    }

    return vector;
  }
  /**
   * @private
   * Check that the provided vector is an array with the right length
   * @param {Matrix} matrix
   * @param {Array|Matrix} vector
   * @return {Array}
   * @throws {RangeError}
   */

  function checkColumnVector(matrix, vector) {
    if (vector.to1DArray) {
      vector = vector.to1DArray();
    }

    if (vector.length !== matrix.rows) {
      throw new RangeError('vector size must be the same as the number of rows');
    }

    return vector;
  }
  function checkIndices(matrix, rowIndices, columnIndices) {
    return {
      row: checkRowIndices(matrix, rowIndices),
      column: checkColumnIndices(matrix, columnIndices)
    };
  }
  function checkRowIndices(matrix, rowIndices) {
    if (typeof rowIndices !== 'object') {
      throw new TypeError('unexpected type for row indices');
    }

    var rowOut = rowIndices.some(r => {
      return r < 0 || r >= matrix.rows;
    });

    if (rowOut) {
      throw new RangeError('row indices are out of range');
    }

    if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);
    return rowIndices;
  }
  function checkColumnIndices(matrix, columnIndices) {
    if (typeof columnIndices !== 'object') {
      throw new TypeError('unexpected type for column indices');
    }

    var columnOut = columnIndices.some(c => {
      return c < 0 || c >= matrix.columns;
    });

    if (columnOut) {
      throw new RangeError('column indices are out of range');
    }

    if (!Array.isArray(columnIndices)) columnIndices = Array.from(columnIndices);
    return columnIndices;
  }
  function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
    if (arguments.length !== 5) {
      throw new RangeError('expected 4 arguments');
    }

    checkNumber('startRow', startRow);
    checkNumber('endRow', endRow);
    checkNumber('startColumn', startColumn);
    checkNumber('endColumn', endColumn);

    if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
      throw new RangeError('Submatrix indices are out of range');
    }
  }
  function newArray(length, value = 0) {
    var array = [];

    for (var i = 0; i < length; i++) {
      array.push(value);
    }

    return array;
  }

  function checkNumber(name, value) {
    if (typeof value !== 'number') {
      throw new TypeError(`${name} must be a number`);
    }
  }

  function sumByRow(matrix) {
    var sum = newArray(matrix.rows);

    for (var i = 0; i < matrix.rows; ++i) {
      for (var j = 0; j < matrix.columns; ++j) {
        sum[i] += matrix.get(i, j);
      }
    }

    return sum;
  }
  function sumByColumn(matrix) {
    var sum = newArray(matrix.columns);

    for (var i = 0; i < matrix.rows; ++i) {
      for (var j = 0; j < matrix.columns; ++j) {
        sum[j] += matrix.get(i, j);
      }
    }

    return sum;
  }
  function sumAll(matrix) {
    var v = 0;

    for (var i = 0; i < matrix.rows; i++) {
      for (var j = 0; j < matrix.columns; j++) {
        v += matrix.get(i, j);
      }
    }

    return v;
  }
  function productByRow(matrix) {
    var sum = newArray(matrix.rows, 1);

    for (var i = 0; i < matrix.rows; ++i) {
      for (var j = 0; j < matrix.columns; ++j) {
        sum[i] *= matrix.get(i, j);
      }
    }

    return sum;
  }
  function productByColumn(matrix) {
    var sum = newArray(matrix.columns, 1);

    for (var i = 0; i < matrix.rows; ++i) {
      for (var j = 0; j < matrix.columns; ++j) {
        sum[j] *= matrix.get(i, j);
      }
    }

    return sum;
  }
  function productAll(matrix) {
    var v = 1;

    for (var i = 0; i < matrix.rows; i++) {
      for (var j = 0; j < matrix.columns; j++) {
        v *= matrix.get(i, j);
      }
    }

    return v;
  }
  function varianceByRow(matrix, unbiased, mean) {
    const rows = matrix.rows;
    const cols = matrix.columns;
    const variance = [];

    for (var i = 0; i < rows; i++) {
      var sum1 = 0;
      var sum2 = 0;
      var x = 0;

      for (var j = 0; j < cols; j++) {
        x = matrix.get(j, i) - mean[i];
        sum1 += x;
        sum2 += x * x;
      }

      if (unbiased) {
        variance.push((sum2 - sum1 * sum1 / cols) / (cols - 1));
      } else {
        variance.push((sum2 - sum1 * sum1 / cols) / cols);
      }
    }

    return variance;
  }
  function varianceByColumn(matrix, unbiased, mean) {
    const rows = matrix.rows;
    const cols = matrix.columns;
    const variance = [];

    for (var j = 0; j < cols; j++) {
      var sum1 = 0;
      var sum2 = 0;
      var x = 0;

      for (var i = 0; i < rows; i++) {
        x = matrix.get(i, j) - mean[j];
        sum1 += x;
        sum2 += x * x;
      }

      if (unbiased) {
        variance.push((sum2 - sum1 * sum1 / rows) / (rows - 1));
      } else {
        variance.push((sum2 - sum1 * sum1 / rows) / rows);
      }
    }

    return variance;
  }
  function varianceAll(matrix, unbiased, mean) {
    const rows = matrix.rows;
    const cols = matrix.columns;
    const size = rows * cols;
    var sum1 = 0;
    var sum2 = 0;
    var x = 0;

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        x = matrix.get(i, j) - mean;
        sum1 += x;
        sum2 += x * x;
      }
    }

    if (unbiased) {
      return (sum2 - sum1 * sum1 / size) / (size - 1);
    } else {
      return (sum2 - sum1 * sum1 / size) / size;
    }
  }

  function inspectMatrix() {
    const indent = ' '.repeat(2);
    const indentData = ' '.repeat(4);
    return `${this.constructor.name} {
${indent}[
${indentData}${inspectData(this, indentData)}
${indent}]
${indent}rows: ${this.rows}
${indent}columns: ${this.columns}
}`;
  }
  const maxRows = 15;
  const maxColumns = 10;
  const maxNumSize = 8;

  function inspectData(matrix, indent) {
    const {
      rows,
      columns
    } = matrix;
    const maxI = Math.min(rows, maxRows);
    const maxJ = Math.min(columns, maxColumns);
    const result = [];

    for (var i = 0; i < maxI; i++) {
      let line = [];

      for (var j = 0; j < maxJ; j++) {
        line.push(formatNumber(matrix.get(i, j)));
      }

      result.push(`${line.join(' ')}`);
    }

    if (maxJ !== columns) {
      result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
    }

    if (maxI !== rows) {
      result.push(`... ${rows - maxRows} more rows`);
    }

    return result.join(`\n${indent}`);
  }

  function formatNumber(num) {
    const numStr = String(num);

    if (numStr.length <= maxNumSize) {
      return numStr.padEnd(maxNumSize, ' ');
    }

    const precise = num.toPrecision(maxNumSize - 2);

    if (precise.length <= maxNumSize) {
      return precise;
    }

    const exponential = num.toExponential(maxNumSize - 2);
    const eIndex = exponential.indexOf('e');
    const e = exponential.substring(eIndex);
    return exponential.substring(0, maxNumSize - e.length) + e;
  }

  function installMathOperations(AbstractMatrix, Matrix) {
    AbstractMatrix.prototype.add = function add(value) {
      if (typeof value === 'number') return this.addS(value);
      return this.addM(value);
    };

    AbstractMatrix.prototype.addS = function addS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.addM = function addM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.add = function add(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.add(value);
    };

    AbstractMatrix.prototype.sub = function sub(value) {
      if (typeof value === 'number') return this.subS(value);
      return this.subM(value);
    };

    AbstractMatrix.prototype.subS = function subS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.subM = function subM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.sub = function sub(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.sub(value);
    };

    AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
    AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
    AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
    AbstractMatrix.subtract = AbstractMatrix.sub;

    AbstractMatrix.prototype.mul = function mul(value) {
      if (typeof value === 'number') return this.mulS(value);
      return this.mulM(value);
    };

    AbstractMatrix.prototype.mulS = function mulS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.mulM = function mulM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.mul = function mul(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.mul(value);
    };

    AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
    AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
    AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
    AbstractMatrix.multiply = AbstractMatrix.mul;

    AbstractMatrix.prototype.div = function div(value) {
      if (typeof value === 'number') return this.divS(value);
      return this.divM(value);
    };

    AbstractMatrix.prototype.divS = function divS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.divM = function divM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.div = function div(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.div(value);
    };

    AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
    AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
    AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
    AbstractMatrix.divide = AbstractMatrix.div;

    AbstractMatrix.prototype.mod = function mod(value) {
      if (typeof value === 'number') return this.modS(value);
      return this.modM(value);
    };

    AbstractMatrix.prototype.modS = function modS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) % value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.modM = function modM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) % matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.mod = function mod(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.mod(value);
    };

    AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
    AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
    AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
    AbstractMatrix.modulus = AbstractMatrix.mod;

    AbstractMatrix.prototype.and = function and(value) {
      if (typeof value === 'number') return this.andS(value);
      return this.andM(value);
    };

    AbstractMatrix.prototype.andS = function andS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) & value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.andM = function andM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) & matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.and = function and(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.and(value);
    };

    AbstractMatrix.prototype.or = function or(value) {
      if (typeof value === 'number') return this.orS(value);
      return this.orM(value);
    };

    AbstractMatrix.prototype.orS = function orS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) | value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.orM = function orM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) | matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.or = function or(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.or(value);
    };

    AbstractMatrix.prototype.xor = function xor(value) {
      if (typeof value === 'number') return this.xorS(value);
      return this.xorM(value);
    };

    AbstractMatrix.prototype.xorS = function xorS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) ^ value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.xorM = function xorM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.xor = function xor(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.xor(value);
    };

    AbstractMatrix.prototype.leftShift = function leftShift(value) {
      if (typeof value === 'number') return this.leftShiftS(value);
      return this.leftShiftM(value);
    };

    AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) << value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) << matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.leftShift = function leftShift(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.leftShift(value);
    };

    AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
      if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
      return this.signPropagatingRightShiftM(value);
    };

    AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >> value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >> matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.signPropagatingRightShift(value);
    };

    AbstractMatrix.prototype.rightShift = function rightShift(value) {
      if (typeof value === 'number') return this.rightShiftS(value);
      return this.rightShiftM(value);
    };

    AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >>> value);
        }
      }

      return this;
    };

    AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.rightShift = function rightShift(matrix, value) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.rightShift(value);
    };

    AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
    AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
    AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
    AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;

    AbstractMatrix.prototype.not = function not() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, ~this.get(i, j));
        }
      }

      return this;
    };

    AbstractMatrix.not = function not(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.not();
    };

    AbstractMatrix.prototype.abs = function abs() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.abs(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.abs = function abs(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.abs();
    };

    AbstractMatrix.prototype.acos = function acos() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.acos(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.acos = function acos(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.acos();
    };

    AbstractMatrix.prototype.acosh = function acosh() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.acosh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.acosh = function acosh(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.acosh();
    };

    AbstractMatrix.prototype.asin = function asin() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.asin(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.asin = function asin(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.asin();
    };

    AbstractMatrix.prototype.asinh = function asinh() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.asinh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.asinh = function asinh(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.asinh();
    };

    AbstractMatrix.prototype.atan = function atan() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.atan(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.atan = function atan(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.atan();
    };

    AbstractMatrix.prototype.atanh = function atanh() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.atanh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.atanh = function atanh(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.atanh();
    };

    AbstractMatrix.prototype.cbrt = function cbrt() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.cbrt(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.cbrt = function cbrt(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.cbrt();
    };

    AbstractMatrix.prototype.ceil = function ceil() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.ceil(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.ceil = function ceil(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.ceil();
    };

    AbstractMatrix.prototype.clz32 = function clz32() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.clz32(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.clz32 = function clz32(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.clz32();
    };

    AbstractMatrix.prototype.cos = function cos() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.cos(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.cos = function cos(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.cos();
    };

    AbstractMatrix.prototype.cosh = function cosh() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.cosh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.cosh = function cosh(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.cosh();
    };

    AbstractMatrix.prototype.exp = function exp() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.exp(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.exp = function exp(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.exp();
    };

    AbstractMatrix.prototype.expm1 = function expm1() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.expm1(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.expm1 = function expm1(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.expm1();
    };

    AbstractMatrix.prototype.floor = function floor() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.floor(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.floor = function floor(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.floor();
    };

    AbstractMatrix.prototype.fround = function fround() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.fround(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.fround = function fround(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.fround();
    };

    AbstractMatrix.prototype.log = function log() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log = function log(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.log();
    };

    AbstractMatrix.prototype.log1p = function log1p() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log1p(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log1p = function log1p(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.log1p();
    };

    AbstractMatrix.prototype.log10 = function log10() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log10(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log10 = function log10(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.log10();
    };

    AbstractMatrix.prototype.log2 = function log2() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.log2(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.log2 = function log2(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.log2();
    };

    AbstractMatrix.prototype.round = function round() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.round(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.round = function round(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.round();
    };

    AbstractMatrix.prototype.sign = function sign() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sign(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sign = function sign(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.sign();
    };

    AbstractMatrix.prototype.sin = function sin() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sin(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sin = function sin(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.sin();
    };

    AbstractMatrix.prototype.sinh = function sinh() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sinh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sinh = function sinh(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.sinh();
    };

    AbstractMatrix.prototype.sqrt = function sqrt() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.sqrt(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.sqrt = function sqrt(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.sqrt();
    };

    AbstractMatrix.prototype.tan = function tan() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.tan(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.tan = function tan(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.tan();
    };

    AbstractMatrix.prototype.tanh = function tanh() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.tanh(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.tanh = function tanh(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.tanh();
    };

    AbstractMatrix.prototype.trunc = function trunc() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.trunc(this.get(i, j)));
        }
      }

      return this;
    };

    AbstractMatrix.trunc = function trunc(matrix) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.trunc();
    };

    AbstractMatrix.pow = function pow(matrix, arg0) {
      var newMatrix = new Matrix(matrix);
      return newMatrix.pow(arg0);
    };

    AbstractMatrix.prototype.pow = function pow(value) {
      if (typeof value === 'number') return this.powS(value);
      return this.powM(value);
    };

    AbstractMatrix.prototype.powS = function powS(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.pow(this.get(i, j), value));
        }
      }

      return this;
    };

    AbstractMatrix.prototype.powM = function powM(matrix) {
      matrix = Matrix.checkMatrix(matrix);

      if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
        throw new RangeError('Matrices dimensions must be equal');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, Math.pow(this.get(i, j), matrix.get(i, j)));
        }
      }

      return this;
    };
  }

  class AbstractMatrix {
    /**
     * Constructs a Matrix with the chosen dimensions from a 1D array
     * @param {number} newRows - Number of rows
     * @param {number} newColumns - Number of columns
     * @param {Array} newData - A 1D array containing data for the matrix
     * @return {Matrix} - The new matrix
     */
    static from1DArray(newRows, newColumns, newData) {
      var length = newRows * newColumns;

      if (length !== newData.length) {
        throw new RangeError('data length does not match given dimensions');
      }

      var newMatrix = new Matrix(newRows, newColumns);

      for (var row = 0; row < newRows; row++) {
        for (var column = 0; column < newColumns; column++) {
          newMatrix.set(row, column, newData[row * newColumns + column]);
        }
      }

      return newMatrix;
    }
    /**
     * Creates a row vector, a matrix with only one row.
     * @param {Array} newData - A 1D array containing data for the vector
     * @return {Matrix} - The new matrix
     */


    static rowVector(newData) {
      var vector = new Matrix(1, newData.length);

      for (var i = 0; i < newData.length; i++) {
        vector.set(0, i, newData[i]);
      }

      return vector;
    }
    /**
     * Creates a column vector, a matrix with only one column.
     * @param {Array} newData - A 1D array containing data for the vector
     * @return {Matrix} - The new matrix
     */


    static columnVector(newData) {
      var vector = new Matrix(newData.length, 1);

      for (var i = 0; i < newData.length; i++) {
        vector.set(i, 0, newData[i]);
      }

      return vector;
    }
    /**
     * Creates a matrix with the given dimensions. Values will be set to zero.
     * @param {number} rows - Number of rows
     * @param {number} columns - Number of columns
     * @return {Matrix} - The new matrix
     */


    static zeros(rows, columns) {
      return new Matrix(rows, columns);
    }
    /**
     * Creates a matrix with the given dimensions. Values will be set to one.
     * @param {number} rows - Number of rows
     * @param {number} columns - Number of columns
     * @return {Matrix} - The new matrix
     */


    static ones(rows, columns) {
      return new Matrix(rows, columns).fill(1);
    }
    /**
     * Creates a matrix with the given dimensions. Values will be randomly set.
     * @param {number} rows - Number of rows
     * @param {number} columns - Number of columns
     * @param {object} [options]
     * @param {function} [options.random=Math.random] - Random number generator
     * @return {Matrix} The new matrix
     */


    static rand(rows, columns, options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        random = Math.random
      } = options;
      var matrix = new Matrix(rows, columns);

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          matrix.set(i, j, random());
        }
      }

      return matrix;
    }
    /**
     * Creates a matrix with the given dimensions. Values will be random integers.
     * @param {number} rows - Number of rows
     * @param {number} columns - Number of columns
     * @param {object} [options]
     * @param {number} [options.min=0] - Minimum value
     * @param {number} [options.max=1000] - Maximum value
     * @param {function} [options.random=Math.random] - Random number generator
     * @return {Matrix} The new matrix
     */


    static randInt(rows, columns, options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        min = 0,
        max = 1000,
        random = Math.random
      } = options;
      if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
      if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
      if (min >= max) throw new RangeError('min must be smaller than max');
      var interval = max - min;
      var matrix = new Matrix(rows, columns);

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          var value = min + Math.round(random() * interval);
          matrix.set(i, j, value);
        }
      }

      return matrix;
    }
    /**
     * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and others will be 0.
     * @param {number} rows - Number of rows
     * @param {number} [columns=rows] - Number of columns
     * @param {number} [value=1] - Value to fill the diagonal with
     * @return {Matrix} - The new identity matrix
     */


    static eye(rows, columns, value) {
      if (columns === undefined) columns = rows;
      if (value === undefined) value = 1;
      var min = Math.min(rows, columns);
      var matrix = this.zeros(rows, columns);

      for (var i = 0; i < min; i++) {
        matrix.set(i, i, value);
      }

      return matrix;
    }
    /**
     * Creates a diagonal matrix based on the given array.
     * @param {Array} data - Array containing the data for the diagonal
     * @param {number} [rows] - Number of rows (Default: data.length)
     * @param {number} [columns] - Number of columns (Default: rows)
     * @return {Matrix} - The new diagonal matrix
     */


    static diag(data, rows, columns) {
      var l = data.length;
      if (rows === undefined) rows = l;
      if (columns === undefined) columns = rows;
      var min = Math.min(l, rows, columns);
      var matrix = this.zeros(rows, columns);

      for (var i = 0; i < min; i++) {
        matrix.set(i, i, data[i]);
      }

      return matrix;
    }
    /**
     * Returns a matrix whose elements are the minimum between matrix1 and matrix2
     * @param {Matrix} matrix1
     * @param {Matrix} matrix2
     * @return {Matrix}
     */


    static min(matrix1, matrix2) {
      matrix1 = this.checkMatrix(matrix1);
      matrix2 = this.checkMatrix(matrix2);
      var rows = matrix1.rows;
      var columns = matrix1.columns;
      var result = new Matrix(rows, columns);

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
        }
      }

      return result;
    }
    /**
     * Returns a matrix whose elements are the maximum between matrix1 and matrix2
     * @param {Matrix} matrix1
     * @param {Matrix} matrix2
     * @return {Matrix}
     */


    static max(matrix1, matrix2) {
      matrix1 = this.checkMatrix(matrix1);
      matrix2 = this.checkMatrix(matrix2);
      var rows = matrix1.rows;
      var columns = matrix1.columns;
      var result = new this(rows, columns);

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
        }
      }

      return result;
    }
    /**
     * Check that the provided value is a Matrix and tries to instantiate one if not
     * @param {*} value - The value to check
     * @return {Matrix}
     */


    static checkMatrix(value) {
      return AbstractMatrix.isMatrix(value) ? value : new Matrix(value);
    }
    /**
     * Returns true if the argument is a Matrix, false otherwise
     * @param {*} value - The value to check
     * @return {boolean}
     */


    static isMatrix(value) {
      return value != null && value.klass === 'Matrix';
    }
    /**
     * @prop {number} size - The number of elements in the matrix.
     */


    get size() {
      return this.rows * this.columns;
    }
    /**
     * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
     * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
     * @return {Matrix} this
     */


    apply(callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
      }

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          callback.call(this, i, j);
        }
      }

      return this;
    }
    /**
     * Returns a new 1D array filled row by row with the matrix values
     * @return {Array}
     */


    to1DArray() {
      var array = [];

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          array.push(this.get(i, j));
        }
      }

      return array;
    }
    /**
     * Returns a 2D array containing a copy of the data
     * @return {Array}
     */


    to2DArray() {
      var copy = [];

      for (var i = 0; i < this.rows; i++) {
        copy.push([]);

        for (var j = 0; j < this.columns; j++) {
          copy[i].push(this.get(i, j));
        }
      }

      return copy;
    }

    toJSON() {
      return this.to2DArray();
    }
    /**
     * @return {boolean} true if the matrix has one row
     */


    isRowVector() {
      return this.rows === 1;
    }
    /**
     * @return {boolean} true if the matrix has one column
     */


    isColumnVector() {
      return this.columns === 1;
    }
    /**
     * @return {boolean} true if the matrix has one row or one column
     */


    isVector() {
      return this.rows === 1 || this.columns === 1;
    }
    /**
     * @return {boolean} true if the matrix has the same number of rows and columns
     */


    isSquare() {
      return this.rows === this.columns;
    }
    /**
     * @return {boolean} true if the matrix is square and has the same values on both sides of the diagonal
     */


    isSymmetric() {
      if (this.isSquare()) {
        for (var i = 0; i < this.rows; i++) {
          for (var j = 0; j <= i; j++) {
            if (this.get(i, j) !== this.get(j, i)) {
              return false;
            }
          }
        }

        return true;
      }

      return false;
    }
    /**
     * @return true if the matrix is in echelon form
     */


    isEchelonForm() {
      let i = 0;
      let j = 0;
      let previousColumn = -1;
      let isEchelonForm = true;
      let checked = false;

      while (i < this.rows && isEchelonForm) {
        j = 0;
        checked = false;

        while (j < this.columns && checked === false) {
          if (this.get(i, j) === 0) {
            j++;
          } else if (this.get(i, j) === 1 && j > previousColumn) {
            checked = true;
            previousColumn = j;
          } else {
            isEchelonForm = false;
            checked = true;
          }
        }

        i++;
      }

      return isEchelonForm;
    }
    /**
     * @return true if the matrix is in reduced echelon form
     */


    isReducedEchelonForm() {
      let i = 0;
      let j = 0;
      let previousColumn = -1;
      let isReducedEchelonForm = true;
      let checked = false;

      while (i < this.rows && isReducedEchelonForm) {
        j = 0;
        checked = false;

        while (j < this.columns && checked === false) {
          if (this.get(i, j) === 0) {
            j++;
          } else if (this.get(i, j) === 1 && j > previousColumn) {
            checked = true;
            previousColumn = j;
          } else {
            isReducedEchelonForm = false;
            checked = true;
          }
        }

        for (let k = j + 1; k < this.rows; k++) {
          if (this.get(i, k) !== 0) {
            isReducedEchelonForm = false;
          }
        }

        i++;
      }

      return isReducedEchelonForm;
    }
    /**
     * Sets a given element of the matrix.
     * @abstract
     * @param {number} rowIndex - Index of the row
     * @param {number} columnIndex - Index of the column
     * @param {number} value - The new value for the element
     * @return {Matrix} this
     */
    // eslint-disable-next-line no-unused-vars


    set(rowIndex, columnIndex, value) {
      throw new Error('set method is unimplemented');
    }
    /**
     * Returns the given element of the matrix.
     * @abstract
     * @param {number} rowIndex - Index of the row
     * @param {number} columnIndex - Index of the column
     * @return {number}
     */
    // eslint-disable-next-line no-unused-vars


    get(rowIndex, columnIndex) {
      throw new Error('get method is unimplemented');
    }
    /**
     * Creates a new matrix that is a repetition of the current matrix. New matrix has rows times the number of
     * rows of the original matrix, and columns times the number of columns of the original matrix.
     * @param {object} [options]
     * @param {number} [options.rows=1] - Number of times the rows should be repeated
     * @param {number} [options.columns=1] - Number of times the columns should be repeated
     * @return {Matrix}
     * @example
     * var matrix = new Matrix([[1,2]]);
     * matrix.repeat({ rows: 2 }); // [[1,2],[1,2]]
     */


    repeat(options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        rows = 1,
        columns = 1
      } = options;

      if (!Number.isInteger(rows) || rows <= 0) {
        throw new TypeError('rows must be a positive integer');
      }

      if (!Number.isInteger(columns) || columns <= 0) {
        throw new TypeError('columns must be a positive integer');
      }

      var matrix = new Matrix(this.rows * rows, this.columns * columns);

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          matrix.setSubMatrix(this, this.rows * i, this.columns * j);
        }
      }

      return matrix;
    }
    /**
     * Fills the matrix with a given value. All elements will be set to this value.
     * @param {number} value - New value
     * @return {Matrix} this
     */


    fill(value) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, value);
        }
      }

      return this;
    }
    /**
     * Negates the matrix. All elements will be multiplied by (-1)
     * @return {Matrix} this
     */


    neg() {
      return this.mulS(-1);
    }
    /**
     * Returns a new array from the given row index
     * @param {number} index - Row index
     * @return {Array}
     */


    getRow(index) {
      checkRowIndex(this, index);
      var row = [];

      for (var i = 0; i < this.columns; i++) {
        row.push(this.get(index, i));
      }

      return row;
    }
    /**
     * Returns a new row vector from the given row index
     * @param {number} index - Row index
     * @return {Matrix}
     */


    getRowVector(index) {
      return Matrix.rowVector(this.getRow(index));
    }
    /**
     * Sets a row at the given index
     * @param {number} index - Row index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */


    setRow(index, array) {
      checkRowIndex(this, index);
      array = checkRowVector(this, array);

      for (var i = 0; i < this.columns; i++) {
        this.set(index, i, array[i]);
      }

      return this;
    }
    /**
     * Swaps two rows
     * @param {number} row1 - First row index
     * @param {number} row2 - Second row index
     * @return {Matrix} this
     */


    swapRows(row1, row2) {
      checkRowIndex(this, row1);
      checkRowIndex(this, row2);

      for (var i = 0; i < this.columns; i++) {
        var temp = this.get(row1, i);
        this.set(row1, i, this.get(row2, i));
        this.set(row2, i, temp);
      }

      return this;
    }
    /**
     * Returns a new array from the given column index
     * @param {number} index - Column index
     * @return {Array}
     */


    getColumn(index) {
      checkColumnIndex(this, index);
      var column = [];

      for (var i = 0; i < this.rows; i++) {
        column.push(this.get(i, index));
      }

      return column;
    }
    /**
     * Returns a new column vector from the given column index
     * @param {number} index - Column index
     * @return {Matrix}
     */


    getColumnVector(index) {
      return Matrix.columnVector(this.getColumn(index));
    }
    /**
     * Sets a column at the given index
     * @param {number} index - Column index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */


    setColumn(index, array) {
      checkColumnIndex(this, index);
      array = checkColumnVector(this, array);

      for (var i = 0; i < this.rows; i++) {
        this.set(i, index, array[i]);
      }

      return this;
    }
    /**
     * Swaps two columns
     * @param {number} column1 - First column index
     * @param {number} column2 - Second column index
     * @return {Matrix} this
     */


    swapColumns(column1, column2) {
      checkColumnIndex(this, column1);
      checkColumnIndex(this, column2);

      for (var i = 0; i < this.rows; i++) {
        var temp = this.get(i, column1);
        this.set(i, column1, this.get(i, column2));
        this.set(i, column2, temp);
      }

      return this;
    }
    /**
     * Adds the values of a vector to each row
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    addRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + vector[j]);
        }
      }

      return this;
    }
    /**
     * Subtracts the values of a vector from each row
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    subRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - vector[j]);
        }
      }

      return this;
    }
    /**
     * Multiplies the values of a vector with each row
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    mulRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * vector[j]);
        }
      }

      return this;
    }
    /**
     * Divides the values of each row by those of a vector
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    divRowVector(vector) {
      vector = checkRowVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / vector[j]);
        }
      }

      return this;
    }
    /**
     * Adds the values of a vector to each column
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    addColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) + vector[i]);
        }
      }

      return this;
    }
    /**
     * Subtracts the values of a vector from each column
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    subColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) - vector[i]);
        }
      }

      return this;
    }
    /**
     * Multiplies the values of a vector with each column
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    mulColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) * vector[i]);
        }
      }

      return this;
    }
    /**
     * Divides the values of each column by those of a vector
     * @param {Array|Matrix} vector - Array or vector
     * @return {Matrix} this
     */


    divColumnVector(vector) {
      vector = checkColumnVector(this, vector);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.set(i, j, this.get(i, j) / vector[i]);
        }
      }

      return this;
    }
    /**
     * Multiplies the values of a row with a scalar
     * @param {number} index - Row index
     * @param {number} value
     * @return {Matrix} this
     */


    mulRow(index, value) {
      checkRowIndex(this, index);

      for (var i = 0; i < this.columns; i++) {
        this.set(index, i, this.get(index, i) * value);
      }

      return this;
    }
    /**
     * Multiplies the values of a column with a scalar
     * @param {number} index - Column index
     * @param {number} value
     * @return {Matrix} this
     */


    mulColumn(index, value) {
      checkColumnIndex(this, index);

      for (var i = 0; i < this.rows; i++) {
        this.set(i, index, this.get(i, index) * value);
      }

      return this;
    }
    /**
     * Returns the maximum value of the matrix
     * @return {number}
     */


    max() {
      var v = this.get(0, 0);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) > v) {
            v = this.get(i, j);
          }
        }
      }

      return v;
    }
    /**
     * Returns the index of the maximum value
     * @return {Array}
     */


    maxIndex() {
      var v = this.get(0, 0);
      var idx = [0, 0];

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) > v) {
            v = this.get(i, j);
            idx[0] = i;
            idx[1] = j;
          }
        }
      }

      return idx;
    }
    /**
     * Returns the minimum value of the matrix
     * @return {number}
     */


    min() {
      var v = this.get(0, 0);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) < v) {
            v = this.get(i, j);
          }
        }
      }

      return v;
    }
    /**
     * Returns the index of the minimum value
     * @return {Array}
     */


    minIndex() {
      var v = this.get(0, 0);
      var idx = [0, 0];

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          if (this.get(i, j) < v) {
            v = this.get(i, j);
            idx[0] = i;
            idx[1] = j;
          }
        }
      }

      return idx;
    }
    /**
     * Returns the maximum value of one row
     * @param {number} row - Row index
     * @return {number}
     */


    maxRow(row) {
      checkRowIndex(this, row);
      var v = this.get(row, 0);

      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) > v) {
          v = this.get(row, i);
        }
      }

      return v;
    }
    /**
     * Returns the index of the maximum value of one row
     * @param {number} row - Row index
     * @return {Array}
     */


    maxRowIndex(row) {
      checkRowIndex(this, row);
      var v = this.get(row, 0);
      var idx = [row, 0];

      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) > v) {
          v = this.get(row, i);
          idx[1] = i;
        }
      }

      return idx;
    }
    /**
     * Returns the minimum value of one row
     * @param {number} row - Row index
     * @return {number}
     */


    minRow(row) {
      checkRowIndex(this, row);
      var v = this.get(row, 0);

      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) < v) {
          v = this.get(row, i);
        }
      }

      return v;
    }
    /**
     * Returns the index of the maximum value of one row
     * @param {number} row - Row index
     * @return {Array}
     */


    minRowIndex(row) {
      checkRowIndex(this, row);
      var v = this.get(row, 0);
      var idx = [row, 0];

      for (var i = 1; i < this.columns; i++) {
        if (this.get(row, i) < v) {
          v = this.get(row, i);
          idx[1] = i;
        }
      }

      return idx;
    }
    /**
     * Returns the maximum value of one column
     * @param {number} column - Column index
     * @return {number}
     */


    maxColumn(column) {
      checkColumnIndex(this, column);
      var v = this.get(0, column);

      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) > v) {
          v = this.get(i, column);
        }
      }

      return v;
    }
    /**
     * Returns the index of the maximum value of one column
     * @param {number} column - Column index
     * @return {Array}
     */


    maxColumnIndex(column) {
      checkColumnIndex(this, column);
      var v = this.get(0, column);
      var idx = [0, column];

      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) > v) {
          v = this.get(i, column);
          idx[0] = i;
        }
      }

      return idx;
    }
    /**
     * Returns the minimum value of one column
     * @param {number} column - Column index
     * @return {number}
     */


    minColumn(column) {
      checkColumnIndex(this, column);
      var v = this.get(0, column);

      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) < v) {
          v = this.get(i, column);
        }
      }

      return v;
    }
    /**
     * Returns the index of the minimum value of one column
     * @param {number} column - Column index
     * @return {Array}
     */


    minColumnIndex(column) {
      checkColumnIndex(this, column);
      var v = this.get(0, column);
      var idx = [0, column];

      for (var i = 1; i < this.rows; i++) {
        if (this.get(i, column) < v) {
          v = this.get(i, column);
          idx[0] = i;
        }
      }

      return idx;
    }
    /**
     * Returns an array containing the diagonal values of the matrix
     * @return {Array}
     */


    diag() {
      var min = Math.min(this.rows, this.columns);
      var diag = [];

      for (var i = 0; i < min; i++) {
        diag.push(this.get(i, i));
      }

      return diag;
    }
    /**
     * Returns the norm of a matrix.
     * @param {string} type - "frobenius" (default) or "max" return resp. the Frobenius norm and the max norm.
     * @return {number}
     */


    norm(type = 'frobenius') {
      var result = 0;

      if (type === 'max') {
        return this.max();
      } else if (type === 'frobenius') {
        for (var i = 0; i < this.rows; i++) {
          for (var j = 0; j < this.columns; j++) {
            result = result + this.get(i, j) * this.get(i, j);
          }
        }

        return Math.sqrt(result);
      } else {
        throw new RangeError(`unknown norm type: ${type}`);
      }
    }
    /**
     * Computes the cumulative sum of the matrix elements (in place, row by row)
     * @return {Matrix} this
     */


    cumulativeSum() {
      var sum = 0;

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          sum += this.get(i, j);
          this.set(i, j, sum);
        }
      }

      return this;
    }
    /**
     * Computes the dot (scalar) product between the matrix and another.
     * @param {Matrix} vector2 vector
     * @return {number}
     */


    dot(vector2) {
      if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
      var vector1 = this.to1DArray();

      if (vector1.length !== vector2.length) {
        throw new RangeError('vectors do not have the same size');
      }

      var dot = 0;

      for (var i = 0; i < vector1.length; i++) {
        dot += vector1[i] * vector2[i];
      }

      return dot;
    }
    /**
     * Returns the matrix product between this and other
     * @param {Matrix} other
     * @return {Matrix}
     */


    mmul(other) {
      other = Matrix.checkMatrix(other);

      if (this.columns !== other.rows) {
        // eslint-disable-next-line no-console
        console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
      }

      var m = this.rows;
      var n = this.columns;
      var p = other.columns;
      var result = new Matrix(m, p);
      var Bcolj = new Array(n);

      for (var j = 0; j < p; j++) {
        for (var k = 0; k < n; k++) {
          Bcolj[k] = other.get(k, j);
        }

        for (var i = 0; i < m; i++) {
          var s = 0;

          for (k = 0; k < n; k++) {
            s += this.get(i, k) * Bcolj[k];
          }

          result.set(i, j, s);
        }
      }

      return result;
    }

    strassen2x2(other) {
      other = Matrix.checkMatrix(other);
      var result = new Matrix(2, 2);
      const a11 = this.get(0, 0);
      const b11 = other.get(0, 0);
      const a12 = this.get(0, 1);
      const b12 = other.get(0, 1);
      const a21 = this.get(1, 0);
      const b21 = other.get(1, 0);
      const a22 = this.get(1, 1);
      const b22 = other.get(1, 1); // Compute intermediate values.

      const m1 = (a11 + a22) * (b11 + b22);
      const m2 = (a21 + a22) * b11;
      const m3 = a11 * (b12 - b22);
      const m4 = a22 * (b21 - b11);
      const m5 = (a11 + a12) * b22;
      const m6 = (a21 - a11) * (b11 + b12);
      const m7 = (a12 - a22) * (b21 + b22); // Combine intermediate values into the output.

      const c00 = m1 + m4 - m5 + m7;
      const c01 = m3 + m5;
      const c10 = m2 + m4;
      const c11 = m1 - m2 + m3 + m6;
      result.set(0, 0, c00);
      result.set(0, 1, c01);
      result.set(1, 0, c10);
      result.set(1, 1, c11);
      return result;
    }

    strassen3x3(other) {
      other = Matrix.checkMatrix(other);
      var result = new Matrix(3, 3);
      const a00 = this.get(0, 0);
      const a01 = this.get(0, 1);
      const a02 = this.get(0, 2);
      const a10 = this.get(1, 0);
      const a11 = this.get(1, 1);
      const a12 = this.get(1, 2);
      const a20 = this.get(2, 0);
      const a21 = this.get(2, 1);
      const a22 = this.get(2, 2);
      const b00 = other.get(0, 0);
      const b01 = other.get(0, 1);
      const b02 = other.get(0, 2);
      const b10 = other.get(1, 0);
      const b11 = other.get(1, 1);
      const b12 = other.get(1, 2);
      const b20 = other.get(2, 0);
      const b21 = other.get(2, 1);
      const b22 = other.get(2, 2);
      const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
      const m2 = (a00 - a10) * (-b01 + b11);
      const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
      const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
      const m5 = (a10 + a11) * (-b00 + b01);
      const m6 = a00 * b00;
      const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
      const m8 = (-a00 + a20) * (b02 - b12);
      const m9 = (a20 + a21) * (-b00 + b02);
      const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
      const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
      const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
      const m13 = (a02 - a22) * (b11 - b21);
      const m14 = a02 * b20;
      const m15 = (a21 + a22) * (-b20 + b21);
      const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
      const m17 = (a02 - a12) * (b12 - b22);
      const m18 = (a11 + a12) * (-b20 + b22);
      const m19 = a01 * b10;
      const m20 = a12 * b21;
      const m21 = a10 * b02;
      const m22 = a20 * b01;
      const m23 = a22 * b22;
      const c00 = m6 + m14 + m19;
      const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
      const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
      const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
      const c11 = m2 + m4 + m5 + m6 + m20;
      const c12 = m14 + m16 + m17 + m18 + m21;
      const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
      const c21 = m12 + m13 + m14 + m15 + m22;
      const c22 = m6 + m7 + m8 + m9 + m23;
      result.set(0, 0, c00);
      result.set(0, 1, c01);
      result.set(0, 2, c02);
      result.set(1, 0, c10);
      result.set(1, 1, c11);
      result.set(1, 2, c12);
      result.set(2, 0, c20);
      result.set(2, 1, c21);
      result.set(2, 2, c22);
      return result;
    }
    /**
     * Returns the matrix product between x and y. More efficient than mmul(other) only when we multiply squared matrix and when the size of the matrix is > 1000.
     * @param {Matrix} y
     * @return {Matrix}
     */


    mmulStrassen(y) {
      y = Matrix.checkMatrix(y);
      var x = this.clone();
      var r1 = x.rows;
      var c1 = x.columns;
      var r2 = y.rows;
      var c2 = y.columns;

      if (c1 !== r2) {
        // eslint-disable-next-line no-console
        console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
      } // Put a matrix into the top left of a matrix of zeros.
      // `rows` and `cols` are the dimensions of the output matrix.


      function embed(mat, rows, cols) {
        var r = mat.rows;
        var c = mat.columns;

        if (r === rows && c === cols) {
          return mat;
        } else {
          var resultat = AbstractMatrix.zeros(rows, cols);
          resultat = resultat.setSubMatrix(mat, 0, 0);
          return resultat;
        }
      } // Make sure both matrices are the same size.
      // This is exclusively for simplicity:
      // this algorithm can be implemented with matrices of different sizes.


      var r = Math.max(r1, r2);
      var c = Math.max(c1, c2);
      x = embed(x, r, c);
      y = embed(y, r, c); // Our recursive multiplication function.

      function blockMult(a, b, rows, cols) {
        // For small matrices, resort to naive multiplication.
        if (rows <= 512 || cols <= 512) {
          return a.mmul(b); // a is equivalent to this
        } // Apply dynamic padding.


        if (rows % 2 === 1 && cols % 2 === 1) {
          a = embed(a, rows + 1, cols + 1);
          b = embed(b, rows + 1, cols + 1);
        } else if (rows % 2 === 1) {
          a = embed(a, rows + 1, cols);
          b = embed(b, rows + 1, cols);
        } else if (cols % 2 === 1) {
          a = embed(a, rows, cols + 1);
          b = embed(b, rows, cols + 1);
        }

        var halfRows = parseInt(a.rows / 2, 10);
        var halfCols = parseInt(a.columns / 2, 10); // Subdivide input matrices.

        var a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
        var b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);
        var a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
        var b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);
        var a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
        var b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);
        var a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
        var b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1); // Compute intermediate values.

        var m1 = blockMult(AbstractMatrix.add(a11, a22), AbstractMatrix.add(b11, b22), halfRows, halfCols);
        var m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
        var m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
        var m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
        var m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
        var m6 = blockMult(AbstractMatrix.sub(a21, a11), AbstractMatrix.add(b11, b12), halfRows, halfCols);
        var m7 = blockMult(AbstractMatrix.sub(a12, a22), AbstractMatrix.add(b21, b22), halfRows, halfCols); // Combine intermediate values into the output.

        var c11 = AbstractMatrix.add(m1, m4);
        c11.sub(m5);
        c11.add(m7);
        var c12 = AbstractMatrix.add(m3, m5);
        var c21 = AbstractMatrix.add(m2, m4);
        var c22 = AbstractMatrix.sub(m1, m2);
        c22.add(m3);
        c22.add(m6); // Crop output to the desired size (undo dynamic padding).

        var resultat = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
        resultat = resultat.setSubMatrix(c11, 0, 0);
        resultat = resultat.setSubMatrix(c12, c11.rows, 0);
        resultat = resultat.setSubMatrix(c21, 0, c11.columns);
        resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
        return resultat.subMatrix(0, rows - 1, 0, cols - 1);
      }

      return blockMult(x, y, r, c);
    }
    /**
     * Returns a row-by-row scaled matrix
     * @param {object} [options]
     * @param {number} [options.min=0] - Minimum scaled value
     * @param {number} [optiens.max=1] - Maximum scaled value
     * @return {Matrix} - The scaled matrix
     */


    scaleRows(options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        min = 0,
        max = 1
      } = options;
      if (!Number.isFinite(min)) throw new TypeError('min must be a number');
      if (!Number.isFinite(max)) throw new TypeError('max must be a number');
      if (min >= max) throw new RangeError('min must be smaller than max');
      var newMatrix = new Matrix(this.rows, this.columns);

      for (var i = 0; i < this.rows; i++) {
        const row = this.getRow(i);
        rescale(row, {
          min,
          max,
          output: row
        });
        newMatrix.setRow(i, row);
      }

      return newMatrix;
    }
    /**
     * Returns a new column-by-column scaled matrix
     * @param {object} [options]
     * @param {number} [options.min=0] - Minimum scaled value
     * @param {number} [optiens.max=1] - Maximum scaled value
     * @return {Matrix} - The new scaled matrix
     * @example
     * var matrix = new Matrix([[1,2],[-1,0]]);
     * var scaledMatrix = matrix.scaleColumns(); // [[1,1],[0,0]]
     */


    scaleColumns(options = {}) {
      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        min = 0,
        max = 1
      } = options;
      if (!Number.isFinite(min)) throw new TypeError('min must be a number');
      if (!Number.isFinite(max)) throw new TypeError('max must be a number');
      if (min >= max) throw new RangeError('min must be smaller than max');
      var newMatrix = new Matrix(this.rows, this.columns);

      for (var i = 0; i < this.columns; i++) {
        const column = this.getColumn(i);
        rescale(column, {
          min: min,
          max: max,
          output: column
        });
        newMatrix.setColumn(i, column);
      }

      return newMatrix;
    }

    flipRows() {
      const middle = Math.ceil(this.columns / 2);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < middle; j++) {
          var first = this.get(i, j);
          var last = this.get(i, this.columns - 1 - j);
          this.set(i, j, last);
          this.set(i, this.columns - 1 - j, first);
        }
      }

      return this;
    }

    flipColumns() {
      const middle = Math.ceil(this.rows / 2);

      for (var j = 0; j < this.columns; j++) {
        for (var i = 0; i < middle; i++) {
          var first = this.get(i, j);
          var last = this.get(this.rows - 1 - i, j);
          this.set(i, j, last);
          this.set(this.rows - 1 - i, j, first);
        }
      }

      return this;
    }
    /**
     * Returns the Kronecker product (also known as tensor product) between this and other
     * See https://en.wikipedia.org/wiki/Kronecker_product
     * @param {Matrix} other
     * @return {Matrix}
     */


    kroneckerProduct(other) {
      other = Matrix.checkMatrix(other);
      var m = this.rows;
      var n = this.columns;
      var p = other.rows;
      var q = other.columns;
      var result = new Matrix(m * p, n * q);

      for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++) {
          for (var k = 0; k < p; k++) {
            for (var l = 0; l < q; l++) {
              result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
            }
          }
        }
      }

      return result;
    }
    /**
     * Transposes the matrix and returns a new one containing the result
     * @return {Matrix}
     */


    transpose() {
      var result = new Matrix(this.columns, this.rows);

      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          result.set(j, i, this.get(i, j));
        }
      }

      return result;
    }
    /**
     * Sorts the rows (in place)
     * @param {function} [compareFunction] - usual Array.prototype.sort comparison function
     * @return {Matrix} this
     */


    sortRows(compareFunction = compareNumbers) {
      for (var i = 0; i < this.rows; i++) {
        this.setRow(i, this.getRow(i).sort(compareFunction));
      }

      return this;
    }
    /**
     * Sorts the columns (in place)
     * @param {function} [compareFunction] - usual Array.prototype.sort comparison function
     * @return {Matrix} this
     */


    sortColumns(compareFunction = compareNumbers) {
      for (var i = 0; i < this.columns; i++) {
        this.setColumn(i, this.getColumn(i).sort(compareFunction));
      }

      return this;
    }
    /**
     * Returns a subset of the matrix
     * @param {number} startRow - First row index
     * @param {number} endRow - Last row index
     * @param {number} startColumn - First column index
     * @param {number} endColumn - Last column index
     * @return {Matrix}
     */


    subMatrix(startRow, endRow, startColumn, endColumn) {
      checkRange(this, startRow, endRow, startColumn, endColumn);
      var newMatrix = new Matrix(endRow - startRow + 1, endColumn - startColumn + 1);

      for (var i = startRow; i <= endRow; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
          newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
        }
      }

      return newMatrix;
    }
    /**
     * Returns a subset of the matrix based on an array of row indices
     * @param {Array} indices - Array containing the row indices
     * @param {number} [startColumn = 0] - First column index
     * @param {number} [endColumn = this.columns-1] - Last column index
     * @return {Matrix}
     */


    subMatrixRow(indices, startColumn, endColumn) {
      if (startColumn === undefined) startColumn = 0;
      if (endColumn === undefined) endColumn = this.columns - 1;

      if (startColumn > endColumn || startColumn < 0 || startColumn >= this.columns || endColumn < 0 || endColumn >= this.columns) {
        throw new RangeError('Argument out of range');
      }

      var newMatrix = new Matrix(indices.length, endColumn - startColumn + 1);

      for (var i = 0; i < indices.length; i++) {
        for (var j = startColumn; j <= endColumn; j++) {
          if (indices[i] < 0 || indices[i] >= this.rows) {
            throw new RangeError(`Row index out of range: ${indices[i]}`);
          }

          newMatrix.set(i, j - startColumn, this.get(indices[i], j));
        }
      }

      return newMatrix;
    }
    /**
     * Returns a subset of the matrix based on an array of column indices
     * @param {Array} indices - Array containing the column indices
     * @param {number} [startRow = 0] - First row index
     * @param {number} [endRow = this.rows-1] - Last row index
     * @return {Matrix}
     */


    subMatrixColumn(indices, startRow, endRow) {
      if (startRow === undefined) startRow = 0;
      if (endRow === undefined) endRow = this.rows - 1;

      if (startRow > endRow || startRow < 0 || startRow >= this.rows || endRow < 0 || endRow >= this.rows) {
        throw new RangeError('Argument out of range');
      }

      var newMatrix = new Matrix(endRow - startRow + 1, indices.length);

      for (var i = 0; i < indices.length; i++) {
        for (var j = startRow; j <= endRow; j++) {
          if (indices[i] < 0 || indices[i] >= this.columns) {
            throw new RangeError(`Column index out of range: ${indices[i]}`);
          }

          newMatrix.set(j - startRow, i, this.get(j, indices[i]));
        }
      }

      return newMatrix;
    }
    /**
     * Set a part of the matrix to the given sub-matrix
     * @param {Matrix|Array< Array >} matrix - The source matrix from which to extract values.
     * @param {number} startRow - The index of the first row to set
     * @param {number} startColumn - The index of the first column to set
     * @return {Matrix}
     */


    setSubMatrix(matrix, startRow, startColumn) {
      matrix = Matrix.checkMatrix(matrix);
      var endRow = startRow + matrix.rows - 1;
      var endColumn = startColumn + matrix.columns - 1;
      checkRange(this, startRow, endRow, startColumn, endColumn);

      for (var i = 0; i < matrix.rows; i++) {
        for (var j = 0; j < matrix.columns; j++) {
          this.set(startRow + i, startColumn + j, matrix.get(i, j));
        }
      }

      return this;
    }
    /**
     * Return a new matrix based on a selection of rows and columns
     * @param {Array<number>} rowIndices - The row indices to select. Order matters and an index can be more than once.
     * @param {Array<number>} columnIndices - The column indices to select. Order matters and an index can be use more than once.
     * @return {Matrix} The new matrix
     */


    selection(rowIndices, columnIndices) {
      var indices = checkIndices(this, rowIndices, columnIndices);
      var newMatrix = new Matrix(rowIndices.length, columnIndices.length);

      for (var i = 0; i < indices.row.length; i++) {
        var rowIndex = indices.row[i];

        for (var j = 0; j < indices.column.length; j++) {
          var columnIndex = indices.column[j];
          newMatrix.set(i, j, this.get(rowIndex, columnIndex));
        }
      }

      return newMatrix;
    }
    /**
     * Returns the trace of the matrix (sum of the diagonal elements)
     * @return {number}
     */


    trace() {
      var min = Math.min(this.rows, this.columns);
      var trace = 0;

      for (var i = 0; i < min; i++) {
        trace += this.get(i, i);
      }

      return trace;
    }
    /**
     * Creates an exact and independent copy of the matrix
     * @return {Matrix}
     */


    clone() {
      var newMatrix = new Matrix(this.rows, this.columns);

      for (var row = 0; row < this.rows; row++) {
        for (var column = 0; column < this.columns; column++) {
          newMatrix.set(row, column, this.get(row, column));
        }
      }

      return newMatrix;
    }

    sum(by) {
      switch (by) {
        case 'row':
          return sumByRow(this);

        case 'column':
          return sumByColumn(this);

        case undefined:
          return sumAll(this);

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    product(by) {
      switch (by) {
        case 'row':
          return productByRow(this);

        case 'column':
          return productByColumn(this);

        case undefined:
          return productAll(this);

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    mean(by) {
      const sum = this.sum(by);

      switch (by) {
        case 'row':
          {
            for (let i = 0; i < this.rows; i++) {
              sum[i] /= this.columns;
            }

            return sum;
          }

        case 'column':
          {
            for (let i = 0; i < this.columns; i++) {
              sum[i] /= this.rows;
            }

            return sum;
          }

        case undefined:
          return sum / this.size;

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    variance(by, options = {}) {
      if (typeof by === 'object') {
        options = by;
        by = undefined;
      }

      if (typeof options !== 'object') {
        throw new TypeError('options must be an object');
      }

      const {
        unbiased = true,
        mean = this.mean(by)
      } = options;

      if (typeof unbiased !== 'boolean') {
        throw new TypeError('unbiased must be a boolean');
      }

      switch (by) {
        case 'row':
          {
            if (!Array.isArray(mean)) {
              throw new TypeError('mean must be an array');
            }

            return varianceByRow(this, unbiased, mean);
          }

        case 'column':
          {
            if (!Array.isArray(mean)) {
              throw new TypeError('mean must be an array');
            }

            return varianceByColumn(this, unbiased, mean);
          }

        case undefined:
          {
            if (typeof mean !== 'number') {
              throw new TypeError('mean must be a number');
            }

            return varianceAll(this, unbiased, mean);
          }

        default:
          throw new Error(`invalid option: ${by}`);
      }
    }

    standardDeviation(by, options) {
      if (typeof by === 'object') {
        options = by;
        by = undefined;
      }

      const variance = this.variance(by, options);

      if (by === undefined) {
        return Math.sqrt(variance);
      } else {
        for (var i = 0; i < variance.length; i++) {
          variance[i] = Math.sqrt(variance[i]);
        }

        return variance;
      }
    }

  }
  AbstractMatrix.prototype.klass = 'Matrix';

  if (typeof Symbol !== 'undefined') {
    AbstractMatrix.prototype[Symbol.for('nodejs.util.inspect.custom')] = inspectMatrix;
  }

  function compareNumbers(a, b) {
    return a - b;
  } // Synonyms


  AbstractMatrix.random = AbstractMatrix.rand;
  AbstractMatrix.randomInt = AbstractMatrix.randInt;
  AbstractMatrix.diagonal = AbstractMatrix.diag;
  AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
  AbstractMatrix.identity = AbstractMatrix.eye;
  AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
  AbstractMatrix.prototype.tensorProduct = AbstractMatrix.prototype.kroneckerProduct;
  class Matrix extends AbstractMatrix {
    constructor(nRows, nColumns) {
      super();

      if (Matrix.isMatrix(nRows)) {
        return nRows.clone();
      } else if (Number.isInteger(nRows) && nRows > 0) {
        // Create an empty matrix
        this.data = [];

        if (Number.isInteger(nColumns) && nColumns > 0) {
          for (let i = 0; i < nRows; i++) {
            this.data.push([]);

            for (let j = 0; j < nColumns; j++) {
              this.data[i].push(0);
            }
          }
        } else {
          throw new TypeError('nColumns must be a positive integer');
        }
      } else if (Array.isArray(nRows)) {
        // Copy the values from the 2D array
        const arrayData = nRows;
        nRows = arrayData.length;
        nColumns = arrayData[0].length;

        if (typeof nColumns !== 'number' || nColumns === 0) {
          throw new TypeError('Data must be a 2D array with at least one element');
        }

        this.data = [];

        for (let i = 0; i < nRows; i++) {
          if (arrayData[i].length !== nColumns) {
            throw new RangeError('Inconsistent array dimensions');
          }

          this.data.push(arrayData[i].slice());
        }
      } else {
        throw new TypeError('First argument must be a positive number or an array');
      }

      this.rows = nRows;
      this.columns = nColumns;
      return this;
    }

    set(rowIndex, columnIndex, value) {
      this.data[rowIndex][columnIndex] = value;
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.data[rowIndex][columnIndex];
    }
    /**
     * Removes a row from the given index
     * @param {number} index - Row index
     * @return {Matrix} this
     */


    removeRow(index) {
      checkRowIndex(this, index);

      if (this.rows === 1) {
        throw new RangeError('A matrix cannot have less than one row');
      }

      this.data.splice(index, 1);
      this.rows -= 1;
      return this;
    }
    /**
     * Adds a row at the given index
     * @param {number} [index = this.rows] - Row index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */


    addRow(index, array) {
      if (array === undefined) {
        array = index;
        index = this.rows;
      }

      checkRowIndex(this, index, true);
      array = checkRowVector(this, array, true);
      this.data.splice(index, 0, array);
      this.rows += 1;
      return this;
    }
    /**
     * Removes a column from the given index
     * @param {number} index - Column index
     * @return {Matrix} this
     */


    removeColumn(index) {
      checkColumnIndex(this, index);

      if (this.columns === 1) {
        throw new RangeError('A matrix cannot have less than one column');
      }

      for (var i = 0; i < this.rows; i++) {
        this.data[i].splice(index, 1);
      }

      this.columns -= 1;
      return this;
    }
    /**
     * Adds a column at the given index
     * @param {number} [index = this.columns] - Column index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */


    addColumn(index, array) {
      if (typeof array === 'undefined') {
        array = index;
        index = this.columns;
      }

      checkColumnIndex(this, index, true);
      array = checkColumnVector(this, array);

      for (var i = 0; i < this.rows; i++) {
        this.data[i].splice(index, 0, array[i]);
      }

      this.columns += 1;
      return this;
    }

  }
  installMathOperations(AbstractMatrix, Matrix);

  class BaseView extends AbstractMatrix {
    constructor(matrix, rows, columns) {
      super();
      this.matrix = matrix;
      this.rows = rows;
      this.columns = columns;
    }

  }

  class MatrixColumnView extends BaseView {
    constructor(matrix, column) {
      checkColumnIndex(matrix, column);
      super(matrix, matrix.rows, 1);
      this.column = column;
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(rowIndex, this.column, value);
      return this;
    }

    get(rowIndex) {
      return this.matrix.get(rowIndex, this.column);
    }

  }

  class MatrixColumnSelectionView extends BaseView {
    constructor(matrix, columnIndices) {
      columnIndices = checkColumnIndices(matrix, columnIndices);
      super(matrix, matrix.rows, columnIndices.length);
      this.columnIndices = columnIndices;
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(rowIndex, this.columnIndices[columnIndex], value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(rowIndex, this.columnIndices[columnIndex]);
    }

  }

  class MatrixFlipColumnView extends BaseView {
    constructor(matrix) {
      super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
    }

  }

  class MatrixFlipRowView extends BaseView {
    constructor(matrix) {
      super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
    }

  }

  class MatrixRowView extends BaseView {
    constructor(matrix, row) {
      checkRowIndex(matrix, row);
      super(matrix, 1, matrix.columns);
      this.row = row;
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(this.row, columnIndex, value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(this.row, columnIndex);
    }

  }

  class MatrixRowSelectionView extends BaseView {
    constructor(matrix, rowIndices) {
      rowIndices = checkRowIndices(matrix, rowIndices);
      super(matrix, rowIndices.length, matrix.columns);
      this.rowIndices = rowIndices;
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(this.rowIndices[rowIndex], columnIndex, value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(this.rowIndices[rowIndex], columnIndex);
    }

  }

  class MatrixSelectionView extends BaseView {
    constructor(matrix, rowIndices, columnIndices) {
      var indices = checkIndices(matrix, rowIndices, columnIndices);
      super(matrix, indices.row.length, indices.column.length);
      this.rowIndices = indices.row;
      this.columnIndices = indices.column;
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(this.rowIndices[rowIndex], this.columnIndices[columnIndex], value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(this.rowIndices[rowIndex], this.columnIndices[columnIndex]);
    }

  }

  class MatrixSubView extends BaseView {
    constructor(matrix, startRow, endRow, startColumn, endColumn) {
      checkRange(matrix, startRow, endRow, startColumn, endColumn);
      super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
      this.startRow = startRow;
      this.startColumn = startColumn;
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(this.startRow + rowIndex, this.startColumn + columnIndex, value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(this.startRow + rowIndex, this.startColumn + columnIndex);
    }

  }

  class MatrixTransposeView extends BaseView {
    constructor(matrix) {
      super(matrix, matrix.columns, matrix.rows);
    }

    set(rowIndex, columnIndex, value) {
      this.matrix.set(columnIndex, rowIndex, value);
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.matrix.get(columnIndex, rowIndex);
    }

  }

  class WrapperMatrix1D extends AbstractMatrix {
    /**
     * @class WrapperMatrix1D
     * @param {Array<number>} data
     * @param {object} [options]
     * @param {object} [options.rows = 1]
     */
    constructor(data, options = {}) {
      const {
        rows = 1
      } = options;

      if (data.length % rows !== 0) {
        throw new Error('the data length is not divisible by the number of rows');
      }

      super();
      this.rows = rows;
      this.columns = data.length / rows;
      this.data = data;
    }

    set(rowIndex, columnIndex, value) {
      var index = this._calculateIndex(rowIndex, columnIndex);

      this.data[index] = value;
      return this;
    }

    get(rowIndex, columnIndex) {
      var index = this._calculateIndex(rowIndex, columnIndex);

      return this.data[index];
    }

    _calculateIndex(row, column) {
      return row * this.columns + column;
    }

  }

  class WrapperMatrix2D extends AbstractMatrix {
    /**
     * @class WrapperMatrix2D
     * @param {Array<Array<number>>} data
     */
    constructor(data) {
      super();
      this.data = data;
      this.rows = data.length;
      this.columns = data[0].length;
    }

    set(rowIndex, columnIndex, value) {
      this.data[rowIndex][columnIndex] = value;
      return this;
    }

    get(rowIndex, columnIndex) {
      return this.data[rowIndex][columnIndex];
    }

  }

  /**
   * @param {Array<Array<number>>|Array<number>} array
   * @param {object} [options]
   * @param {object} [options.rows = 1]
   * @return {WrapperMatrix1D|WrapperMatrix2D}
   */

  function wrap(array, options) {
    if (Array.isArray(array)) {
      if (array[0] && Array.isArray(array[0])) {
        return new WrapperMatrix2D(array);
      } else {
        return new WrapperMatrix1D(array, options);
      }
    } else {
      throw new Error('the argument is not an array');
    }
  }

  /**
   * @class LuDecomposition
   * @link https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
   * @param {Matrix} matrix
   */

  class LuDecomposition {
    constructor(matrix) {
      matrix = WrapperMatrix2D.checkMatrix(matrix);
      var lu = matrix.clone();
      var rows = lu.rows;
      var columns = lu.columns;
      var pivotVector = new Array(rows);
      var pivotSign = 1;
      var i, j, k, p, s, t, v;
      var LUcolj, kmax;

      for (i = 0; i < rows; i++) {
        pivotVector[i] = i;
      }

      LUcolj = new Array(rows);

      for (j = 0; j < columns; j++) {
        for (i = 0; i < rows; i++) {
          LUcolj[i] = lu.get(i, j);
        }

        for (i = 0; i < rows; i++) {
          kmax = Math.min(i, j);
          s = 0;

          for (k = 0; k < kmax; k++) {
            s += lu.get(i, k) * LUcolj[k];
          }

          LUcolj[i] -= s;
          lu.set(i, j, LUcolj[i]);
        }

        p = j;

        for (i = j + 1; i < rows; i++) {
          if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
            p = i;
          }
        }

        if (p !== j) {
          for (k = 0; k < columns; k++) {
            t = lu.get(p, k);
            lu.set(p, k, lu.get(j, k));
            lu.set(j, k, t);
          }

          v = pivotVector[p];
          pivotVector[p] = pivotVector[j];
          pivotVector[j] = v;
          pivotSign = -pivotSign;
        }

        if (j < rows && lu.get(j, j) !== 0) {
          for (i = j + 1; i < rows; i++) {
            lu.set(i, j, lu.get(i, j) / lu.get(j, j));
          }
        }
      }

      this.LU = lu;
      this.pivotVector = pivotVector;
      this.pivotSign = pivotSign;
    }
    /**
     *
     * @return {boolean}
     */


    isSingular() {
      var data = this.LU;
      var col = data.columns;

      for (var j = 0; j < col; j++) {
        if (data.get(j, j) === 0) {
          return true;
        }
      }

      return false;
    }
    /**
     *
     * @param {Matrix} value
     * @return {Matrix}
     */


    solve(value) {
      value = Matrix.checkMatrix(value);
      var lu = this.LU;
      var rows = lu.rows;

      if (rows !== value.rows) {
        throw new Error('Invalid matrix dimensions');
      }

      if (this.isSingular()) {
        throw new Error('LU matrix is singular');
      }

      var count = value.columns;
      var X = value.subMatrixRow(this.pivotVector, 0, count - 1);
      var columns = lu.columns;
      var i, j, k;

      for (k = 0; k < columns; k++) {
        for (i = k + 1; i < columns; i++) {
          for (j = 0; j < count; j++) {
            X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
          }
        }
      }

      for (k = columns - 1; k >= 0; k--) {
        for (j = 0; j < count; j++) {
          X.set(k, j, X.get(k, j) / lu.get(k, k));
        }

        for (i = 0; i < k; i++) {
          for (j = 0; j < count; j++) {
            X.set(i, j, X.get(i, j) - X.get(k, j) * lu.get(i, k));
          }
        }
      }

      return X;
    }
    /**
     *
     * @return {number}
     */


    get determinant() {
      var data = this.LU;

      if (!data.isSquare()) {
        throw new Error('Matrix must be square');
      }

      var determinant = this.pivotSign;
      var col = data.columns;

      for (var j = 0; j < col; j++) {
        determinant *= data.get(j, j);
      }

      return determinant;
    }
    /**
     *
     * @return {Matrix}
     */


    get lowerTriangularMatrix() {
      var data = this.LU;
      var rows = data.rows;
      var columns = data.columns;
      var X = new Matrix(rows, columns);

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          if (i > j) {
            X.set(i, j, data.get(i, j));
          } else if (i === j) {
            X.set(i, j, 1);
          } else {
            X.set(i, j, 0);
          }
        }
      }

      return X;
    }
    /**
     *
     * @return {Matrix}
     */


    get upperTriangularMatrix() {
      var data = this.LU;
      var rows = data.rows;
      var columns = data.columns;
      var X = new Matrix(rows, columns);

      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          if (i <= j) {
            X.set(i, j, data.get(i, j));
          } else {
            X.set(i, j, 0);
          }
        }
      }

      return X;
    }
    /**
     *
     * @return {Array<number>}
     */


    get pivotPermutationVector() {
      return this.pivotVector.slice();
    }

  }

  function hypotenuse(a, b) {
    var r = 0;

    if (Math.abs(a) > Math.abs(b)) {
      r = b / a;
      return Math.abs(a) * Math.sqrt(1 + r * r);
    }

    if (b !== 0) {
      r = a / b;
      return Math.abs(b) * Math.sqrt(1 + r * r);
    }

    return 0;
  }

  /**
   * @class QrDecomposition
   * @link https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
   * @param {Matrix} value
   */

  class QrDecomposition {
    constructor(value) {
      value = WrapperMatrix2D.checkMatrix(value);
      var qr = value.clone();
      var m = value.rows;
      var n = value.columns;
      var rdiag = new Array(n);
      var i, j, k, s;

      for (k = 0; k < n; k++) {
        var nrm = 0;

        for (i = k; i < m; i++) {
          nrm = hypotenuse(nrm, qr.get(i, k));
        }

        if (nrm !== 0) {
          if (qr.get(k, k) < 0) {
            nrm = -nrm;
          }

          for (i = k; i < m; i++) {
            qr.set(i, k, qr.get(i, k) / nrm);
          }

          qr.set(k, k, qr.get(k, k) + 1);

          for (j = k + 1; j < n; j++) {
            s = 0;

            for (i = k; i < m; i++) {
              s += qr.get(i, k) * qr.get(i, j);
            }

            s = -s / qr.get(k, k);

            for (i = k; i < m; i++) {
              qr.set(i, j, qr.get(i, j) + s * qr.get(i, k));
            }
          }
        }

        rdiag[k] = -nrm;
      }

      this.QR = qr;
      this.Rdiag = rdiag;
    }
    /**
     * Solve a problem of least square (Ax=b) by using the QR decomposition. Useful when A is rectangular, but not working when A is singular.
     * Example : We search to approximate x, with A matrix shape m*n, x vector size n, b vector size m (m > n). We will use :
     * var qr = QrDecomposition(A);
     * var x = qr.solve(b);
     * @param {Matrix} value - Matrix 1D which is the vector b (in the equation Ax = b)
     * @return {Matrix} - The vector x
     */


    solve(value) {
      value = Matrix.checkMatrix(value);
      var qr = this.QR;
      var m = qr.rows;

      if (value.rows !== m) {
        throw new Error('Matrix row dimensions must agree');
      }

      if (!this.isFullRank()) {
        throw new Error('Matrix is rank deficient');
      }

      var count = value.columns;
      var X = value.clone();
      var n = qr.columns;
      var i, j, k, s;

      for (k = 0; k < n; k++) {
        for (j = 0; j < count; j++) {
          s = 0;

          for (i = k; i < m; i++) {
            s += qr.get(i, k) * X.get(i, j);
          }

          s = -s / qr.get(k, k);

          for (i = k; i < m; i++) {
            X.set(i, j, X.get(i, j) + s * qr.get(i, k));
          }
        }
      }

      for (k = n - 1; k >= 0; k--) {
        for (j = 0; j < count; j++) {
          X.set(k, j, X.get(k, j) / this.Rdiag[k]);
        }

        for (i = 0; i < k; i++) {
          for (j = 0; j < count; j++) {
            X.set(i, j, X.get(i, j) - X.get(k, j) * qr.get(i, k));
          }
        }
      }

      return X.subMatrix(0, n - 1, 0, count - 1);
    }
    /**
     *
     * @return {boolean}
     */


    isFullRank() {
      var columns = this.QR.columns;

      for (var i = 0; i < columns; i++) {
        if (this.Rdiag[i] === 0) {
          return false;
        }
      }

      return true;
    }
    /**
     *
     * @return {Matrix}
     */


    get upperTriangularMatrix() {
      var qr = this.QR;
      var n = qr.columns;
      var X = new Matrix(n, n);
      var i, j;

      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          if (i < j) {
            X.set(i, j, qr.get(i, j));
          } else if (i === j) {
            X.set(i, j, this.Rdiag[i]);
          } else {
            X.set(i, j, 0);
          }
        }
      }

      return X;
    }
    /**
     *
     * @return {Matrix}
     */


    get orthogonalMatrix() {
      var qr = this.QR;
      var rows = qr.rows;
      var columns = qr.columns;
      var X = new Matrix(rows, columns);
      var i, j, k, s;

      for (k = columns - 1; k >= 0; k--) {
        for (i = 0; i < rows; i++) {
          X.set(i, k, 0);
        }

        X.set(k, k, 1);

        for (j = k; j < columns; j++) {
          if (qr.get(k, k) !== 0) {
            s = 0;

            for (i = k; i < rows; i++) {
              s += qr.get(i, k) * X.get(i, j);
            }

            s = -s / qr[k][k];

            for (i = k; i < rows; i++) {
              X.set(i, j, X.get(i, j) + s * qr.get(i, k));
            }
          }
        }
      }

      return X;
    }

  }

  /**
   * @class SingularValueDecomposition
   * @see https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
   * @param {Matrix} value
   * @param {object} [options]
   * @param {boolean} [options.computeLeftSingularVectors=true]
   * @param {boolean} [options.computeRightSingularVectors=true]
   * @param {boolean} [options.autoTranspose=false]
   */

  class SingularValueDecomposition {
    constructor(value, options = {}) {
      value = WrapperMatrix2D.checkMatrix(value);
      var m = value.rows;
      var n = value.columns;
      const {
        computeLeftSingularVectors = true,
        computeRightSingularVectors = true,
        autoTranspose = false
      } = options;
      var wantu = Boolean(computeLeftSingularVectors);
      var wantv = Boolean(computeRightSingularVectors);
      var swapped = false;
      var a;

      if (m < n) {
        if (!autoTranspose) {
          a = value.clone(); // eslint-disable-next-line no-console

          console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
        } else {
          a = value.transpose();
          m = a.rows;
          n = a.columns;
          swapped = true;
          var aux = wantu;
          wantu = wantv;
          wantv = aux;
        }
      } else {
        a = value.clone();
      }

      var nu = Math.min(m, n);
      var ni = Math.min(m + 1, n);
      var s = new Array(ni);
      var U = new Matrix(m, nu);
      var V = new Matrix(n, n);
      var e = new Array(n);
      var work = new Array(m);
      var si = new Array(ni);

      for (let i = 0; i < ni; i++) si[i] = i;

      var nct = Math.min(m - 1, n);
      var nrt = Math.max(0, Math.min(n - 2, m));
      var mrc = Math.max(nct, nrt);

      for (let k = 0; k < mrc; k++) {
        if (k < nct) {
          s[k] = 0;

          for (let i = k; i < m; i++) {
            s[k] = hypotenuse(s[k], a.get(i, k));
          }

          if (s[k] !== 0) {
            if (a.get(k, k) < 0) {
              s[k] = -s[k];
            }

            for (let i = k; i < m; i++) {
              a.set(i, k, a.get(i, k) / s[k]);
            }

            a.set(k, k, a.get(k, k) + 1);
          }

          s[k] = -s[k];
        }

        for (let j = k + 1; j < n; j++) {
          if (k < nct && s[k] !== 0) {
            let t = 0;

            for (let i = k; i < m; i++) {
              t += a.get(i, k) * a.get(i, j);
            }

            t = -t / a.get(k, k);

            for (let i = k; i < m; i++) {
              a.set(i, j, a.get(i, j) + t * a.get(i, k));
            }
          }

          e[j] = a.get(k, j);
        }

        if (wantu && k < nct) {
          for (let i = k; i < m; i++) {
            U.set(i, k, a.get(i, k));
          }
        }

        if (k < nrt) {
          e[k] = 0;

          for (let i = k + 1; i < n; i++) {
            e[k] = hypotenuse(e[k], e[i]);
          }

          if (e[k] !== 0) {
            if (e[k + 1] < 0) {
              e[k] = 0 - e[k];
            }

            for (let i = k + 1; i < n; i++) {
              e[i] /= e[k];
            }

            e[k + 1] += 1;
          }

          e[k] = -e[k];

          if (k + 1 < m && e[k] !== 0) {
            for (let i = k + 1; i < m; i++) {
              work[i] = 0;
            }

            for (let i = k + 1; i < m; i++) {
              for (let j = k + 1; j < n; j++) {
                work[i] += e[j] * a.get(i, j);
              }
            }

            for (let j = k + 1; j < n; j++) {
              let t = -e[j] / e[k + 1];

              for (let i = k + 1; i < m; i++) {
                a.set(i, j, a.get(i, j) + t * work[i]);
              }
            }
          }

          if (wantv) {
            for (let i = k + 1; i < n; i++) {
              V.set(i, k, e[i]);
            }
          }
        }
      }

      let p = Math.min(n, m + 1);

      if (nct < n) {
        s[nct] = a.get(nct, nct);
      }

      if (m < p) {
        s[p - 1] = 0;
      }

      if (nrt + 1 < p) {
        e[nrt] = a.get(nrt, p - 1);
      }

      e[p - 1] = 0;

      if (wantu) {
        for (let j = nct; j < nu; j++) {
          for (let i = 0; i < m; i++) {
            U.set(i, j, 0);
          }

          U.set(j, j, 1);
        }

        for (let k = nct - 1; k >= 0; k--) {
          if (s[k] !== 0) {
            for (let j = k + 1; j < nu; j++) {
              let t = 0;

              for (let i = k; i < m; i++) {
                t += U.get(i, k) * U.get(i, j);
              }

              t = -t / U.get(k, k);

              for (let i = k; i < m; i++) {
                U.set(i, j, U.get(i, j) + t * U.get(i, k));
              }
            }

            for (let i = k; i < m; i++) {
              U.set(i, k, -U.get(i, k));
            }

            U.set(k, k, 1 + U.get(k, k));

            for (let i = 0; i < k - 1; i++) {
              U.set(i, k, 0);
            }
          } else {
            for (let i = 0; i < m; i++) {
              U.set(i, k, 0);
            }

            U.set(k, k, 1);
          }
        }
      }

      if (wantv) {
        for (let k = n - 1; k >= 0; k--) {
          if (k < nrt && e[k] !== 0) {
            for (let j = k + 1; j < n; j++) {
              let t = 0;

              for (let i = k + 1; i < n; i++) {
                t += V.get(i, k) * V.get(i, j);
              }

              t = -t / V.get(k + 1, k);

              for (let i = k + 1; i < n; i++) {
                V.set(i, j, V.get(i, j) + t * V.get(i, k));
              }
            }
          }

          for (let i = 0; i < n; i++) {
            V.set(i, k, 0);
          }

          V.set(k, k, 1);
        }
      }

      var pp = p - 1;
      var eps = Number.EPSILON;

      while (p > 0) {
        let k, kase;

        for (k = p - 2; k >= -1; k--) {
          if (k === -1) {
            break;
          }

          const alpha = Number.MIN_VALUE + eps * Math.abs(s[k] + Math.abs(s[k + 1]));

          if (Math.abs(e[k]) <= alpha || Number.isNaN(e[k])) {
            e[k] = 0;
            break;
          }
        }

        if (k === p - 2) {
          kase = 4;
        } else {
          let ks;

          for (ks = p - 1; ks >= k; ks--) {
            if (ks === k) {
              break;
            }

            let t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);

            if (Math.abs(s[ks]) <= eps * t) {
              s[ks] = 0;
              break;
            }
          }

          if (ks === k) {
            kase = 3;
          } else if (ks === p - 1) {
            kase = 1;
          } else {
            kase = 2;
            k = ks;
          }
        }

        k++;

        switch (kase) {
          case 1:
            {
              let f = e[p - 2];
              e[p - 2] = 0;

              for (let j = p - 2; j >= k; j--) {
                let t = hypotenuse(s[j], f);
                let cs = s[j] / t;
                let sn = f / t;
                s[j] = t;

                if (j !== k) {
                  f = -sn * e[j - 1];
                  e[j - 1] = cs * e[j - 1];
                }

                if (wantv) {
                  for (let i = 0; i < n; i++) {
                    t = cs * V.get(i, j) + sn * V.get(i, p - 1);
                    V.set(i, p - 1, -sn * V.get(i, j) + cs * V.get(i, p - 1));
                    V.set(i, j, t);
                  }
                }
              }

              break;
            }

          case 2:
            {
              let f = e[k - 1];
              e[k - 1] = 0;

              for (let j = k; j < p; j++) {
                let t = hypotenuse(s[j], f);
                let cs = s[j] / t;
                let sn = f / t;
                s[j] = t;
                f = -sn * e[j];
                e[j] = cs * e[j];

                if (wantu) {
                  for (let i = 0; i < m; i++) {
                    t = cs * U.get(i, j) + sn * U.get(i, k - 1);
                    U.set(i, k - 1, -sn * U.get(i, j) + cs * U.get(i, k - 1));
                    U.set(i, j, t);
                  }
                }
              }

              break;
            }

          case 3:
            {
              const scale = Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2]), Math.abs(e[p - 2]), Math.abs(s[k]), Math.abs(e[k]));
              const sp = s[p - 1] / scale;
              const spm1 = s[p - 2] / scale;
              const epm1 = e[p - 2] / scale;
              const sk = s[k] / scale;
              const ek = e[k] / scale;
              const b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
              const c = sp * epm1 * (sp * epm1);
              let shift = 0;

              if (b !== 0 || c !== 0) {
                if (b < 0) {
                  shift = 0 - Math.sqrt(b * b + c);
                } else {
                  shift = Math.sqrt(b * b + c);
                }

                shift = c / (b + shift);
              }

              let f = (sk + sp) * (sk - sp) + shift;
              let g = sk * ek;

              for (let j = k; j < p - 1; j++) {
                let t = hypotenuse(f, g);
                if (t === 0) t = Number.MIN_VALUE;
                let cs = f / t;
                let sn = g / t;

                if (j !== k) {
                  e[j - 1] = t;
                }

                f = cs * s[j] + sn * e[j];
                e[j] = cs * e[j] - sn * s[j];
                g = sn * s[j + 1];
                s[j + 1] = cs * s[j + 1];

                if (wantv) {
                  for (let i = 0; i < n; i++) {
                    t = cs * V.get(i, j) + sn * V.get(i, j + 1);
                    V.set(i, j + 1, -sn * V.get(i, j) + cs * V.get(i, j + 1));
                    V.set(i, j, t);
                  }
                }

                t = hypotenuse(f, g);
                if (t === 0) t = Number.MIN_VALUE;
                cs = f / t;
                sn = g / t;
                s[j] = t;
                f = cs * e[j] + sn * s[j + 1];
                s[j + 1] = -sn * e[j] + cs * s[j + 1];
                g = sn * e[j + 1];
                e[j + 1] = cs * e[j + 1];

                if (wantu && j < m - 1) {
                  for (let i = 0; i < m; i++) {
                    t = cs * U.get(i, j) + sn * U.get(i, j + 1);
                    U.set(i, j + 1, -sn * U.get(i, j) + cs * U.get(i, j + 1));
                    U.set(i, j, t);
                  }
                }
              }

              e[p - 2] = f;
              break;
            }

          case 4:
            {
              if (s[k] <= 0) {
                s[k] = s[k] < 0 ? -s[k] : 0;

                if (wantv) {
                  for (let i = 0; i <= pp; i++) {
                    V.set(i, k, -V.get(i, k));
                  }
                }
              }

              while (k < pp) {
                if (s[k] >= s[k + 1]) {
                  break;
                }

                let t = s[k];
                s[k] = s[k + 1];
                s[k + 1] = t;

                if (wantv && k < n - 1) {
                  for (let i = 0; i < n; i++) {
                    t = V.get(i, k + 1);
                    V.set(i, k + 1, V.get(i, k));
                    V.set(i, k, t);
                  }
                }

                if (wantu && k < m - 1) {
                  for (let i = 0; i < m; i++) {
                    t = U.get(i, k + 1);
                    U.set(i, k + 1, U.get(i, k));
                    U.set(i, k, t);
                  }
                }

                k++;
              }
              p--;
              break;
            }
          // no default
        }
      }

      if (swapped) {
        var tmp = V;
        V = U;
        U = tmp;
      }

      this.m = m;
      this.n = n;
      this.s = s;
      this.U = U;
      this.V = V;
    }
    /**
     * Solve a problem of least square (Ax=b) by using the SVD. Useful when A is singular. When A is not singular, it would be better to use qr.solve(value).
     * Example : We search to approximate x, with A matrix shape m*n, x vector size n, b vector size m (m > n). We will use :
     * var svd = SingularValueDecomposition(A);
     * var x = svd.solve(b);
     * @param {Matrix} value - Matrix 1D which is the vector b (in the equation Ax = b)
     * @return {Matrix} - The vector x
     */


    solve(value) {
      var Y = value;
      var e = this.threshold;
      var scols = this.s.length;
      var Ls = Matrix.zeros(scols, scols);

      for (let i = 0; i < scols; i++) {
        if (Math.abs(this.s[i]) <= e) {
          Ls.set(i, i, 0);
        } else {
          Ls.set(i, i, 1 / this.s[i]);
        }
      }

      var U = this.U;
      var V = this.rightSingularVectors;
      var VL = V.mmul(Ls);
      var vrows = V.rows;
      var urows = U.rows;
      var VLU = Matrix.zeros(vrows, urows);

      for (let i = 0; i < vrows; i++) {
        for (let j = 0; j < urows; j++) {
          let sum = 0;

          for (let k = 0; k < scols; k++) {
            sum += VL.get(i, k) * U.get(j, k);
          }

          VLU.set(i, j, sum);
        }
      }

      return VLU.mmul(Y);
    }
    /**
     *
     * @param {Array<number>} value
     * @return {Matrix}
     */


    solveForDiagonal(value) {
      return this.solve(Matrix.diag(value));
    }
    /**
     * Get the inverse of the matrix. We compute the inverse of a matrix using SVD when this matrix is singular or ill-conditioned. Example :
     * var svd = SingularValueDecomposition(A);
     * var inverseA = svd.inverse();
     * @return {Matrix} - The approximation of the inverse of the matrix
     */


    inverse() {
      var V = this.V;
      var e = this.threshold;
      var vrows = V.rows;
      var vcols = V.columns;
      var X = new Matrix(vrows, this.s.length);

      for (let i = 0; i < vrows; i++) {
        for (let j = 0; j < vcols; j++) {
          if (Math.abs(this.s[j]) > e) {
            X.set(i, j, V.get(i, j) / this.s[j]);
          }
        }
      }

      var U = this.U;
      var urows = U.rows;
      var ucols = U.columns;
      var Y = new Matrix(vrows, urows);

      for (let i = 0; i < vrows; i++) {
        for (let j = 0; j < urows; j++) {
          let sum = 0;

          for (let k = 0; k < ucols; k++) {
            sum += X.get(i, k) * U.get(j, k);
          }

          Y.set(i, j, sum);
        }
      }

      return Y;
    }
    /**
     *
     * @return {number}
     */


    get condition() {
      return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
    }
    /**
     *
     * @return {number}
     */


    get norm2() {
      return this.s[0];
    }
    /**
     *
     * @return {number}
     */


    get rank() {
      var tol = Math.max(this.m, this.n) * this.s[0] * Number.EPSILON;
      var r = 0;
      var s = this.s;

      for (var i = 0, ii = s.length; i < ii; i++) {
        if (s[i] > tol) {
          r++;
        }
      }

      return r;
    }
    /**
     *
     * @return {Array<number>}
     */


    get diagonal() {
      return this.s;
    }
    /**
     *
     * @return {number}
     */


    get threshold() {
      return Number.EPSILON / 2 * Math.max(this.m, this.n) * this.s[0];
    }
    /**
     *
     * @return {Matrix}
     */


    get leftSingularVectors() {
      return this.U;
    }
    /**
     *
     * @return {Matrix}
     */


    get rightSingularVectors() {
      return this.V;
    }
    /**
     *
     * @return {Matrix}
     */


    get diagonalMatrix() {
      return Matrix.diag(this.s);
    }

  }

  /**
   * Computes the inverse of a Matrix
   * @param {Matrix} matrix
   * @param {boolean} [useSVD=false]
   * @return {Matrix}
   */

  function inverse(matrix, useSVD = false) {
    matrix = WrapperMatrix2D.checkMatrix(matrix);

    if (useSVD) {
      return new SingularValueDecomposition(matrix).inverse();
    } else {
      return solve(matrix, Matrix.eye(matrix.rows));
    }
  }
  /**
   *
   * @param {Matrix} leftHandSide
   * @param {Matrix} rightHandSide
   * @param {boolean} [useSVD = false]
   * @return {Matrix}
   */

  function solve(leftHandSide, rightHandSide, useSVD = false) {
    leftHandSide = WrapperMatrix2D.checkMatrix(leftHandSide);
    rightHandSide = WrapperMatrix2D.checkMatrix(rightHandSide);

    if (useSVD) {
      return new SingularValueDecomposition(leftHandSide).solve(rightHandSide);
    } else {
      return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
    }
  }

  /**
   * Calculates and returns the determinant of a matrix.
   * @return {number}
   */

  function determinant(matrix) {
    matrix = Matrix.checkMatrix(matrix);

    if (matrix.isSquare()) {
      var a, b, c, d;

      if (matrix.columns === 2) {
        // 2 x 2 matrix
        a = matrix.get(0, 0);
        b = matrix.get(0, 1);
        c = matrix.get(1, 0);
        d = matrix.get(1, 1);
        return a * d - b * c;
      } else if (matrix.columns === 3) {
        // 3 x 3 matrix
        var subMatrix0, subMatrix1, subMatrix2;
        subMatrix0 = new MatrixSelectionView(matrix, [1, 2], [1, 2]);
        subMatrix1 = new MatrixSelectionView(matrix, [1, 2], [0, 2]);
        subMatrix2 = new MatrixSelectionView(matrix, [1, 2], [0, 1]);
        a = matrix.get(0, 0);
        b = matrix.get(0, 1);
        c = matrix.get(0, 2);
        return a * determinant(subMatrix0) - b * determinant(subMatrix1) + c * determinant(subMatrix2);
      } else {
        // general purpose determinant using the LU decomposition
        return new LuDecomposition(matrix).determinant;
      }
    } else {
      throw Error('determinant can only be calculated for a square matrix');
    }
  }

  function xrange(n, exception) {
    var range = [];

    for (var i = 0; i < n; i++) {
      if (i !== exception) {
        range.push(i);
      }
    }

    return range;
  } // function used by rowsDependencies


  function dependenciesOneRow(error, matrix, index, thresholdValue = 10e-10, thresholdError = 10e-10) {
    if (error > thresholdError) {
      return new Array(matrix.rows + 1).fill(0);
    } else {
      var returnArray = matrix.addRow(index, [0]);

      for (var i = 0; i < returnArray.rows; i++) {
        if (Math.abs(returnArray.get(i, 0)) < thresholdValue) {
          returnArray.set(i, 0, 0);
        }
      }

      return returnArray.to1DArray();
    }
  }
  /**
   * Creates a matrix which represents the dependencies between rows.
   * If a row is a linear combination of others rows, the result will be a row with the coefficients of this combination.
   * For example : for A = [[2, 0, 0, 1], [0, 1, 6, 0], [0, 3, 0, 1], [0, 0, 1, 0], [0, 1, 2, 0]], the result will be [[0, 0, 0, 0, 0], [0, 0, 0, 4, 1], [0, 0, 0, 0, 0], [0, 0.25, 0, 0, -0.25], [0, 1, 0, -4, 0]]
   * @param {Matrix} matrix
   * @param {Object} [options] includes thresholdValue and thresholdError.
   * @param {number} [options.thresholdValue = 10e-10] If an absolute value is inferior to this threshold, it will equals zero.
   * @param {number} [options.thresholdError = 10e-10] If the error is inferior to that threshold, the linear combination found is accepted and the row is dependent from other rows.
   * @return {Matrix} the matrix which represents the dependencies between rows.
   */


  function linearDependencies(matrix, options = {}) {
    const {
      thresholdValue = 10e-10,
      thresholdError = 10e-10
    } = options;
    matrix = Matrix.checkMatrix(matrix);
    var n = matrix.rows;
    var results = new Matrix(n, n);

    for (var i = 0; i < n; i++) {
      var b = Matrix.columnVector(matrix.getRow(i));
      var Abis = matrix.subMatrixRow(xrange(n, i)).transpose();
      var svd = new SingularValueDecomposition(Abis);
      var x = svd.solve(b);
      var error = Matrix.sub(b, Abis.mmul(x)).abs().max();
      results.setRow(i, dependenciesOneRow(error, x, i, thresholdValue, thresholdError));
    }

    return results;
  }

  /**
   * Returns inverse of a matrix if it exists or the pseudoinverse
   * @param {number} threshold - threshold for taking inverse of singular values (default = 1e-15)
   * @return {Matrix} the (pseudo)inverted matrix.
   */

  function pseudoInverse(matrix, threshold = Number.EPSILON) {
    matrix = Matrix.checkMatrix(matrix);
    var svdSolution = new SingularValueDecomposition(matrix, {
      autoTranspose: true
    });
    var U = svdSolution.leftSingularVectors;
    var V = svdSolution.rightSingularVectors;
    var s = svdSolution.diagonal;

    for (var i = 0; i < s.length; i++) {
      if (Math.abs(s[i]) > threshold) {
        s[i] = 1.0 / s[i];
      } else {
        s[i] = 0.0;
      }
    }

    return V.mmul(Matrix.diag(s).mmul(U.transpose()));
  }

  /**
   * @class EigenvalueDecomposition
   * @link https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
   * @param {Matrix} matrix
   * @param {object} [options]
   * @param {boolean} [options.assumeSymmetric=false]
   */

  class EigenvalueDecomposition {
    constructor(matrix, options = {}) {
      const {
        assumeSymmetric = false
      } = options;
      matrix = WrapperMatrix2D.checkMatrix(matrix);

      if (!matrix.isSquare()) {
        throw new Error('Matrix is not a square matrix');
      }

      var n = matrix.columns;
      var V = new Matrix(n, n);
      var d = new Array(n);
      var e = new Array(n);
      var value = matrix;
      var i, j;
      var isSymmetric = false;

      if (assumeSymmetric) {
        isSymmetric = true;
      } else {
        isSymmetric = matrix.isSymmetric();
      }

      if (isSymmetric) {
        for (i = 0; i < n; i++) {
          for (j = 0; j < n; j++) {
            V.set(i, j, value.get(i, j));
          }
        }

        tred2(n, e, d, V);
        tql2(n, e, d, V);
      } else {
        var H = new Matrix(n, n);
        var ort = new Array(n);

        for (j = 0; j < n; j++) {
          for (i = 0; i < n; i++) {
            H.set(i, j, value.get(i, j));
          }
        }

        orthes(n, H, ort, V);
        hqr2(n, e, d, V, H);
      }

      this.n = n;
      this.e = e;
      this.d = d;
      this.V = V;
    }
    /**
     *
     * @return {Array<number>}
     */


    get realEigenvalues() {
      return this.d;
    }
    /**
     *
     * @return {Array<number>}
     */


    get imaginaryEigenvalues() {
      return this.e;
    }
    /**
     *
     * @return {Matrix}
     */


    get eigenvectorMatrix() {
      return this.V;
    }
    /**
     *
     * @return {Matrix}
     */


    get diagonalMatrix() {
      var n = this.n;
      var e = this.e;
      var d = this.d;
      var X = new Matrix(n, n);
      var i, j;

      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          X.set(i, j, 0);
        }

        X.set(i, i, d[i]);

        if (e[i] > 0) {
          X.set(i, i + 1, e[i]);
        } else if (e[i] < 0) {
          X.set(i, i - 1, e[i]);
        }
      }

      return X;
    }

  }

  function tred2(n, e, d, V) {
    var f, g, h, i, j, k, hh, scale;

    for (j = 0; j < n; j++) {
      d[j] = V.get(n - 1, j);
    }

    for (i = n - 1; i > 0; i--) {
      scale = 0;
      h = 0;

      for (k = 0; k < i; k++) {
        scale = scale + Math.abs(d[k]);
      }

      if (scale === 0) {
        e[i] = d[i - 1];

        for (j = 0; j < i; j++) {
          d[j] = V.get(i - 1, j);
          V.set(i, j, 0);
          V.set(j, i, 0);
        }
      } else {
        for (k = 0; k < i; k++) {
          d[k] /= scale;
          h += d[k] * d[k];
        }

        f = d[i - 1];
        g = Math.sqrt(h);

        if (f > 0) {
          g = -g;
        }

        e[i] = scale * g;
        h = h - f * g;
        d[i - 1] = f - g;

        for (j = 0; j < i; j++) {
          e[j] = 0;
        }

        for (j = 0; j < i; j++) {
          f = d[j];
          V.set(j, i, f);
          g = e[j] + V.get(j, j) * f;

          for (k = j + 1; k <= i - 1; k++) {
            g += V.get(k, j) * d[k];
            e[k] += V.get(k, j) * f;
          }

          e[j] = g;
        }

        f = 0;

        for (j = 0; j < i; j++) {
          e[j] /= h;
          f += e[j] * d[j];
        }

        hh = f / (h + h);

        for (j = 0; j < i; j++) {
          e[j] -= hh * d[j];
        }

        for (j = 0; j < i; j++) {
          f = d[j];
          g = e[j];

          for (k = j; k <= i - 1; k++) {
            V.set(k, j, V.get(k, j) - (f * e[k] + g * d[k]));
          }

          d[j] = V.get(i - 1, j);
          V.set(i, j, 0);
        }
      }

      d[i] = h;
    }

    for (i = 0; i < n - 1; i++) {
      V.set(n - 1, i, V.get(i, i));
      V.set(i, i, 1);
      h = d[i + 1];

      if (h !== 0) {
        for (k = 0; k <= i; k++) {
          d[k] = V.get(k, i + 1) / h;
        }

        for (j = 0; j <= i; j++) {
          g = 0;

          for (k = 0; k <= i; k++) {
            g += V.get(k, i + 1) * V.get(k, j);
          }

          for (k = 0; k <= i; k++) {
            V.set(k, j, V.get(k, j) - g * d[k]);
          }
        }
      }

      for (k = 0; k <= i; k++) {
        V.set(k, i + 1, 0);
      }
    }

    for (j = 0; j < n; j++) {
      d[j] = V.get(n - 1, j);
      V.set(n - 1, j, 0);
    }

    V.set(n - 1, n - 1, 1);
    e[0] = 0;
  }

  function tql2(n, e, d, V) {
    var g, h, i, j, k, l, m, p, r, dl1, c, c2, c3, el1, s, s2;

    for (i = 1; i < n; i++) {
      e[i - 1] = e[i];
    }

    e[n - 1] = 0;
    var f = 0;
    var tst1 = 0;
    var eps = Number.EPSILON;

    for (l = 0; l < n; l++) {
      tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
      m = l;

      while (m < n) {
        if (Math.abs(e[m]) <= eps * tst1) {
          break;
        }

        m++;
      }

      if (m > l) {

        do {
          g = d[l];
          p = (d[l + 1] - g) / (2 * e[l]);
          r = hypotenuse(p, 1);

          if (p < 0) {
            r = -r;
          }

          d[l] = e[l] / (p + r);
          d[l + 1] = e[l] * (p + r);
          dl1 = d[l + 1];
          h = g - d[l];

          for (i = l + 2; i < n; i++) {
            d[i] -= h;
          }

          f = f + h;
          p = d[m];
          c = 1;
          c2 = c;
          c3 = c;
          el1 = e[l + 1];
          s = 0;
          s2 = 0;

          for (i = m - 1; i >= l; i--) {
            c3 = c2;
            c2 = c;
            s2 = s;
            g = c * e[i];
            h = c * p;
            r = hypotenuse(p, e[i]);
            e[i + 1] = s * r;
            s = e[i] / r;
            c = p / r;
            p = c * d[i] - s * g;
            d[i + 1] = h + s * (c * g + s * d[i]);

            for (k = 0; k < n; k++) {
              h = V.get(k, i + 1);
              V.set(k, i + 1, s * V.get(k, i) + c * h);
              V.set(k, i, c * V.get(k, i) - s * h);
            }
          }

          p = -s * s2 * c3 * el1 * e[l] / dl1;
          e[l] = s * p;
          d[l] = c * p;
        } while (Math.abs(e[l]) > eps * tst1);
      }

      d[l] = d[l] + f;
      e[l] = 0;
    }

    for (i = 0; i < n - 1; i++) {
      k = i;
      p = d[i];

      for (j = i + 1; j < n; j++) {
        if (d[j] < p) {
          k = j;
          p = d[j];
        }
      }

      if (k !== i) {
        d[k] = d[i];
        d[i] = p;

        for (j = 0; j < n; j++) {
          p = V.get(j, i);
          V.set(j, i, V.get(j, k));
          V.set(j, k, p);
        }
      }
    }
  }

  function orthes(n, H, ort, V) {
    var low = 0;
    var high = n - 1;
    var f, g, h, i, j, m;
    var scale;

    for (m = low + 1; m <= high - 1; m++) {
      scale = 0;

      for (i = m; i <= high; i++) {
        scale = scale + Math.abs(H.get(i, m - 1));
      }

      if (scale !== 0) {
        h = 0;

        for (i = high; i >= m; i--) {
          ort[i] = H.get(i, m - 1) / scale;
          h += ort[i] * ort[i];
        }

        g = Math.sqrt(h);

        if (ort[m] > 0) {
          g = -g;
        }

        h = h - ort[m] * g;
        ort[m] = ort[m] - g;

        for (j = m; j < n; j++) {
          f = 0;

          for (i = high; i >= m; i--) {
            f += ort[i] * H.get(i, j);
          }

          f = f / h;

          for (i = m; i <= high; i++) {
            H.set(i, j, H.get(i, j) - f * ort[i]);
          }
        }

        for (i = 0; i <= high; i++) {
          f = 0;

          for (j = high; j >= m; j--) {
            f += ort[j] * H.get(i, j);
          }

          f = f / h;

          for (j = m; j <= high; j++) {
            H.set(i, j, H.get(i, j) - f * ort[j]);
          }
        }

        ort[m] = scale * ort[m];
        H.set(m, m - 1, scale * g);
      }
    }

    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        V.set(i, j, i === j ? 1 : 0);
      }
    }

    for (m = high - 1; m >= low + 1; m--) {
      if (H.get(m, m - 1) !== 0) {
        for (i = m + 1; i <= high; i++) {
          ort[i] = H.get(i, m - 1);
        }

        for (j = m; j <= high; j++) {
          g = 0;

          for (i = m; i <= high; i++) {
            g += ort[i] * V.get(i, j);
          }

          g = g / ort[m] / H.get(m, m - 1);

          for (i = m; i <= high; i++) {
            V.set(i, j, V.get(i, j) + g * ort[i]);
          }
        }
      }
    }
  }

  function hqr2(nn, e, d, V, H) {
    var n = nn - 1;
    var low = 0;
    var high = nn - 1;
    var eps = Number.EPSILON;
    var exshift = 0;
    var norm = 0;
    var p = 0;
    var q = 0;
    var r = 0;
    var s = 0;
    var z = 0;
    var iter = 0;
    var i, j, k, l, m, t, w, x, y;
    var ra, sa, vr, vi;
    var notlast, cdivres;

    for (i = 0; i < nn; i++) {
      if (i < low || i > high) {
        d[i] = H.get(i, i);
        e[i] = 0;
      }

      for (j = Math.max(i - 1, 0); j < nn; j++) {
        norm = norm + Math.abs(H.get(i, j));
      }
    }

    while (n >= low) {
      l = n;

      while (l > low) {
        s = Math.abs(H.get(l - 1, l - 1)) + Math.abs(H.get(l, l));

        if (s === 0) {
          s = norm;
        }

        if (Math.abs(H.get(l, l - 1)) < eps * s) {
          break;
        }

        l--;
      }

      if (l === n) {
        H.set(n, n, H.get(n, n) + exshift);
        d[n] = H.get(n, n);
        e[n] = 0;
        n--;
        iter = 0;
      } else if (l === n - 1) {
        w = H.get(n, n - 1) * H.get(n - 1, n);
        p = (H.get(n - 1, n - 1) - H.get(n, n)) / 2;
        q = p * p + w;
        z = Math.sqrt(Math.abs(q));
        H.set(n, n, H.get(n, n) + exshift);
        H.set(n - 1, n - 1, H.get(n - 1, n - 1) + exshift);
        x = H.get(n, n);

        if (q >= 0) {
          z = p >= 0 ? p + z : p - z;
          d[n - 1] = x + z;
          d[n] = d[n - 1];

          if (z !== 0) {
            d[n] = x - w / z;
          }

          e[n - 1] = 0;
          e[n] = 0;
          x = H.get(n, n - 1);
          s = Math.abs(x) + Math.abs(z);
          p = x / s;
          q = z / s;
          r = Math.sqrt(p * p + q * q);
          p = p / r;
          q = q / r;

          for (j = n - 1; j < nn; j++) {
            z = H.get(n - 1, j);
            H.set(n - 1, j, q * z + p * H.get(n, j));
            H.set(n, j, q * H.get(n, j) - p * z);
          }

          for (i = 0; i <= n; i++) {
            z = H.get(i, n - 1);
            H.set(i, n - 1, q * z + p * H.get(i, n));
            H.set(i, n, q * H.get(i, n) - p * z);
          }

          for (i = low; i <= high; i++) {
            z = V.get(i, n - 1);
            V.set(i, n - 1, q * z + p * V.get(i, n));
            V.set(i, n, q * V.get(i, n) - p * z);
          }
        } else {
          d[n - 1] = x + p;
          d[n] = x + p;
          e[n - 1] = z;
          e[n] = -z;
        }

        n = n - 2;
        iter = 0;
      } else {
        x = H.get(n, n);
        y = 0;
        w = 0;

        if (l < n) {
          y = H.get(n - 1, n - 1);
          w = H.get(n, n - 1) * H.get(n - 1, n);
        }

        if (iter === 10) {
          exshift += x;

          for (i = low; i <= n; i++) {
            H.set(i, i, H.get(i, i) - x);
          }

          s = Math.abs(H.get(n, n - 1)) + Math.abs(H.get(n - 1, n - 2));
          x = y = 0.75 * s;
          w = -0.4375 * s * s;
        }

        if (iter === 30) {
          s = (y - x) / 2;
          s = s * s + w;

          if (s > 0) {
            s = Math.sqrt(s);

            if (y < x) {
              s = -s;
            }

            s = x - w / ((y - x) / 2 + s);

            for (i = low; i <= n; i++) {
              H.set(i, i, H.get(i, i) - s);
            }

            exshift += s;
            x = y = w = 0.964;
          }
        }

        iter = iter + 1;
        m = n - 2;

        while (m >= l) {
          z = H.get(m, m);
          r = x - z;
          s = y - z;
          p = (r * s - w) / H.get(m + 1, m) + H.get(m, m + 1);
          q = H.get(m + 1, m + 1) - z - r - s;
          r = H.get(m + 2, m + 1);
          s = Math.abs(p) + Math.abs(q) + Math.abs(r);
          p = p / s;
          q = q / s;
          r = r / s;

          if (m === l) {
            break;
          }

          if (Math.abs(H.get(m, m - 1)) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H.get(m - 1, m - 1)) + Math.abs(z) + Math.abs(H.get(m + 1, m + 1))))) {
            break;
          }

          m--;
        }

        for (i = m + 2; i <= n; i++) {
          H.set(i, i - 2, 0);

          if (i > m + 2) {
            H.set(i, i - 3, 0);
          }
        }

        for (k = m; k <= n - 1; k++) {
          notlast = k !== n - 1;

          if (k !== m) {
            p = H.get(k, k - 1);
            q = H.get(k + 1, k - 1);
            r = notlast ? H.get(k + 2, k - 1) : 0;
            x = Math.abs(p) + Math.abs(q) + Math.abs(r);

            if (x !== 0) {
              p = p / x;
              q = q / x;
              r = r / x;
            }
          }

          if (x === 0) {
            break;
          }

          s = Math.sqrt(p * p + q * q + r * r);

          if (p < 0) {
            s = -s;
          }

          if (s !== 0) {
            if (k !== m) {
              H.set(k, k - 1, -s * x);
            } else if (l !== m) {
              H.set(k, k - 1, -H.get(k, k - 1));
            }

            p = p + s;
            x = p / s;
            y = q / s;
            z = r / s;
            q = q / p;
            r = r / p;

            for (j = k; j < nn; j++) {
              p = H.get(k, j) + q * H.get(k + 1, j);

              if (notlast) {
                p = p + r * H.get(k + 2, j);
                H.set(k + 2, j, H.get(k + 2, j) - p * z);
              }

              H.set(k, j, H.get(k, j) - p * x);
              H.set(k + 1, j, H.get(k + 1, j) - p * y);
            }

            for (i = 0; i <= Math.min(n, k + 3); i++) {
              p = x * H.get(i, k) + y * H.get(i, k + 1);

              if (notlast) {
                p = p + z * H.get(i, k + 2);
                H.set(i, k + 2, H.get(i, k + 2) - p * r);
              }

              H.set(i, k, H.get(i, k) - p);
              H.set(i, k + 1, H.get(i, k + 1) - p * q);
            }

            for (i = low; i <= high; i++) {
              p = x * V.get(i, k) + y * V.get(i, k + 1);

              if (notlast) {
                p = p + z * V.get(i, k + 2);
                V.set(i, k + 2, V.get(i, k + 2) - p * r);
              }

              V.set(i, k, V.get(i, k) - p);
              V.set(i, k + 1, V.get(i, k + 1) - p * q);
            }
          }
        }
      }
    }

    if (norm === 0) {
      return;
    }

    for (n = nn - 1; n >= 0; n--) {
      p = d[n];
      q = e[n];

      if (q === 0) {
        l = n;
        H.set(n, n, 1);

        for (i = n - 1; i >= 0; i--) {
          w = H.get(i, i) - p;
          r = 0;

          for (j = l; j <= n; j++) {
            r = r + H.get(i, j) * H.get(j, n);
          }

          if (e[i] < 0) {
            z = w;
            s = r;
          } else {
            l = i;

            if (e[i] === 0) {
              H.set(i, n, w !== 0 ? -r / w : -r / (eps * norm));
            } else {
              x = H.get(i, i + 1);
              y = H.get(i + 1, i);
              q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
              t = (x * s - z * r) / q;
              H.set(i, n, t);
              H.set(i + 1, n, Math.abs(x) > Math.abs(z) ? (-r - w * t) / x : (-s - y * t) / z);
            }

            t = Math.abs(H.get(i, n));

            if (eps * t * t > 1) {
              for (j = i; j <= n; j++) {
                H.set(j, n, H.get(j, n) / t);
              }
            }
          }
        }
      } else if (q < 0) {
        l = n - 1;

        if (Math.abs(H.get(n, n - 1)) > Math.abs(H.get(n - 1, n))) {
          H.set(n - 1, n - 1, q / H.get(n, n - 1));
          H.set(n - 1, n, -(H.get(n, n) - p) / H.get(n, n - 1));
        } else {
          cdivres = cdiv(0, -H.get(n - 1, n), H.get(n - 1, n - 1) - p, q);
          H.set(n - 1, n - 1, cdivres[0]);
          H.set(n - 1, n, cdivres[1]);
        }

        H.set(n, n - 1, 0);
        H.set(n, n, 1);

        for (i = n - 2; i >= 0; i--) {
          ra = 0;
          sa = 0;

          for (j = l; j <= n; j++) {
            ra = ra + H.get(i, j) * H.get(j, n - 1);
            sa = sa + H.get(i, j) * H.get(j, n);
          }

          w = H.get(i, i) - p;

          if (e[i] < 0) {
            z = w;
            r = ra;
            s = sa;
          } else {
            l = i;

            if (e[i] === 0) {
              cdivres = cdiv(-ra, -sa, w, q);
              H.set(i, n - 1, cdivres[0]);
              H.set(i, n, cdivres[1]);
            } else {
              x = H.get(i, i + 1);
              y = H.get(i + 1, i);
              vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
              vi = (d[i] - p) * 2 * q;

              if (vr === 0 && vi === 0) {
                vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
              }

              cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
              H.set(i, n - 1, cdivres[0]);
              H.set(i, n, cdivres[1]);

              if (Math.abs(x) > Math.abs(z) + Math.abs(q)) {
                H.set(i + 1, n - 1, (-ra - w * H.get(i, n - 1) + q * H.get(i, n)) / x);
                H.set(i + 1, n, (-sa - w * H.get(i, n) - q * H.get(i, n - 1)) / x);
              } else {
                cdivres = cdiv(-r - y * H.get(i, n - 1), -s - y * H.get(i, n), z, q);
                H.set(i + 1, n - 1, cdivres[0]);
                H.set(i + 1, n, cdivres[1]);
              }
            }

            t = Math.max(Math.abs(H.get(i, n - 1)), Math.abs(H.get(i, n)));

            if (eps * t * t > 1) {
              for (j = i; j <= n; j++) {
                H.set(j, n - 1, H.get(j, n - 1) / t);
                H.set(j, n, H.get(j, n) / t);
              }
            }
          }
        }
      }
    }

    for (i = 0; i < nn; i++) {
      if (i < low || i > high) {
        for (j = i; j < nn; j++) {
          V.set(i, j, H.get(i, j));
        }
      }
    }

    for (j = nn - 1; j >= low; j--) {
      for (i = low; i <= high; i++) {
        z = 0;

        for (k = low; k <= Math.min(j, high); k++) {
          z = z + V.get(i, k) * H.get(k, j);
        }

        V.set(i, j, z);
      }
    }
  }

  function cdiv(xr, xi, yr, yi) {
    var r, d;

    if (Math.abs(yr) > Math.abs(yi)) {
      r = yi / yr;
      d = yr + r * yi;
      return [(xr + r * xi) / d, (xi - r * xr) / d];
    } else {
      r = yr / yi;
      d = yi + r * yr;
      return [(r * xr + xi) / d, (r * xi - xr) / d];
    }
  }

  /**
   * @class CholeskyDecomposition
   * @link https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
   * @param {Matrix} value
   */

  class CholeskyDecomposition {
    constructor(value) {
      value = WrapperMatrix2D.checkMatrix(value);

      if (!value.isSymmetric()) {
        throw new Error('Matrix is not symmetric');
      }

      var a = value;
      var dimension = a.rows;
      var l = new Matrix(dimension, dimension);
      var positiveDefinite = true;
      var i, j, k;

      for (j = 0; j < dimension; j++) {
        var d = 0;

        for (k = 0; k < j; k++) {
          var s = 0;

          for (i = 0; i < k; i++) {
            s += l.get(k, i) * l.get(j, i);
          }

          s = (a.get(j, k) - s) / l.get(k, k);
          l.set(j, k, s);
          d = d + s * s;
        }

        d = a.get(j, j) - d;
        positiveDefinite &= d > 0;
        l.set(j, j, Math.sqrt(Math.max(d, 0)));

        for (k = j + 1; k < dimension; k++) {
          l.set(j, k, 0);
        }
      }

      if (!positiveDefinite) {
        throw new Error('Matrix is not positive definite');
      }

      this.L = l;
    }
    /**
     *
     * @param {Matrix} value
     * @return {Matrix}
     */


    solve(value) {
      value = WrapperMatrix2D.checkMatrix(value);
      var l = this.L;
      var dimension = l.rows;

      if (value.rows !== dimension) {
        throw new Error('Matrix dimensions do not match');
      }

      var count = value.columns;
      var B = value.clone();
      var i, j, k;

      for (k = 0; k < dimension; k++) {
        for (j = 0; j < count; j++) {
          for (i = 0; i < k; i++) {
            B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(k, i));
          }

          B.set(k, j, B.get(k, j) / l.get(k, k));
        }
      }

      for (k = dimension - 1; k >= 0; k--) {
        for (j = 0; j < count; j++) {
          for (i = k + 1; i < dimension; i++) {
            B.set(k, j, B.get(k, j) - B.get(i, j) * l.get(i, k));
          }

          B.set(k, j, B.get(k, j) / l.get(k, k));
        }
      }

      return B;
    }
    /**
     *
     * @return {Matrix}
     */


    get lowerTriangularMatrix() {
      return this.L;
    }

  }

  exports.AbstractMatrix = AbstractMatrix;
  exports.CHO = CholeskyDecomposition;
  exports.CholeskyDecomposition = CholeskyDecomposition;
  exports.EVD = EigenvalueDecomposition;
  exports.EigenvalueDecomposition = EigenvalueDecomposition;
  exports.LU = LuDecomposition;
  exports.LuDecomposition = LuDecomposition;
  exports.Matrix = Matrix;
  exports.MatrixColumnSelectionView = MatrixColumnSelectionView;
  exports.MatrixColumnView = MatrixColumnView;
  exports.MatrixFlipColumnView = MatrixFlipColumnView;
  exports.MatrixFlipRowView = MatrixFlipRowView;
  exports.MatrixRowSelectionView = MatrixRowSelectionView;
  exports.MatrixRowView = MatrixRowView;
  exports.MatrixSelectionView = MatrixSelectionView;
  exports.MatrixSubView = MatrixSubView;
  exports.MatrixTransposeView = MatrixTransposeView;
  exports.QR = QrDecomposition;
  exports.QrDecomposition = QrDecomposition;
  exports.SVD = SingularValueDecomposition;
  exports.SingularValueDecomposition = SingularValueDecomposition;
  exports.WrapperMatrix1D = WrapperMatrix1D;
  exports.WrapperMatrix2D = WrapperMatrix2D;
  exports.default = Matrix;
  exports.determinant = determinant;
  exports.inverse = inverse;
  exports.linearDependencies = linearDependencies;
  exports.pseudoInverse = pseudoInverse;
  exports.solve = solve;
  exports.wrap = wrap;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
