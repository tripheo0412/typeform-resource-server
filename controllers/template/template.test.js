const chai = require('chai');
const sinon = require('sinon');
const Controller = require('.');
const Template = require('../../models/template');
const Workspace = require('../../models/workspace');
const handleResponse = require('../../utils/handleResponse');

const { expect } = chai;

let sandbox;
let req;
let res;
const template = { name: 'Hello' };

describe('Test template controller', () => {
  req = {
    body: {
      workspaceId: '123456',
      id: '123456',
      name: 'Hello',
      forms: ['123', '456'],
    },
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
      res.json = arg => {
        expect(res.statusCode).equals(201);
        expect(arg).to.deep.equal(template);
        done();
      };

      sandbox
        .stub(Workspace, 'findById')
        .returns(Promise.resolve(new Workspace()));

      sandbox
        .stub(Template.prototype, 'save')
        .returns(Promise.resolve(template));

      sandbox.stub(Workspace.prototype, 'save').returns(Promise.resolve());

      Controller.create(req, res);
    });

    it('Should return status 400', done => {
      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      sandbox
        .stub(Workspace, 'findById')
        .returns(Promise.resolve(new Workspace()));

      sandbox.stub(Template.prototype, 'save').returns(Promise.reject());

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

      Controller.get(req, res);
    });

    it('Should return error', done => {
      res.json = arg => {
        expect(arg).equals(handleResponse.errorTest);
        done();
      };

      sandbox
        .stub(Template, 'findById')
        .returns(Promise.reject(handleResponse.errorTest));

      Controller.get(req, res);
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

      Controller.getAllForms(req, res);
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

      Controller.getAllForms(req, res);
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
        expect(arg).equals(handleResponse.errorTest);
        done();
      };

      sandbox
        .stub(Template, 'findByIdAndDelete')
        .returns(Promise.reject(handleResponse.errorTest));

      Controller.remove(req, res);
    });
  });
});
