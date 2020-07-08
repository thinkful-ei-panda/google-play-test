const expect = require('chai').expect;
const app = require('./app.js');
const supertest = require('supertest');

describe('App', () => {
  it('should return a message from GET / ', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello Express!');
  });
});

describe('/apps', () => {
  it('should return a list of apps from Get /apps', () => {
    return supertest(app)
      .get('/apps')
      //expect an array of objects
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
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

  
  let queries = ['App', 'Rating'];
  queries.forEach(query => {
    it(`should sort list by ${query}`, () => {

      return supertest(app)
        .get('/apps')
        .query({ sort : query})
        .then(res => {
          expect(res.body).to.be.an('array');
          let sorted = true, i =0;

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

  it('should return error 400 if genre query does not include Action, Puzzle, Strategy, Casual, Arcade, or Card', () => {
    return supertest(app) 
      .get('/apps')
      .query({ genres : 'invalid' })
      .expect(400, 'Genre must include Action, Puzzle, Strategy, Casual, Arcade, Card');
  });

 
  let genres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

  genres.forEach(genre => {
    it(`should filter list by ${genre}`, () => {

      return supertest(app)
        .get('/apps')
        .query({ genres : genre})
        .then(res => {
          expect(res.body).to.be.an('array');
          let filtered = true, i = 0;
          while (i < res.body.length - 1) {
            if(res.body[i].Genres !== genre) {
              filtered = false;
            }
            i++;
          }
          expect(filtered).to.be.true;
          
        });
    });
  });

});


