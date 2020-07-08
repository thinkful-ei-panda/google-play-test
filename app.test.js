const expect = require('chai').expect;
const request = require('supertest');
const app = require('./app.js');
const supertest = require('supertest');

describe('App', () => {
  it('should return a message from GET / ', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello Express!');
  });

  describe('/apps', () => {
    it('should return a list of apps from Get /apps', () => {
      return supertest(app)
        .get('/apps')
        //expect an array of objects
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('array')
          expect(res.body).to.have.lengthOf.at.least(1)
          const app = res.body[0];
          expect(app).to.include.all.keys('App', 'Category', 'Rating');
        });
    });

    it('should return error 400 if sort query does not include "Rating" or "App"', () => {
      return supertest(app)
        .get('/apps')
        .query({ sort : 'invalid' })
        .expect(400, 'Sort must include Rating or App');
    });

    it('should sort list by App or Rating', () => {
      let queries = ['App', 'Rating'];
      queries.forEach(query => {
        return supertest(app)
          .get('/apps')
          .query({ sort : query})
          .expect(200)
          .then(res => {
            expect(res.body).to.be.an('array');
            let sorted = true;
            let i =0;
            while (i < res.body.length - 1) {
              if (res.body[i][query] > res.body[i + 1][query]) {
                sorted = false;
              }
              i++;
            }
            expect(sorted).to.be.true;
            
          });
      });
      

    });
  });
});

