# angular-component [![Build Status](https://travis-ci.org/pablolazaro/angular-component.svg?branch=master)](https://travis-ci.org/pablolazaro/angular-component)

Useful module for define reusable components in a easy way.

## How it works

*angular-component* module contains a *directive* called `component`. Through this directive you can define components just writing a simple JSON object as follows:

    [
        { "name": "myBooleanVar", "typeof": "boolean", "expression": "true", "condition": "" },
        { "name": "myNumberVar", "typeof": "number", "parent": "myBooleanVar", "expression": "15" },
        { "name": "myStringVar", "typeof": "string", "parent": "myNumberVar", "http": { "url": "api/telefono/{{myNumberVar}}", "responseName": "myString" } }
    ]

This way, once all definitions has been resolved they will be accessible from the component scope, and without writing any piece of JavaScript code!

## Usage

Suppose you need a reusable component in your web application using **AngularJS**.
This component should work fine everywhere you place it, regardless of what surrounds it and also of route changes of the application (and possible resolve function which come with it).
So, what do you need to do to achieve this requirements using *angular-component*?.

Lets start defining the HTML component:

    <component name="myFirstComponent">
        <p>Hello Word from my first component</p>
    </component>

We already have got the element, now we are going to define some properties and use them inside the component:

    <component name="myFirstComponent" 
               definition="[
                    { "name": "isMyFirstComponent", "expression": "true", "typeof": "boolean" }
               ]">
               
        <p ng-show="isMyFirstComponent">Hello Word from my first component</p>
    </component>

Property *isMyFirstComponent* is accessible from the component scope once it has been resolved and we can use it for HTML manipulation.

[...]


## Definition object options

 - `name`: Name that will have the object in the component scope. (**Required**)
		`{ "name": "myPhoneId" }`
 - `typeof`: Will convert the object value to specified type. (**Optional**)
		 `{ "name": "myPhoneId", "typeof": "number" }`
 - `parent`: Object only will be resolved when parent object has been created. Currently only one parent is allowed. (**Optional**)
		 `{ "name": "myPhoneId", "typeof": "number", "parent": "parentVariableName" }`
 - `condition`: Expression that must be satisfied in order to resolve the object. (**Optional**)
		 `{ "name": "myPhoneId", "typeof": "number", "parent": "parentVariableName", "condition": "{{parentVariableName === true}}" }`
 - `expression`: The value of the expression will be the value of the object. You could use AngularJS expression. (**Optional**)
		`{ "name": "parentVariableName", "expression": "true === true"}`
 - `http`: The value of the expression will be the response of the HTTP GET request defined. You could configure the request this way:
	- `url`: Request URL as string, you could use AngularJS expressions. (**Required**)
			 `{ "url": "/api/phones/{{myPhoneId}}"}`
	- `responseName`: Name of the object in response which contains desired value. If empty, definition object name will be use. (**Optional**)
			 `{ "url": "/api/phones/{{myPhoneId}}", "responseName": "info" }`
	- `config`: Configuration object which will be passed to $http service. (**Optional**)

You can not use `expression` and `http` at the same time.

## Acknowledgments

For those developers of the VASS company who work in the CCLI project, because I owe them the initial idea of this module.
