/* 
* @Author: kuychaco
* @Date:   2015-05-26 22:23:17
* @Last Modified by:   kuychaco
* @Last Modified time: 2015-05-27 15:13:27
*/

'use strict';

var Issue = require('./models').Issue;

// post a new issue
module.exports.postIssue = function(req, res, next) {

  /*
  * 
  * (https://api.github.com/repos/:owner/:repo/issues)
  */

  // check if issue exists and if not, create it
  Issue.create(issue).then(function(issue) {
    console.log('created issue:', node);
  });


  // req will be 
};

// get all issues
module.exports.getAllIssues = function(req, res) {

};

// get a single issue
module.exports.getOneIssue = function(req, res) {

};

module.exports.postIssue();


var issue = {
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