const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Controller = require('.');
const Theme = require('../../models/theme');
const User = require('../../models/user');
const Template = require('../../models/template');
const handleResponse = require('../../utils/handleResponse');

const { expect } = chai;

chai.use(sinonChai);

let sandbox;
let res = {};
const theme = {
  userId: 'user1',
  font: 'Roboto',
  questionColor: '#000000',
  answerColor: '#000000',
  buttonColor: '#202020',
  backgroundColor: '#ffffff',
  name: 'Integrify Theme',
  _id: 'theme1',
  isPublic: false,
  backgroundImage: 'bit.ly/2345',
  lastModified: '2019-06-28T08:12:08.097Z',
  createdAt: '2019-06-27T08:12:09.097Z',
};

describe('Theme Controller Test', () => {
  const req = {
    body: theme,
    params: {
      id: 'theme1',
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

  describe('Create new theme', () => {
    it('Should return status 201', done => {
      res.json = arg => {
        expect(res.statusCode).equals(201);
        expect(arg).to.deep.equal(theme);
        done();
      };
      sandbox.stub(User, 'findById').returns(Promise.resolve(new User()));
      sandbox.stub(Theme, 'create').returns(Promise.resolve(theme));
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve());
      Controller.newTheme(req, res);
    });
    it('Should return status 400', done => {
      sandbox.stub(User, 'findById').returns(Promise.resolve(new User()));
      sandbox.stub(Theme, 'create').returns(Promise.reject());
      Controller.newTheme(req, res);
      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };
    });
  });

  describe('Get theme by ID', () => {
    it('Should return status 200 and theme object', done => {
      sandbox.stub(Theme, 'findById').returns(Promise.resolve(theme));
      Controller.getThemeById(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(theme);
        expect(res.statusCode).equals(200);
        done();
      };
    });

    it('Should return status 400 and error object', done => {
      sandbox
        .stub(Theme, 'findById')
        .returns(Promise.reject(handleResponse.errorTest));
      Controller.getThemeById(req, res);
      res.json = obj => {
        expect(obj).equals(handleResponse.errorTest);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });

  describe('Get user themes', () => {
    it('Should return status 200', done => {
      const mockQuery = {};
      mockQuery.populate = sinon.stub().returns(mockQuery);
      mockQuery.exec = sinon.stub().resolves(new User());
      sandbox.stub(User, 'findById').returns(mockQuery);

      Controller.getUserThemes(req, res);

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

      Controller.getUserThemes(req, res);

      res.status = arg => {
        expect(arg).equals(400);
        done();
        return res;
      };
    });
  });

  describe('Get public themes', () => {
    it('Should return status 200 and all public themes', done => {
      sandbox.stub(Theme, 'find').returns(Promise.resolve([theme]));
      Controller.getPublicTheme(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal([theme]);
        expect(res.statusCode).equals(200);
        done();
      };
    });

    it('Should return status 400 and error message', done => {
      sandbox
        .stub(Theme, 'find')
        .returns(Promise.reject(handleResponse.errorTest));
      Controller.getPublicTheme(req, res);
      res.json = obj => {
        expect(obj).equals(handleResponse.errorTest);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });

  describe('Update theme', () => {
    it('Should return status 200 and success message', done => {
      sandbox
        .stub(Theme, 'findByIdAndUpdate')
        .returns(Promise.resolve(handleResponse.success));
      Controller.updateTheme(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(handleResponse.success);
        expect(res.statusCode).equals(200);
        done();
      };
    });

    it('Should return status 400 and error message', done => {
      sandbox
        .stub(Theme, 'findByIdAndUpdate')
        .returns(Promise.reject(handleResponse.errorTest));
      Controller.updateTheme(req, res);
      res.json = obj => {
        expect(obj).equals(handleResponse.errorTest);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });

  describe('Delete theme', () => {
    it('Should return status 200 and success message', done => {
      sandbox.stub(User, 'updateOne').returns(Promise.resolve());
      sandbox.stub(Theme, 'findOne').returns(Promise.resolve(new Theme()));
      sandbox.stub(Template, 'updateMany').returns(Promise.resolve());
      sandbox
        .stub(Theme, 'findByIdAndDelete')
        .returns(Promise.resolve(handleResponse.success));
      Controller.deleteTheme(req, res);
      res.json = obj => {
        expect(obj).to.deep.equal(handleResponse.success);
        expect(res.statusCode).equals(200);
        done();
      };
    });

    it('Should return status 400 and error message', done => {
      sandbox.stub(User, 'updateOne').returns(Promise.resolve());
      sandbox.stub(Theme, 'findOne').returns(Promise.resolve(new Theme()));
      sandbox.stub(Template, 'updateMany').returns(Promise.resolve());
      sandbox
        .stub(Theme, 'findByIdAndDelete')
        .returns(Promise.reject(handleResponse.errorTest));
      Controller.deleteTheme(req, res);
      res.json = obj => {
        expect(obj).equals(handleResponse.errorTest);
        expect(res.statusCode).equals(400);
        done();
      };
    });
  });
});
