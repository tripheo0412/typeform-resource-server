const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Controller = require('.');
const Workspace = require('../../models/workspace');
const User = require('../../models/user');
const Form = require('../../models/form');
const Template = require('../../models/template');
const handleResponse = require('../../utils/handleResponse');

const { expect } = chai;

chai.use(sinonChai);

let sandbox;
let res = {};
const workspace = {
  adminIds: ['user1'],
  collaboratorIds: ['user2', 'user3'],
  templateIds: ['template1', 'template2'],
  _id: 'workspace1',
  name: 'My Workspace',
  createdAt: '2019-06-27T08:12:09.097Z',
};

describe('Workspace Controller Test', () => {
  const req = {
    body: workspace,
    params: {
      id: 'workspace1',
    },
    user: {
      _id: 'user1',
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
      sandbox.stub(Workspace, 'create').returns(Promise.resolve(workspace));
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve());
      Controller.newWorkspace(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(workspace);
        expect(res.statusCode).equals(201);
        done();
      };
    });
    it('Should return status 400', done => {
      sandbox.stub(User, 'findById').returns(Promise.resolve(new User()));
      sandbox.stub(Workspace, 'create').returns(Promise.reject());
      Controller.newWorkspace(req, res);
      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };
    });
  });

  describe('Get workspace', () => {
    it('Should return status 200 and 1 workspace object', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves(new Workspace());
      sandbox.stub(Workspace, 'findById').returns(mockQuery);

      Controller.getWorkspaceContent(req, res);

      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };
    });

    it('Should return status 400 and error message', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves();
      sandbox.stub(Workspace, 'findById').returns(mockQuery);

      Controller.getWorkspaceContent(req, res);

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };
    });
  });

  describe('Get user workspaces', () => {
    it('Should return status 200', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves(new User());
      sandbox.stub(User, 'findById').returns(mockQuery);

      Controller.getUserWorkspaces(req, res);

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

      Controller.getUserWorkspaces(req, res);

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
        .returns(Promise.resolve(handleResponse.success));
      Controller.updateWorkspace(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(handleResponse.success);
        expect(res.statusCode).equals(200);
      };
      done();
    });

    it('Should return status 400 and error message', done => {
      sandbox
        .stub(Workspace, 'findByIdAndUpdate')
        .returns(Promise.reject(handleResponse.errorTest));
      Controller.updateWorkspace(req, res);
      res.json = obj => {
        expect(obj).equals(handleResponse.errorTest);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });

  describe('Delete workspace', () => {
    it('Should return status 200 and success message', done => {
      sandbox
        .stub(Workspace, 'findById')
        .returns(Promise.resolve(new Workspace()));
      sandbox.stub(Form, 'deleteMany').returns(Promise.resolve());
      sandbox.stub(Template, 'deleteMany').returns(Promise.resolve());
      sandbox.stub(Workspace.prototype, 'deleteOne').returns(Promise.resolve());
      sandbox
        .stub(User, 'updateMany')
        .returns(Promise.resolve(handleResponse.success));
      Controller.deleteWorkspace(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(handleResponse.success);
        expect(res.statusCode).equals(200);
      };
      done();
    });

    it('Should return status 400', done => {
      sandbox
        .stub(Workspace, 'findById')
        .returns(Promise.reject(handleResponse.errorTest));
      sandbox.stub(Form, 'deleteMany').returns(Promise.resolve());
      sandbox.stub(Template, 'deleteMany').returns(Promise.resolve());
      sandbox.stub(Workspace.prototype, 'deleteOne').returns(Promise.resolve());
      sandbox.stub(User, 'updateMany').returns(Promise.resolve());
      Controller.deleteWorkspace(req, res);
      res.json = obj => {
        expect(obj).equals(handleResponse.errorTest);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });
});
