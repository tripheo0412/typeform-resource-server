const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Controller = require('.');
const Workspace = require('../../models/workspace');
const User = require('../../models/user');
const Form = require('../../models/form');
const Template = require('../../models/template');
const Authority = require('../../models/authority');
const { success } = require('../../utils/handleResponse');

const { expect } = chai;
const testError = new Error('Test');

chai.use(sinonChai);

let sandbox;
let res = {};

describe('Workspace Controller Test', () => {
  const req = {
    body: {},
    params: {
      id: '1',
    },
    user: {
      id: '1',
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

  describe('Create new workspace', () => {
    it('Should return status 201', done => {
      sandbox.stub(User, 'findById').returns(Promise.resolve(new User()));
      sandbox
        .stub(Workspace, 'create')
        .returns(Promise.resolve(new Workspace()));
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve());
      sandbox.stub(Authority, 'create').returns(Promise.resolve());

      res.status = arg => {
        expect(arg).equals(201);
        done();
        return res;
      };

      Controller.create(req, res);
    });

    it('Should return status 400', done => {
      sandbox.stub(User, 'findById').returns(Promise.resolve(new User()));
      sandbox.stub(Workspace, 'create').returns(Promise.reject());

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      Controller.create(req, res);
    });
  });

  // describe('Get workspace', () => {
  //   it('Should return status 200 and 1 workspace object', done => {
  //     const mockQuery = {};
  //     mockQuery.populate = sinon.stub().returns(mockQuery);
  //     mockQuery.exec = sinon.stub().resolves(new Workspace());
  //     sandbox.stub(Workspace, 'findById').returns(mockQuery);

  //     Controller.getWorkspaceContent(req, res);

  //     res.status = arg => {
  //       expect(arg).equals(200);
  //       done();
  //       return res;
  //     };
  //   });

  //   it('Should return status 400 and error message', done => {
  //     const mockQuery = {};
  //     mockQuery.populate = sinon.stub().returns(mockQuery);
  //     mockQuery.exec = sinon.stub().resolves();
  //     sandbox.stub(Workspace, 'findById').returns(mockQuery);

  //     Controller.getWorkspaceContent(req, res);

  //     res.status = arg => {
  //       expect(arg).equals(400);
  //       done();
  //       return res;
  //     };
  //   });
  // });

  describe('Get user workspaces', () => {
    it('Should return status 200', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves(new User());
      sandbox.stub(User, 'findById').returns(mockQuery);

      Controller.getWorkspaces(req, res);

      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };
    });

    it('Should return status 400', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves();
      sandbox.stub(User, 'findById').returns(mockQuery);

      Controller.getWorkspaces(req, res);

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };
    });
  });

  describe('Update workspace', () => {
    it('Should return status 200 and success message', done => {
      sandbox
        .stub(Workspace, 'findByIdAndUpdate')
        .returns(Promise.resolve(success));
      Controller.update(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(success);
        expect(res.statusCode).equals(200);
      };
      done();
    });

    it('Should return status 400 and error message', done => {
      sandbox
        .stub(Workspace, 'findByIdAndUpdate')
        .returns(Promise.reject(testError));
      Controller.update(req, res);
      res.json = obj => {
        expect(obj).equals(testError);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });

  describe('Delete workspace', () => {
    it('Should return status 200 and success message', done => {
      sandbox
        .stub(Workspace, 'findByIdAndDelete')
        .returns(Promise.resolve(new Workspace()));
      sandbox.stub(Authority, 'deleteMany').returns(Promise.resolve());
      sandbox.stub(User, 'updateMany').returns(Promise.resolve(success));
      sandbox.stub(Template, 'deleteMany').returns(Promise.resolve());
      sandbox.stub(Form, 'find').returns(Promise.resolve([new Form()]));
      sandbox.stub(Form.prototype, 'remove').returns(Promise.resolve());

      res.json = obj => {
        expect(obj).to.deep.equal(success);
        expect(res.statusCode).equals(200);
        done();
      };

      Controller.remove(req, res);
    });

    it('Should return status 400', done => {
      sandbox
        .stub(Workspace, 'findByIdAndDelete')
        .returns(Promise.reject(testError));

      res.json = obj => {
        expect(obj).to.deep.equal(testError);
        expect(res.statusCode).equals(400);
        done();
      };

      Controller.remove(req, res);
    });
  });
});
