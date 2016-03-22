// vim: expandtab:ts=4:sw=4
/*
 * Copyright 2016 Carsten Klein
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {
    decoratedClassFactory, decoratedMethodFactory
} from 'pingo-common/factories';

import {isMethodDescriptor} from 'pingo-common/guards';

import {className} from 'pingo-common/utils';


/**
 * TODO:document
 *
 * @param {TargetType} target - the target
 * @param {String} attr - the optional attr
 * @param {MethodDescriptorType} descriptor - the optional descriptor
 * @returns {Class|MethodDescriptorType} - the descriptor
 */
export default function abstract(target, attr, descriptor)
{
    let result;

    if (arguments.length == 1)
    {
        result = decorateClass(target);
    }
    else
    {
        if (!isMethodDescriptor(descriptor))
        {
            throw new Error(
                '@abstract can only be used on classes and methods'
            );
        }
        result = decorateMethod(target, attr, descriptor);
    }

    return result;
}


/**
 * @private
 * @param {TargetType} target - the target
 * @param {String} attr - the attr
 * @param {MethodDescriptorType} descriptor - the descriptor
 * @returns {MethodDescriptorType} - the descriptor
 */
function decorateMethod(target, attr, descriptor)
{
    const result = {...descriptor};

    /*eslint no-unused-vars:0*/
    const func = function func(method, args)
    {
        /*eslint no-invalid-this:0*/
        throw new Error(
            `${className(this)} must implement abstract method ${attr}()`
        );
    }

    result.value = decoratedMethodFactory(descriptor.value, func);

    Object.defineProperty(
        result.value, ABSTRACT,
        {
            configurable: false, enumerable: false,
            writable: false, value: true
        }
    );

    return result;
}


/**
 * @private
 * @param {Class} target - the target
 * @returns {Class} - the decorated class
 */
function decorateClass(target)
{
    const ctor = function ctor(target, args)
    {
        /*eslint no-invalid-this:0*/
        const isAbstract = this.constructor.name == target.name;
        let isSubclassConcrete = true;
        if (!isAbstract)
        {
            isSubclassConcrete = isConcrete(this.constructor);
        }

        if (isAbstract || !isSubclassConcrete)
        {
            const parts = [
                `abstract class ${className(this)} cannot be instantiated`
            ];
            if (!isSubclassConcrete)
            {
                parts.push(
                    'maybe you forgot to decorate the class using @abstract?'
                );
            }
            throw new TypeError(parts.join('\n'));
        }

        target.apply(this, args);
    }

    return decoratedClassFactory(target, ctor);
}


/**
 * @private
 * @param {Class} constructor - the constructor function
 * @returns {Boolean} - true whether the class is concrete
 */
function isConcrete(constructor)
{
    let result = true;

    const staticmap = {};
    const instancemap = {};
    let ctor = constructor;
    while (ctor.prototype)
    {
        if (
            !hasConcreteMethodsOnly(ctor, staticmap)
            || !hasConcreteMethodsOnly(ctor.prototype, instancemap)
        )
        {
            result = false;
            break;
        }

        ctor = Object.getPrototypeOf(ctor);
    }

    return result;
}


/**
 * @private
 * @param {TargetType} obj - the constructor function or its prototype
 * @param {Object} map - map for keeping track of own properties
 * @returns {Boolean} - true whether obj has concrete methods only
 */
function hasConcreteMethodsOnly(obj, map)
{
    let result = true;

    let keys = Object.getOwnPropertyNames(obj);
    for (let index=0; index<keys.length; index++)
    {
        const attr = keys[index];
        if (!(attr in map))
        {
            map[attr] = true;
            const desc = Object.getOwnPropertyDescriptor(obj, attr);
            if (isMethodDescriptor(desc) && desc.value[ABSTRACT])
            {
                result = false;
                break;
            }
        }
    }

    return result;
}


/**
 * @private
 */
const ABSTRACT = Symbol('abstract');

