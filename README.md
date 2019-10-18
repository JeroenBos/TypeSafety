# TypeSafety
## Goal
The goal of this package is to help enforcing runtime type safety in Typescript, aided by compile-time errors as much as possible.


## Description
The library foremostly contains an object, `typesystem`, that can do type checks (think `obj is T` or `obj is Partial<T>` or `obj extends T`)
and this library helps enforcing this object's implementation.


## Example
Suppose we have the following example type:

<img src="https://github.com/JeroenBos/TypeSafety/blob/master/example/interface%20example.png?raw=true" width="500"/>


Then I'd like to check at runtime whether a certain object is actually of that type, like so:

<img src="https://github.com/JeroenBos/TypeSafety/blob/master/example/is%20example.png?raw=true" width="500"/>

The method `is` above returns a boolean whether its argument is of type `Example`. However, you may also want to _assert_ `obj` for being of that type, e.g. when it's an argument, like so:

<img src="https://github.com/JeroenBos/TypeSafety/blob/master/example/verify%20example.png?raw=true" width="500"/>

## Implementation notes 
Since unfortunately at runtime the Typescript annotations are not retrievable, to accomplish the above you have to add some boilerplate code per type for which you want check for typesafety.

For example, the implementation of the `typesystem` above would look something like:

![](https://github.com/JeroenBos/TypeSafety/blob/master/example/typesystem%20example.png?raw=true)

`CheckableTypes` represents the list of types (with user-defined keys) which you can type check using a statement like `typesystem.assert(<key>, <obj>)`.

The convention includes types like `AllTypesDescriptions` and `TypeDescriptionsFor`, which are designed to enforce you to implement
`TypeSystem` correctly. It also aids Intellisense: most of the time you can ctrl+space your way through the boilerplate. This helps preventing mistikes in the implementation of a type description (which would defeat the purpose of this library). Of course you could always circumvent this using `any`, but, just don't...

So the idea is you just write type descriptions once, and you can assert type safety for ever! Some basic type descriptions have already been implemented in `BaseTypeDescriptions`.


## Available API

I'd kindly like to inform you of the following methods that are designed to help creating type descriptions: 

- create (for when `T extends object`; primitives are already implemented)
- conjunct (i.e. `T` & `U`)
- disjunct (i.e. `T` | `U`)
- array (i.e. `T[]`)
- nullable (i.e. `T` | `null`)
- possiblyUndefined (i.e. `T` | `undefined`)
- possiblyNullOrUndefined (i.e. `T` | `null` | `undefined`)
- optionalNullable (i.e. `T?` | `null`)



Furthermore, the typesystem has the following methods in its API:

- isExact(key, obj).
- extends(key, obj) .
- partial(key, obj).
- nonStrictPartial(key, obj) (rarely useful).
- assertion methods for all variants of the above (_asserting_ as opposed to _checking_)
- lambda-returning methods for all of the above e.g. isExactF(key)(obj)


### Extensions
If for example you don't want to bother checking a particular property on an object, you could always check it using the type description with key `any`, or alternatively the following also exist: `!undefined`, `!null` and `any!`. In the first two, `!` is to be read as `not`, in the last one as the _bang_ operator.

Alternatively, if you bother a lot, you can of course completely implement your own type descriptions, simply implement `ITypeDescriptions`, and let  `TypeSystem` do the rest, and even guide you on correctly implementing it.


