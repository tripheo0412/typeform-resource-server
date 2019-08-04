const chai = require('chai');
const { keys } = require('../../config');

const { expect } = chai;
const generateURL = require('.');

describe('Test generateURL from email', () => {
  it(`Should return email_name@${keys.DOMAIN}`, done => {
    expect(generateURL('trihoang2410@gmail.com')).to.equal(
      `trihoang2410.${keys.DOMAIN}`
    );
    done();
  });
});
