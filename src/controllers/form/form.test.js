const chai = require('chai');
const sinon = require('sinon');
const Controller = require('.');
const Template = require('../../models/template');
const Form = require('../../models/form');
const Authority = require('../../models/authority');
const { success } = require('../../utils/handleResponse');

const { expect } = chai;
const testError = new Error('Test');

let sandbox;
let res = {};

describe('Test form controller', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = { status: () => res, json: () => res };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Test create', () => {
    const req = {
      user: {
        id: '1',
      },
      body: {},
    };

    it('Should return status 201', done => {
      sandbox
        .stub(Template, 'findById')
        .returns(Promise.resolve(new Template()));

      sandbox.stub(Form.prototype, 'save').returns(Promise.resolve(new Form()));

      sandbox.stub(Template.prototype, 'save').returns(Promise.resolve());

      sandbox
        .stub(Authority, 'create')
        .returns(Promise.resolve(new Authority()));

      res.status = arg => {
        expect(arg).equals(201);
        done();
        return res;
      };

      Controller.create(req, res);
    });

    it('Should return status 400', done => {
      sandbox.stub(Template, 'findById').returns(Promise.reject());

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      Controller.create(req, res);
    });
  });

  describe('Test get', () => {
    const req = {
      params: {
        shortId: '123456',
      },
    };

    it('Should return status 200', done => {
      sandbox.stub(Form, 'findOne').returns(Promise.resolve(new Form()));

      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };

      Controller.getByShortId(req, res);
    });

    it('Should return error', done => {
      sandbox.stub(Form, 'findOne').returns(Promise.reject(testError));

      res.json = arg => {
        expect(arg).equals(testError);
        done();
      };

      Controller.getByShortId(req, res);
    });
  });

  // describe('Test add response', () => {
  //   const req = {
  //     body: {
  //       response: [[{ order: 1, value: 'I do not know' }]],
  //     },
  //     params: {
  //       shortId: '123456',
  //     },
  //   };

  //   it('Should return success message', done => {
  //     sandbox.stub(Form, 'findOne').returns(Promise.resolve(new Form()));

  //     sandbox.stub(Form.prototype, 'save').returns(Promise.resolve(success));

  //     sandbox
  //       .stub(Template, 'findById')
  //       .returns(Promise.resolve(new Template()));

  //     sandbox
  //       .stub(Template.prototype, 'save')
  //       .returns(Promise.resolve(success));

  //     res.json = arg => {
  //       expect(arg).to.deep.equal(success);
  //       done();
  //     };

  //     Controller.addResponse(req, res);
  //   });
  // });

  describe('Test remove', () => {
    const req = {
      params: {
        id: '123456',
      },
    };

    it('Should return success message', done => {
      sandbox
        .stub(Form, 'findByIdAndDelete')
        .returns(Promise.resolve(new Form()));

      sandbox.stub(Authority, 'deleteMany').returns(Promise.resolve());

      sandbox.stub(Template, 'updateOne').returns(Promise.resolve());

      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };

      Controller.remove(req, res);
    });

    it('Should return error', done => {
      sandbox
        .stub(Form, 'findByIdAndDelete')
        .returns(Promise.reject(testError));

      res.json = arg => {
        expect(arg).equals(testError);
        done();
      };

      Controller.remove(req, res);
    });
  });
});
