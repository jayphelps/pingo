import chai from 'chai';
/* eslint no-unused-vars:0 */
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const should = chai.should();
chai.use(sinonChai);

if (global)
{
    global.should = should;
}
else
{
    window.should = should;
}

