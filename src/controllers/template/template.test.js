const chai = require('chai');
const sinon = require('sinon');
const Controller = require('.');
const Template = require('../../models/template');
const Workspace = require('../../models/workspace');
const Authority = require('../../models/authority');
const Theme = require('../../models/theme');
const handleResponse = require('../../utils/handleResponse');

const { expect } = chai;
const testError = new Error('Test');

let sandbox;
let req;
let res;
const template = { name: 'Hello' };

describe('Test template controller', () => {
  req = {
    user: {
      id: '1',
    },
    body: {},
    params: {
      id: '123456',
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    res = {
      status: arg => {
        res.statusCode = arg;
        return res;
      },
      json: () => res,
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Test create', () => {
    it('Should return status 201 and template object', done => {
      sandbox
        .stub(Workspace, 'findById')
        .returns(Promise.resolve(new Workspace()));

      sandbox.stub(Theme, 'findOne').returns(Promise.resolve(new Theme()));

      sandbox
        .stub(Template.prototype, 'save')
        .returns(Promise.resolve(template));

      sandbox.stub(Workspace.prototype, 'save').returns(Promise.resolve());

      sandbox.stub(Authority, 'create').returns(Promise.resolve());

      res.json = arg => {
        expect(res.statusCode).equals(201);
        expect(arg).to.deep.equal(template);
        done();
      };

      Controller.create(req, res);
    });

    it('Should return status 400', done => {
      sandbox
        .stub(Workspace, 'findById')
        .returns(Promise.resolve(new Workspace()));

      sandbox.stub(Theme, 'findOne').returns(Promise.resolve(new Theme()));

      sandbox.stub(Template.prototype, 'save').returns(Promise.reject());

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      Controller.create(req, res);
    });
  });

  describe('Test get', () => {
    it('Should return template object', done => {
      res.json = arg => {
        expect(arg).to.deep.equal(template);
        done();
      };

      sandbox.stub(Template, 'findById').returns(Promise.resolve(template));

      Controller.getById(req, res);
    });

    it('Should return error', done => {
      res.json = arg => {
        expect(arg).equals(testError);
        done();
      };

      sandbox.stub(Template, 'findById').returns(Promise.reject(testError));

      Controller.getById(req, res);
    });
  });

  describe('Test get all forms', () => {
    it('Should return status 200', done => {
      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };

      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves(new Template());

      sandbox.stub(Template, 'findById').returns(mockQuery);

      Controller.getTemplateForms(req, res);
    });

    it('Should return status 400', done => {
      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves();
      sandbox.stub(Template, 'findById').returns(mockQuery);

      Controller.getTemplateForms(req, res);
    });
  });

  describe('Test update', () => {
    it('Should return success message', done => {
      res.json = arg => {
        expect(arg).to.deep.equal(handleResponse.success);
        done();
      };

      sandbox
        .stub(Template, 'findByIdAndUpdate')
        .returns(Promise.resolve(handleResponse.success));

      Controller.update(req, res);
    });
  });

  describe('Test remove', () => {
    it('Should return error', done => {
      res.json = arg => {
        expect(arg).equals(testError);
        done();
      };

      sandbox
        .stub(Template, 'findByIdAndDelete')
        .returns(Promise.reject(testError));

      Controller.remove(req, res);
    });
  });
});
