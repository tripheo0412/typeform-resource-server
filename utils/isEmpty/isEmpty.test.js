const chai = require('chai');

const { expect } = chai;
const isEmpty = require('.');

describe('Test isEmpty', () => {
  describe('Test empty string', () => {
    it('Should return true', done => {
      expect(isEmpty('')).to.equal(true);
      done();
    });
  });
  describe('Test string with only space', () => {
    it('Should return true', done => {
      expect(isEmpty(' ')).to.equal(true);
      done();
    });
  });
  describe('Test empty object', () => {
    it('Should return true', done => {
      expect(isEmpty({})).to.equal(true);
      done();
    });
  });
  describe('Test string', () => {
    it('Should return false', done => {
      expect(isEmpty('Hello')).to.equal(false);
      done();
    });
  });
  describe('Test empty array', () => {
    it('Should return true', done => {
      expect(isEmpty([])).to.equal(true);
      done();
    });
  });
});
