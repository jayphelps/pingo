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


import {abstract} from '../src/index';


class Base
{
    name = 'base';

    constructor(value)
    {
        this.value = value;
    }

    @abstract
    /*eslint no-unused-vars:0*/
    static whois(instance) {}

    @abstract
    speak() {}
}


describe('@abstract',
function ()
{
    it('throws error when trying to invoke abstract static method',
    function ()
    {
        function tc()
        {
            Base.whois();
        }
        tc.should.throw('Base must implement abstract method whois()');
    });

    it('throws error when trying to invoke abstract instance method',
    function ()
    {
        function tc()
        {
            new Base().speak();
        }
        tc.should.throw('Base must implement abstract method speak()');
    });
    it('throws when trying to instantiate decorated class',
    function ()
    {
        @abstract
        class FirstBase extends Base
        {
        }
        function tc()
        {
            new FirstBase();
        }
        tc.should.throw('abstract class FirstBase cannot be instantiated');
    });
    it('throws when trying to instantiate incomplete concrete class',
    function ()
    {
        @abstract
        class FirstBase extends Base
        {
        }
        class SecondBase extends FirstBase
        {
        }
        function tc()
        {
            new SecondBase();
        }
        tc.should.throw(
            'abstract class SecondBase cannot be instantiated'
            + '\nmaybe you forgot to decorate'
        );
    });
    it('calling super() in constructor must work as expected',
    function ()
    {
        @abstract
        class FirstBase extends Base
        {
            @abstract
            jump () {}
        }
        class Concrete extends FirstBase
        {
            constructor()
            {
                super(1);
            }

            /*eslint no-unused-vars:0*/
            static whois(instance) {}

            speak() {}

            jump() {}
        }
        let concrete = new Concrete();
        concrete.value.should.equal(1);
        concrete.name.should.equal('base');
    });
    it('must throw when user decorates instance property',
    function ()
    {
        function tc()
        {
            class Unsupported
            {
                @abstract
                touched;
            }
        }
        tc.should.throw('@abstract can only be used on classes and methods');
    });
    it('must throw when user decorates getter',
    function ()
    {
        function tc()
        {
            class Unsupported
            {
                @abstract
                get value() {}
                /*eslint no-unused-vars:0*/
                set value(v) {}
            }
        }
        tc.should.throw('@abstract can only be used on classes and methods');
    });
    it('must throw when user decorates setter',
    function ()
    {
        function tc()
        {
            class Unsupported
            {
                get value() {}
                @abstract
                /*eslint no-unused-vars:0*/
                set value(v) {}
            }
        }
        tc.should.throw('@abstract can only be used on classes and methods');
    });
});

