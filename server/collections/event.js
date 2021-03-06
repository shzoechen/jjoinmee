var express = require('express');
var knex = require('../database').knex;
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser());

module.exports = {
  events: {
    get: function (req, res) {
      knex('events').select('*').then(function(data) {
        res.send(data);
      });
    },
    post: function (req, res) {
      console.log('question')
      knex('events').insert({
          inputTitle: req.body.inputTitle,
          userId: knex('users').where({Email: req.body.Email}).select('id'),
          datetimeValue: req.body.datetimeValue,
          duration: req.body.duration,
          address: req.body.address,
          latlng: req.body.latlng
        })
        .then(function (firstData) {
          console.log('firstDat', firstData)
            knex('users_events').insert({
              EventID: firstData[0],
              UserId: knex('users').where({Email: req.body.Email}).select('id')
            })
            .then(function (data) {
              res.send(data);
            });
        });
    }
  },
  allevents: {
    get: function(req, res) {
      knex('events').select('*').innerJoin('users_events', 'events.id', 'users_events.EventID')
        .then(function(data) {
            res.send(data);
          });
    },
    post: function(req, res){

    }

  }
};
