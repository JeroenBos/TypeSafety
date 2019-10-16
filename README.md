# TypeSafety
## Goal
The goal of this package is to help enforce runtime type safety in typescript, aided by compile time errors as much as possible.


## Example
Suppose we have the following type example:

<img src="https://github.com/JeroenBos/TypeSafety/blob/master/example/interface%20example.png?raw=true" width="500"/>


Then I'd like to be able to assert at runtime whether an object specified to my function is actually of the type as annotated in Typescript, like so:

<img src="https://github.com/JeroenBos/TypeSafety/blob/master/example/verify%20example.png?raw=true" width="500"/>

The method above throws if it is not of type `Example`. Obviously, you may also want to merely _check_ for being of that type, rather than assert, like so:

<img src="https://github.com/JeroenBos/TypeSafety/blob/master/example/is%20example.png?raw=true" width="500"/>


## Implementation notes 
Unfortunately, since at runtime the typescript annotations are not retrievable, to accomplish this you have to add some boilerplate code per type that you want to be able to check for typesafety.
I like to do that in another file, such that the implementation of `typesystem` above would look something like this:

![](https://github.com/JeroenBos/TypeSafety/blob/master/example/typesystem%20example.png?raw=true)

`CheckableTypes` represents the list of types (with their keys) which you can check for using a statement like `typesystem.assert(<key>, <obj>)`.
Then `AllTypesDescriptions` contains a type description per key-value-pair in `CheckableTypes`. 

The type `TypeDescriptionsFor` and `TypeSystem` are designed to enfore you to implement `AllTypesDescription` correctly. Actually pretty much all of the time you can ctrl+space your way through. 
This is to ensure that I don't make any mistakes in implementing the description of a type. Of course you could always circumvent this using `any`, but, just don't...

So just write type descriptions once, and you can assert type safety for ever! Some basic type descriptions have already been implemented in `BaseTypeDescriptions`. 
