[![Build Status](https://travis-ci.org/coldrye-es/pingo.svg?branch=master)](https://travis-ci.org/coldrye-es/pingo)
[![NPM](https://nodei.co/npm/pingo.png?mini=true)](https://nodei.co/npm/pingo/)

# pingo

pingo is a suite of decorators.


## Releases

See the [changelog](https://github.com/coldrye-es/pingo/blob/master/CHANGELOG.md) for more information.


## Project Site

The project site, see (2) under resources below, provides more insight into the project,
including test coverage reports and API documentation.


## Contributing

You are very welcome to propose changes and report bugs, or even provide pull
requests on [github](https://github.com/coldrye-es/pingo).

See the [contributing guidelines](https://github.com/coldrye-es/pingo/blob/master/CONTRIBUTING.md) for more information.


### Contributors

 - [Carsten Klein](https://github.com/silkentrance) **Maintainer**


### Building

See [build process](https://github.com/coldrye-es/esmake#build-process) and the available [build targets](https://github.com/coldrye-es/esmake#makefilesoftwarein)
for more information on how to build this.

See also [development dependencies](https://github.com/coldrye-es/esmake#development-dependencies) and on how to deal with them.


## Installation

``npm --save pingo``


### Runtime Dependencies

 - _[babel-runtime](https://github.com/babel/babel)_
 - [pingo-common](https://github.com/coldrye-es/pingo-common)

**The dependencies denoted in _italics_ must be provided by the using project.**


## Documentation


## @abstract

The @abstract decorator can be used for decoration of both classes and methods.

Abstract classes cannot be instantiated and invocation of abstract methods will
result in an error.

Derived classes must implement all abstract methods or otherwise instantiation
of the derived class will result in an error.


```
import {abstract} from 'pingo';


@abstract
class AbstractAnimal
{
    constructor(name)
    {
        this._name = name;
    }

    get name()
    {
        return this._name;
    }

    @abstract
    static family() {}

    @abstract
    specialMove() {}
}


@abstract
class AbstractSpeakingAnimal extends AbstractAnimal
{
    constructor(name, sound)
    {
        super(name);
    
        this._sound = sound;
    }

    get sound()
    {
        return this._sound;
    }

    speak()
    {
        return `${this.name}: ${this.sound}`;
    }
}


class Cat extends AbstractSpeakingAnimal
{
    constructor(name)
    {
        super(name, 'meooww');
    }

    static family()
    {
        return 'Feline';
    }

    specialMove()
    {
        return 'sleep';
    }
}


class IncompleteImpl extends AbstractAnimal
{}


const cat = new Cat('felicitas');
console.log(cat.speak());
// felicitas: meooww
console.log(cat.specialMove());
// sleep

new AbstractSpeakingAnimal();
// TypeError: abstract class AbstractSpeakingAnimal cannot be instantiated

new IncompleteImpl();
// TypeError: abstract class IncompleteImpl cannot be instantiated

IncompleteImpl.family();
// Error: IncompleteImpl must implement abstract method ...
```


## Similar Projects

- [core-decorators](https://github.com/jayphelps/core-decorators)


## Resources

 - (1) [Github Site](https://github.com/coldrye-es/pingo)
 - (2) [Project Site](http://pingo.es.coldrye.eu)

