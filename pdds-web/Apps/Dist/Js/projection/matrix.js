/**
 * Created by wangtao on 2017/10/17.
 */

var matrix = {};

var ERROR_MATRIX_NOT_SQUARE = 'Matrix must be square.',
    ERROR_VECTOR_NOT_2D = 'Only two dimensional operations are supported at this time.';

/**
 * Return a deep copy of the input matrix.
 *
 * @param {Array} matrix to copy.
 * @return {Array} copied matrix.
 */
matrix.deepCopy = function (arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Input must be a matrix.');
    } else if (arr[0][0] === undefined) {
        throw new Error('Input cannot be a vector.');
    }
    var result = new Array(arr.length);

    for (var i = 0; i < arr.length; i++) {
        result[i] = arr[i].slice();
    }

    return result;
};

/**
 * Return true if matrix is square, false otherwise.
 *
 * @param {Array} arr
 * @return {Boolean}
 */
matrix.isSquare = function (arr) {
    if (!Array.isArray(arr)) {
        throw new Error('Input must be a matrix.');
    } else if (arr[0][0] === undefined) {
        throw new Error('Input cannot be a vector.');
    }
    var rows = arr.length;

    for (var i = 0; i < rows; i++) {
        if (arr[i].length !== rows) return false;
    }

    return true;
};

/**
 * Add two matrices together.  Matrices must be of same dimension.
 *
 * @param {Array} matrix A.
 * @param {Array} matrix B.
 * @return {Array} summed matrix.
 */
matrix.addition = function (arrA, arrB) {
    if (arrA.length !== arrB.length || arrA[0].length !== arrB[0].length) {
        throw new Error('Matrix mismatch');
    }

    var result = new Array(arrA.length),
        i;

    if (!arrA[0].length) {
        // The arrays are vectors.
        for (i = 0; i < arrA.length; i++) {
            result[i] = arrA[i] + arrB[i];
        }
    } else {
        for (i = 0; i < arrA.length; i++) {
            result[i] = new Array(arrA[i].length);

            for (var j = 0; j < arrA[i].length; j++) {
                result[i][j] = arrA[i][j] + arrB[i][j];
            }
        }
    }

    return result;
};

/**
 * Subtract one matrix from another (A - B).  Matrices must be of same dimension.
 *
 * @param {Array} matrix A.
 * @param {Array} matrix B.
 * @return {Array} subtracted matrix.
 */
matrix.subtraction = function (arrA, arrB) {
    if (arrA.length !== arrB.length || arrA[0].length !== arrB[0].length) {
        throw new Error("Matrix mismatch");
    }

    var result = new Array(arrA.length),
        i;

    if (!arrA[0].length) {
        // The arrays are vectors.
        for (i = 0; i < arrA.length; i++) {
            result[i] = arrA[i] - arrB[i];
        }
    } else {
        for (i = 0; i < arrA.length; i++) {
            result[i] = new Array(arrA[i].length);

            for (var j = 0; j < arrA[i].length; j++) {
                result[i][j] = arrA[i][j] - arrB[i][j];
            }
        }
    }

    return result;
};

/**
 * Scalar multiplication on an matrix.
 *
 * @param {Array} matrix.
 * @param {Number} scalar.
 * @return {Array} updated matrix.
 */
matrix.scalar = function (arr, val) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            arr[i][j] = val * arr[i][j];
        }
    }

    return arr;
};

/**
 * Transpose a matrix.
 *
 * @param {Array} matrix.
 * @return {Array} transposed matrix.
 */
matrix.transpose = function (arr) {
    var result = new Array(arr[0].length);

    for (var i = 0; i < arr[0].length; i++) {
        result[i] = new Array(arr.length);

        for (var j = 0; j < arr.length; j++) {
            result[i][j] = arr[j][i];
        }
    }

    return result;
};

/**
 * Create an identity matrix of dimension n x n.
 *
 * @param {Number} dimension of the identity array to be returned.
 * @return {Array} n x n identity matrix.
 */
matrix.identity = function (n) {
    var result = new Array(n);

    for (var i = 0; i < n; i++) {
        result[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            result[i][j] = (i === j) ? 1 : 0;
        }
    }

    return result;
};

/**
 * Evaluate dot product of two vectors.  Vectors must be of same length.
 *
 * @param {Array} vector.
 * @param {Array} vector.
 * @return {Array} dot product.
 */
matrix.dotproduct = function (vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
        throw new Error("Vector mismatch");
    }

    var result = 0;
    for (var i = 0; i < vectorA.length; i++) {
        result += vectorA[i] * vectorB[i];
    }
    return result;
};

/**
 * Multiply two matrices. They must abide by standard matching.
 *
 * e.g. A x B = (m x n) x (n x m), where n, m are integers who define
 * the dimensions of matrices A, B.
 *
 * @param {Array} matrix.
 * @param {Array} matrix.
 * @return {Array} result of multiplied matrices.
 */
matrix.multiply = function (arrA, arrB) {
    if (arrA[0].length !== arrB.length) {
        throw new Error("Matrix mismatch");
    }

    var result = new Array(arrA.length);

    for (var x = 0; x < arrA.length; x++) {
        result[x] = new Array(arrB[0].length);
    }

    var arrB_T = matrix.transpose(arrB);

    for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < result[i].length; j++) {
            result[i][j] = matrix.dotproduct(arrA[i], arrB_T[j]);
        }
    }
    return result;
};

/**
 * Gauss-Jordan Elimination
 *
 * @param {Array} matrix.
 * @param {Number} epsilon.
 * @return {Array} RREF matrix.
 */
matrix.GaussJordanEliminate = function (m, epsilon) {
    // Translated from:
    // http://elonen.iki.fi/code/misc-notes/python-gaussj/index.html
    var eps = (typeof epsilon === 'undefined') ? 1e-10 : epsilon;

    var h = m.length;
    var w = m[0].length;
    var y = -1;
    var y2, x, c;

    while (++y < h) {
        // Pivot.
        var maxrow = y;
        y2 = y;
        while (++y2 < h) {
            if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y]))
                maxrow = y2;
        }
        var tmp = m[y];
        m[y] = m[maxrow];
        m[maxrow] = tmp;

        // Singular
        if (Math.abs(m[y][y]) <= eps) {
            return m;
        }

        // Eliminate column
        y2 = y;
        while (++y2 < h) {
            c = m[y2][y] / m[y][y];
            x = y - 1;
            while (++x < w) {
                m[y2][x] -= m[y][x] * c;
            }
        }
    }

    // Backsubstitute.
    y = h;
    while (--y >= 0) {
        c = m[y][y];
        y2 = -1;
        while (++y2 < y) {
            x = w;
            while (--x >= y) {
                m[y2][x] -= m[y][x] * m[y2][y] / c;
            }
        }
        m[y][y] /= c;

        // Normalize row
        x = h - 1;
        while (++x < w) {
            m[y][x] /= c;
        }
    }

    return m;
};

/**
 * nxn matrix inversion
 *
 * @param {Array} matrix.
 * @return {Array} inverted matrix.
 */
matrix.inverse = function (m) {
    if (!matrix.isSquare(m)) {
        throw new Error(ERROR_MATRIX_NOT_SQUARE);
    }

    var n = m.length,
        identity = matrix.identity(n),
        i;

    // AI
    for (i = 0; i < n; i++) {
        m[i] = m[i].concat(identity[i]);
    }

    // inv(IA)
    m = matrix.GaussJordanEliminate(m);

    // inv(A)
    for (i = 0; i < n; i++) {
        m[i] = m[i].slice(n);
    }

    return m;
};

matrix.addCols = function(M,c){
    let res = matrix.deepCopy(M);
    let n = res.length;
    if(c.length!=n)  return false;
    for (let i = 0; i < n; i++) {
        // var col = matrix.getCol(res, i);
        col = res[i];
        col.push(...c[i]);
        res[i] = col;
    }
    return res;
};
