const request = require('supertest');
const express = require('express');
const app = require('../index.js');

describe('GET /api/weather', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/api/weather?lat=55.7558&lon=37.6176')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
