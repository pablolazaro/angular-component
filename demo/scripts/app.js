'use strict';

var app = angular.module('demoApp', ['angular-component', 'ngMockE2E']);

app.run(function($httpBackend) {
    var contacts = [
        { name: 'Pepe', phone: '756231242'},
        { name: 'Mario', phone: '654738392'},
        { name: 'Juan', phone: '765174625'},
        { name: 'Maria', phone: '654781723'},
        { name: 'Luis', phone: '654781723'},
        { name: 'Pedro', phone: '654781723'},
        { name: 'Manuel', phone: '654781723'},
        { name: 'Esther', phone: '654781723'},
        { name: 'Sandra', phone: '654781723'},
        { name: 'Carlos', phone: '654781723'},
        { name: 'Angel', phone: '654781723'},
        { name: 'Javier', phone: '654781723'}
    ];

    $httpBackend.whenGET('/api/contacts').respond({contacts: contacts});
    $httpBackend.whenGET('/api/config/limit').respond({limit: 5});
});

angular.bootstrap(document, ['demoApp']);
