;;(function(iD, jsep) {

    jsep.addBinaryOp('OR', 1);
    jsep.addBinaryOp('AND', 2);
    jsep.addBinaryOp('=', 6);
    jsep.addBinaryOp('*=', 7);
    jsep.addBinaryOp('^=', 7);
    jsep.addBinaryOp('$=', 7);

    //jsep.addUnaryOp('NOT');

    var falseFilter = function() {
        return false;
    };

    iD.ui.RoadFilterExpParser = function() {

    };

    _.assign(iD.ui.RoadFilterExpParser.prototype, {

        parseExp: function(exp, modelList) {
            var error = null,
                filter = null;

            exp = exp || '';

            exp = exp.trim();

            if (!exp) {
                return {
                    filter: falseFilter,
                    error: null
                }
            }

            try {
                filter = this.getFilter(jsep(exp));

            } catch (e) {
                error = e;
                //console.warn(error);
            }

            return {
                filter: filter,
                error: error
            };
        },
        getFilter: function(tree, opts) {

            if (!tree) {
                return falseFilter;
            }

            var self = this,
                tmpVal;

            return function(obj) {

                switch (tree.type) {

                    case 'Literal':
                        return tree.value;

                    case 'Identifier':
                        tmpVal = obj[tree.name];
//                      return tmpVal !== undefined ? tmpVal : '';
                        return tmpVal !== undefined ? tmpVal : (tree.name || '');

                    case 'UnaryExpression':
                        return self.evalUnaryExpVal(tree, obj, opts);

                    case 'BinaryExpression':
                        return self.evalBinaryExpVal(tree, obj, opts);

                    case 'LogicalExpression':
                        return self.evalLogicalExpVal(tree, obj, opts);

                    case 'CallExpression':
                    case 'Compound':
                        return false;

                    default:
                        console.error('Unknown tree type', tree);
                        break;
                }

                return false;
            }
        },
        evalLogicalExpVal: function(tree, obj, opts) {

            var leftVal = this.getFilter(tree.left, _.assign({}, opts, {
                    left: true,
                    right: false
                }))(obj),
                rightVal = this.getFilter(tree.right, _.assign({}, opts, {
                    left: false,
                    right: true
                }))(obj);

            switch (tree.operator) {
                case '&&':
                case 'AND':
                    return leftVal && rightVal;

                case '||':
                case 'OR':
                    return leftVal || rightVal;

                default:
                    console.error('Unknown Logical operator', tree);
                    break;
            }

            return false;
        },
        evalBinaryExpVal: function(tree, obj, opts) {

            var leftVal = this.getFilter(tree.left, _.assign({}, opts, {
                    left: true,
                    right: false
                }))(obj),
                rightVal = this.getFilter(tree.right, _.assign({}, opts, {
                    left: false,
                    right: true
                }))(obj);

            var tmpStrL = ('' + (leftVal || '')).toLowerCase(),
                tmpStrR = ('' + (rightVal || '')).toLowerCase();

            if (leftVal === undefined && rightVal === undefined) {
                return false;
            }

            switch (tree.operator) {
                case 'AND':
                case 'OR':
                    return this.evalLogicalExpVal(tree, obj);

                case '=':
                case '==':
                    return leftVal == rightVal;

                case '!=':
                    return leftVal != rightVal;

                case '===':
                    return leftVal === rightVal;

                case '!==':
                    return leftVal !== rightVal;

                case '*=':

                    return tmpStrL.indexOf(tmpStrR) >= 0;

                case '^=':
                    return tmpStrL.startsWith(tmpStrR);

                case '$=':
                    return tmpStrL.endsWith(tmpStrR);

                case '>':
                    return leftVal > rightVal;

                case '<':
                    return leftVal < rightVal;

                case '>=':
                    return leftVal >= rightVal;

                case '<=':
                    return leftVal <= rightVal;

                case '+':
                    return leftVal + rightVal;

                case '-':
                    return leftVal - rightVal;

                case '*':
                    return leftVal * rightVal;

                case '/':
                    return leftVal / rightVal;

                case '%':
                    return leftVal % rightVal;

                default:
                    console.error('Unknown Binary operator', tree);
                    break;
            }

            return false;
        },
        evalUnaryExpVal: function(tree, obj, opts) {

            var uVal = this.getFilter(tree.argument, _.assign({}, opts, {
                unary: true
            }))(obj);

            switch (tree.operator) {
                case '!':
                case 'NOT':
                    return !uVal;

                case '-':
                    return -uVal;

                default:
                    console.error('Unknown Unary operator', tree);
                    break;
            }

            return false;
        }
    });

})(iD, jsep);