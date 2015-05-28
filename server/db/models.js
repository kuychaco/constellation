/*
* @Author: kuychaco
* @Date:   2015-05-26 21:44:31
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-05-27 20:00:00
*_________________________________________
* Database Models
* - connect to MySQL database
* - define Sequelize models
*/

"use strict";

var Sequelize = require('sequelize');


// Connect to MySQL database
var sequelize = new Sequelize('constellation', 'root', '', {
  dialect: 'mysql'
});

// sequelize.authenticate().complete(function(err) {
//   if (err) {
//     console.log('Sequelize connection error:', err);
//   } else {
//     console.log('Sequelize connection successful');
//   }
// });

/*
* the following schemas are based on the objects returned from the github api:
* (https://api.github.com/repos/:owner/:repo/issues)
* https://api.github.com/repos/relentlessbreakfast/test/issues
*/



// table for users (foreign key for Issue - user who created issue)
var User = sequelize.define('User', {
  "login": { type: Sequelize.STRING, primaryKey: true }, //Sequelize.STRING, //"kuychaco",
  "id": Sequelize.INTEGER, //7910250,
  "avatar_url": Sequelize.STRING, //"https://avatars.githubusercontent.com/u/7910250?v=3",
  "gravatar_id": Sequelize.STRING, //"",
  "url": Sequelize.STRING, //"https://api.github.com/users/kuychaco",
  "html_url": Sequelize.STRING, //"https://github.com/kuychaco",
  "followers_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/followers",
  "following_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/following{/other_user}",
  "gists_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/gists{/gist_id}",
  "starred_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/starred{/owner}{/repo}",
  "subscriptions_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/subscriptions",
  "organizations_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/orgs",
  "repos_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/repos",
  "events_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/events{/privacy}",
  "received_events_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/received_events",
  "type": Sequelize.STRING, //"User",
  "site_admin": Sequelize.BOOLEAN //false
});

// table for labels
var Label = sequelize.define('Label', {
  "url": Sequelize.STRING, //"https://api.github.com/repos/relentlessbreakfast/test/labels/create%20database",
  "name": { type: Sequelize.STRING, primaryKey: true }, //Sequelize.STRING, //"create database",
  "color": Sequelize.STRING //"bfd4f2"
});


// Define Issue model
var Issue = sequelize.define('Issue', {
  "url": Sequelize.STRING, //"https://api.github.com/repos/relentlessbreakfast/test/issues/8",
  "labels_url": Sequelize.STRING, //"https://api.github.com/repos/relentlessbreakfast/test/issues/8/labels{/name}",
  "comments_url": Sequelize.STRING, //"https://api.github.com/repos/relentlessbreakfast/test/issues/8/comments",
  "events_url": Sequelize.STRING, //"https://api.github.com/repos/relentlessbreakfast/test/issues/8/events",
  "html_url": Sequelize.STRING, //"https://github.com/relentlessbreakfast/test/issues/8",
  "id": { type: Sequelize.INTEGER, primaryKey: true }, //Sequelize.INTEGER, //81183631,
  "number": Sequelize.INTEGER, //8,
  "title": Sequelize.STRING, //"learn bookshelf",
  // "user": {
    // "login": Sequelize.STRING, //"kuychaco",
    // "id": Sequelize.INTEGER, //7910250,
    // "avatar_url": Sequelize.STRING, //"https://avatars.githubusercontent.com/u/7910250?v=3",
    // "gravatar_id": Sequelize.STRING, //"",
    // "url": Sequelize.STRING, //"https://api.github.com/users/kuychaco",
    // "html_url": Sequelize.STRING, //"https://github.com/kuychaco",
    // "followers_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/followers",
    // "following_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/following{/other_user}",
    // "gists_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/gists{/gist_id}",
    // "starred_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/starred{/owner}{/repo}",
    // "subscriptions_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/subscriptions",
    // "organizations_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/orgs",
    // "repos_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/repos",
    // "events_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/events{/privacy}",
    // "received_events_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/received_events",
    // "type": Sequelize.STRING, //"User",
    // "site_admin": Sequelize.BOOLEAN //false
  // },
  // "labels": [
  //   {
  //     "url": Sequelize.STRING, //"https://api.github.com/repos/relentlessbreakfast/test/labels/create%20database",
  //     "name": Sequelize.STRING, //"create database",
  //     "color": Sequelize.STRING, //"bfd4f2"
  //   },
  //   {
  //     "url": Sequelize.STRING, //"https://api.github.com/repos/relentlessbreakfast/test/labels/create%20database%20-%20define%20schema",
  //     "name": Sequelize.STRING, //"create database - define schema",
  //     "color": Sequelize.STRING, //"0052cc"
  //   }
  // ],
  "state": Sequelize.STRING, //"open",
  "locked": Sequelize.BOOLEAN, //false,
  // "assignee": {
    // "login": Sequelize.STRING, //"kuychaco",
    // "id": Sequelize.INTEGER, //7910250,
    // "avatar_url": Sequelize.STRING, //"https://avatars.githubusercontent.com/u/7910250?v=3",
    // "gravatar_id": Sequelize.STRING, //"",
    // "url": Sequelize.STRING, //"https://api.github.com/users/kuychaco",
    // "html_url": Sequelize.STRING, //"https://github.com/kuychaco",
    // "followers_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/followers",
    // "following_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/following{/other_user}",
    // "gists_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/gists{/gist_id}",
    // "starred_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/starred{/owner}{/repo}",
    // "subscriptions_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/subscriptions",
    // "organizations_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/orgs",
    // "repos_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/repos",
    // "events_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/events{/privacy}",
    // "received_events_url": Sequelize.STRING, //"https://api.github.com/users/kuychaco/received_events",
    // "type": Sequelize.STRING, //"User",
    // "site_admin": Sequelize.BOOLEAN //false
  // },
  // "milestone": {
    // "url": "https://api.github.com/repos/relentlessbreakfast/test/milestones/1",
    // "html_url": "https://github.com/relentlessbreakfast/test/milestones/set%20up%20database",
    // "labels_url": "https://api.github.com/repos/relentlessbreakfast/test/milestones/1/labels",
    // "id": 1134851,
    // "number": 1,
    // "title": "set up database",
    // "description": "",
    // "creator": {
    // "login": "kuychaco",
    // "id": 7910250,
    // "avatar_url": "https://avatars.githubusercontent.com/u/7910250?v=3",
    // "gravatar_id": "",
    // "url": "https://api.github.com/users/kuychaco",
    // "html_url": "https://github.com/kuychaco",
    // "followers_url": "https://api.github.com/users/kuychaco/followers",
    // "following_url": "https://api.github.com/users/kuychaco/following{/other_user}",
    // "gists_url": "https://api.github.com/users/kuychaco/gists{/gist_id}",
    // "starred_url": "https://api.github.com/users/kuychaco/starred{/owner}{/repo}",
    // "subscriptions_url": "https://api.github.com/users/kuychaco/subscriptions",
    // "organizations_url": "https://api.github.com/users/kuychaco/orgs",
    // "repos_url": "https://api.github.com/users/kuychaco/repos",
    // "events_url": "https://api.github.com/users/kuychaco/events{/privacy}",
    // "received_events_url": "https://api.github.com/users/kuychaco/received_events",
    // "type": "User",
    // "site_admin": false
  // },
  // "open_issues": 3,
  // "closed_issues": 0,
  // "state": "open",
  // "created_at": "2015-05-26T22:15:38Z",
  // "updated_at": "2015-05-27T18:23:05Z",
  // "due_on": null,
  // "closed_at": null
  // },
  "comments": Sequelize.INTEGER, //0,
  "created_at": Sequelize.STRING, //"2015-05-26T23:29:02Z",
  "updated_at": Sequelize.STRING, //"2015-05-26T23:42:01Z",
  "closed_at": Sequelize.STRING, //null,
  "body": Sequelize.STRING //""
});

// TODO: add associations
// var Repo = sequelize.define('Repo', {

// });

// set up one-to-many association between user and issues
// this will add UserId (foreign key) to Issue
Issue.belongsTo(User);
User.hasMany(Issue);

// this will create a new model called IssueLabel (join table) with foreign keys IssueId and LabelId
Issue.belongsToMany(Label, {through: 'IssueLabel'});
Label.belongsToMany(Issue, {through: 'IssueLabel'});


sequelize.sync().then(function() {
  // console.log('tables created successfully');
  User.findOrCreate({where: exampleIssue.user})
  .spread(function(user, created) {
    console.log('#############  user:', user);
    // exampleIssue.UserId = user.dataValues.id;
    exampleIssue.UserLogin = user.dataValues.login;
    // console.log('#############  created:', created);
    delete exampleIssue['user'];
    Issue.findOrCreate({where: exampleIssue})
    .spread(function(issue, created) {
      console.log('##### ISSUE', issue);
    });
    
  });

  // Issue.findOrCreate({where: exampleIssue})
  // .spread(function(issue, created) {
  //   console.log('issue:', issue);
  //   console.log('created:', created);
  // });
  // 
  
});


module.exports.sequelize = sequelize;
module.exports.Issue = Issue;
module.exports.User = User;
module.exports.Label = Label;


var exampleIssue = {
"url": "https://api.github.com/repos/relentlessbreakfast/test/issues/8",
"labels_url": "https://api.github.com/repos/relentlessbreakfast/test/issues/8/labels{/name}",
"comments_url": "https://api.github.com/repos/relentlessbreakfast/test/issues/8/comments",
"events_url": "https://api.github.com/repos/relentlessbreakfast/test/issues/8/events",
"html_url": "https://github.com/relentlessbreakfast/test/issues/8",
"id": 81183631,
"number": 8,
"title": "learn bookshelf",
"user": {
  "login": "kuychaco",
  "id": 7910250,
  "avatar_url": "https://avatars.githubusercontent.com/u/7910250?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/kuychaco",
  "html_url": "https://github.com/kuychaco",
  "followers_url": "https://api.github.com/users/kuychaco/followers",
  "following_url": "https://api.github.com/users/kuychaco/following{/other_user}",
  "gists_url": "https://api.github.com/users/kuychaco/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/kuychaco/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/kuychaco/subscriptions",
  "organizations_url": "https://api.github.com/users/kuychaco/orgs",
  "repos_url": "https://api.github.com/users/kuychaco/repos",
  "events_url": "https://api.github.com/users/kuychaco/events{/privacy}",
  "received_events_url": "https://api.github.com/users/kuychaco/received_events",
  "type": "User",
  "site_admin": false
},
"labels": [
  {
    "url": "https://api.github.com/repos/relentlessbreakfast/test/labels/create%20database",
    "name": "create database",
    "color": "bfd4f2"
  },
  {
    "url": "https://api.github.com/repos/relentlessbreakfast/test/labels/create%20database%20-%20define%20schema",
    "name": "create database - define schema",
    "color": "0052cc"
  }
],
"state": "open",
"locked": false,
"assignee": null,
"milestone": null,
"comments": 0,
"created_at": "2015-05-26T23:29:02Z",
"updated_at": "2015-05-26T23:42:01Z",
"closed_at": null,
"body": ""
};
