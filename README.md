# angular-component [![Build Status](https://travis-ci.org/pablolazaro/angular-component.svg?branch=master)](https://travis-ci.org/pablolazaro/angular-component)

Useful module for define reusable components in a easy way.

## How it works

*angular-component* module contains a *directive* called **component**. Through this directive you can define components just writing a simple JSON object as follows:

    [
        { "name": "myBooleanVar", "typeof": "boolean", "expression": "true", "condition": "" },
        { "name": "myNumberVar", "typeof": "number", "parent": "myBooleanVar", "expression": "15" },
        { "name": "myStringVar", "typeof": "string", "parent": "myNumberVar", "http": { "url": "api/telefono/{{myNumberVar}}", "responseName": "myString" } }
    ]

This way, once all definitions has been resolved they will be accessible from the component scope, and without writing any piece of  JavaScript code!

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

 - **name**: Name that will have the object in the component scope. (**Required**)
 - **typeof**: Will convert the object value to specified type. (**Optional**)
 - **parent**: Object only will be resolved when parent object has been created. Currently only one parent is allowed. (**Optional**)
 - **condition**: Expression that must be satisfied in order to resolve the object. (**Optional**)

## Acknowledgments

For those developers of the VASS company who work in the CCLI project, because I owe them the initial idea of this module.
