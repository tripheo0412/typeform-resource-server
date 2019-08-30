const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Controller = require('.');
const Theme = require('../../models/theme');
const User = require('../../models/user');
const Template = require('../../models/template');
const Authority = require('../../models/authority');
const { success } = require('../../utils/handleResponse');

const { expect } = chai;
const testError = new Error('Test');

chai.use(sinonChai);

let sandbox;
let res = {};

describe('Theme Controller Test', () => {
  const req = {
    body: {},
    params: {},
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

  describe('Get public themes', () => {
    it('Should return status 200 and all public themes', done => {
      sandbox.stub(Theme, 'find').returns(Promise.resolve());

      res.json = () => {
        expect(res.statusCode).equals(200);
        done();
      };

      Controller.getPublicThemes(req, res);
    });

    it('Should return status 400 and error message', done => {
      sandbox.stub(Theme, 'find').returns(Promise.reject(testError));
      Controller.getPublicThemes(req, res);
      res.json = obj => {
        expect(obj).equals(testError);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });

  describe('Create new theme', () => {
    it('Should return status 201', done => {
      sandbox.stub(User, 'findById').returns(Promise.resolve(new User()));
      sandbox.stub(Theme, 'create').returns(Promise.resolve(new Theme()));
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve());
      sandbox.stub(Authority, 'create').returns(Promise.resolve());

      res.json = () => {
        expect(res.statusCode).equals(201);

        done();
      };

      Controller.create(req, res);
    });
    it('Should return status 400', done => {
      sandbox.stub(User, 'findById').returns(Promise.resolve(new User()));
      sandbox.stub(Theme, 'create').returns(Promise.reject());

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      Controller.create(req, res);
    });
  });

  describe('Get theme by ID', () => {
    it('Should return status 200 and theme object', done => {
      sandbox.stub(Theme, 'findById').returns(Promise.resolve());

      res.json = () => {
        expect(res.statusCode).equals(200);
        done();
      };

      Controller.getById(req, res);
    });

    it('Should return status 400 and error object', done => {
      sandbox.stub(Theme, 'findById').returns(Promise.reject(testError));

      res.json = obj => {
        expect(obj).equals(testError);
        expect(res.statusCode).equals(400);
        done();
      };

      Controller.getById(req, res);
    });
  });

  describe('Get user themes', () => {
    it('Should return status 200', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves(new User());
      sandbox.stub(User, 'findById').returns(mockQuery);

      res.status = arg => {
        expect(arg).equals(200);
        done();
        return res;
      };

      Controller.getUserThemes(req, res);
    });

    it('Should return status 400', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves();
      sandbox.stub(User, 'findById').returns(mockQuery);

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };

      Controller.getUserThemes(req, res);
    });
  });

  describe('Update theme', () => {
    it('Should return status 200 and success message', done => {
      sandbox
        .stub(Theme, 'findByIdAndUpdate')
        .returns(Promise.resolve(success));
      Controller.update(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(success);
        expect(res.statusCode).equals(200);
        done();
      };
    });

    it('Should return status 400 and error message', done => {
      sandbox
        .stub(Theme, 'findByIdAndUpdate')
        .returns(Promise.reject(testError));
      Controller.update(req, res);
      res.json = obj => {
        expect(obj).equals(testError);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });

  describe('Delete theme', () => {
    it('Should return status 200 and success message', done => {
      sandbox
        .stub(Theme, 'findByIdAndDelete')
        .returns(Promise.resolve(success));
      sandbox.stub(User, 'updateOne').returns(Promise.resolve());
      sandbox.stub(Authority, 'deleteOne').returns(Promise.resolve());
      sandbox.stub(Theme, 'findOne').returns(Promise.resolve(new Theme()));
      sandbox.stub(Template, 'updateMany').returns(Promise.resolve());

      res.json = obj => {
        expect(obj).to.deep.equal(success);
        expect(res.statusCode).equals(200);
        done();
      };

      Controller.remove(req, res);
    });

    it('Should return status 400 and error message', done => {
      sandbox
        .stub(Theme, 'findByIdAndDelete')
        .returns(Promise.reject(testError));

      res.json = obj => {
        expect(obj).equals(testError);
        expect(res.statusCode).equals(400);
        done();
      };

      Controller.remove(req, res);
    });
  });
});
