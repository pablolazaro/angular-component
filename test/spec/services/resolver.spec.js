'use strict';

describe('Unit: Testing ResolverService', function () {

    // Load module angular-component before test
    beforeEach(module('angular-component'));

    it('module should contains a ResolverService', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService).not.toBe(undefined);
    }]));

    it('ResolverService should contains convertToType method', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.convertToType).not.toBe(undefined);
    }]));

    it('method convertToType should convert to String correctly', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.convertToType(null, 'string')).toBe('null');
        expect(ResolverService.convertToType(undefined, 'string')).toBe('undefined');
        expect(ResolverService.convertToType({object: 'myObject'}, 'string')).toBe('{"object":"myObject"}');
        expect(ResolverService.convertToType(['one', 'two', 'three'], 'string')).toBe('["one","two","three"]');
        expect(ResolverService.convertToType(true, 'string')).toBe('true');
        expect(ResolverService.convertToType(1, 'string')).toBe('1');
        expect(ResolverService.convertToType('myString', 'string')).toBe('myString');
    }]));

    it('method convertToType should convert to Boolean correctly', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.convertToType(true, 'boolean')).toBe(true);
        expect(ResolverService.convertToType(false, 'boolean')).toBe(false);
        expect(ResolverService.convertToType('true', 'boolean')).toBe(true);
        expect(ResolverService.convertToType('false', 'boolean')).toBe(false);
        expect(ResolverService.convertToType(1, 'boolean')).toBe(true);
        expect(ResolverService.convertToType(0, 'boolean')).toBe(false);
        expect(ResolverService.convertToType('stringNotBoolean', 'boolean')).toBe(false);
        expect(ResolverService.convertToType({}, 'boolean')).toBe(false);
        expect(ResolverService.convertToType([], 'boolean')).toBe(false);
        expect(ResolverService.convertToType(null, 'boolean')).toBe(false);
        expect(ResolverService.convertToType(undefined, 'boolean')).toBe(false);
    }]));

    it('method convertToType should convert to Number correctly', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.convertToType('123', 'number')).toBe(123);
        expect(ResolverService.convertToType('-123', 'number')).toBe(-123);
        expect(ResolverService.convertToType(true, 'number')).toBe(1);
        expect(ResolverService.convertToType(false, 'number')).toBe(0);
        expect(Number.isNaN(ResolverService.convertToType({}, 'number'))).toBe(true);
        expect(Number.isNaN(ResolverService.convertToType([], 'number'))).toBe(true);
        expect(Number.isNaN(ResolverService.convertToType(null, 'number'))).toBe(true);
        expect(Number.isNaN(ResolverService.convertToType(undefined, 'number'))).toBe(true);
    }]));

    it('ResolverService should contains resolveCondition method', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.resolveCondition).not.toBe(undefined);
    }]));

    it('method resolveCondition should resolve conditions correctly', inject(['ResolverService', function (ResolverService) {
        var scope = {};

        scope.myTrueVar = true;
        scope.myFalseVar = false;
        scope.myNumberVar = 1;
        scope.myStringVar = 'true';

        expect(ResolverService.resolveCondition('{{1 === 1}}', scope)).toBe(true);
        expect(ResolverService.resolveCondition('{{0 === 1}}', scope)).toBe(false);
        expect(ResolverService.resolveCondition('{{myTrueVar === true}}', scope)).toBe(true);
        expect(ResolverService.resolveCondition('{{myFalseVar === true}}', scope)).toBe(false);
        expect(ResolverService.resolveCondition('{{"true" === true}}', scope)).toBe(false);
    }]));

    it('ResolverService should contains expressionResolver method', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.expressionResolver).not.toBe(undefined);
    }]));

    it('ResolverService should contains httpResolver method', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.httpResolver).not.toBe(undefined);
    }]));


});

