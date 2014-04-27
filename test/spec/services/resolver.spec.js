'use strict';

describe('Unit: Testing ResolverService', function () {

    // Load module angular-component before test
    beforeEach(module('angular.component'));

    it('module should contains a ResolverService', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService).not.toBe(undefined);
    }]));

    it('method convertToType should convert to Boolean correctly', inject(['ResolverService', function (ResolverService) {
        expect(ResolverService.convertToType(true, 'boolean')).toBe(true);
        expect(ResolverService.convertToType(false, 'boolean')).toBe(false);
        expect(ResolverService.convertToType('true', 'boolean')).toBe(true);
        expect(ResolverService.convertToType('false', 'boolean')).toBe(false);
        expect(ResolverService.convertToType(1, 'boolean')).toBe(true);
        expect(ResolverService.convertToType(0, 'boolean')).toBe(false);
        expect(ResolverService.convertToType('stringNotBoolean', 'boolean')).toBe(false);
    }]));
});

