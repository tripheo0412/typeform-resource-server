const chai = require('chai');
const sinon = require('sinon');
const Controller = require('.');
const Template = require('../../models/template');
const Form = require('../../models/form');
const handleResponse = require('../../utils/handleResponse');

const { expect } = chai;

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
      body: {
        templateURL: 'ngoc.alo.com',
        templateId: '123456',
        questions: [
          {
            questionType: 'ShortText',
            order: 1,
            title: 'What is your name?',
          },
        ],
        responses: [],
      },
    };

    it('Should return status 201', done => {
      res.status = arg => {
        expect(arg).equals(201);
        done();
        return res;
      };

      sandbox
        .stub(Template, 'findById')
        .returns(Promise.resolve(new Template()));
      sandbox
        .stub(Form.prototype, 'save')
        .returns(Promise.resolve(new Form(req.body)));
      sandbox.stub(Template.prototype, 'save').returns(Promise.resolve());

      Controller.create(req, res);
    });

    it('Should return status 400', done => {
      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      sandbox.stub(Template, 'findById').returns(Promise.reject());

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
      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };

      sandbox.stub(Form, 'findOne').returns(Promise.resolve(new Form()));

      Controller.get(req, res);
    });

    it('Should return error', done => {
      res.json = arg => {
        expect(arg).equals(handleResponse.errorTest);
        done();
      };

      sandbox
        .stub(Form, 'findOne')
        .returns(Promise.reject(handleResponse.errorTest));

      Controller.get(req, res);
    });
  });

  describe('Test update', () => {
    const req = {
      body: {
        response: [[{ order: 1, value: 'I do not know' }]],
      },
      params: {
        shortId: '123456',
      },
    };

    it('Should return success message', done => {
      res.json = arg => {
        expect(arg).to.deep.equal(handleResponse.success);
        done();
      };

      sandbox.stub(Form, 'findOne').returns(Promise.resolve(new Form()));

      sandbox
        .stub(Form.prototype, 'save')
        .returns(Promise.resolve(handleResponse.success));

      Controller.update(req, res);
    });
  });

  describe('Test remove', () => {
    const req = {
      params: {
        id: '123456',
      },
    };

    it('Should return success message', done => {
      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };

      sandbox
        .stub(Form, 'findByIdAndDelete')
        .returns(Promise.resolve(new Form()));

      Controller.remove(req, res);
    });

    it('Should return error', done => {
      res.json = arg => {
        expect(arg).equals(handleResponse.errorTest);
        done();
      };

      sandbox
        .stub(Form, 'findByIdAndDelete')
        .returns(Promise.reject(handleResponse.errorTest));

      Controller.remove(req, res);
    });
  });
});
