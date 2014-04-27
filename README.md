# angular-component

> Useful module for defining reusable components in a easy way.

## How it works

*angular-component* module contains a *directive* called **component**. Through this directive you can define components just writing a simple JSON object as follows:

    [
        { "name": "myBooleanVar", "typeof": "boolean", "expression": "true", "condition": "" },
        { "name": "myNumberVar", "typeof": "number", "parent": "myBooleanVar", "expression": "15" },
        { "name": "myStringVar", "typeof": "string", "parent": "myNumberVar", "http": { "url": "api/telefono/{{myNumberVar}}", "responseName": "myString" } }
    ]

## Usage