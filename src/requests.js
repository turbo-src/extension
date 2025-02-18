const superagent = require('superagent');
const CONFIG = require('./config.js');

//const port = "http://localhost:4000";

//const port = "https://turbosrc-service.fly.dev"
//const port = "https://turbosrc-marialis.dev";

var url = CONFIG.url;
let clientCurrentVersion = CONFIG.currentVersion
//turboSrcID = CONFIG.turboSrcID
//const url = "http://localhost:4006/graphql"
//turboSrcID = "0x892a7abaf9f30db81e9b98f97cb3d64caccc6c27"

let turboSrcIDfromInstance;

// Running locally without devLocalRouter or devOnline,
// The hash is the reibaseID (possibly superflous in
// offline, no router configuration).

(async function () {
  if (url === 'https://turbosrc-marialis.dev') {
    url = url + '/graphql';
  }

  console.log('get turboSrcIDfromInstance');
  turboSrcIDfromInstance = await getTurboSrcIDfromInstance();
  console.log('requests turboSrcIDfromInstance:', turboSrcIDfromInstance);
})();

async function getTurboSrcIDfromInstance() {
  try {
    const res = await superagent
      .post(`${url}`)
      .send({
        query: `{ getTurboSrcIDfromInstance }`
      })
      .set('accept', 'json');

    const json = JSON.parse(res.text);
    if (!json.data) {
      console.error('Received no data. Response:', json);
      return null;
    }
    return json.data.getTurboSrcIDfromInstance; // return turboSrcID directly from data
  } catch (error) {
    console.error('An error occurred while fetching the turboSrcIDfromInstance:', error);
    return null;
  }
}

async function getTurboSrcSystemInfo(repoName, clientCurrentVersion) {
  console.log('getTurboSrcSystemInfo', 'clientCurrentVersion', clientCurrentVersion);
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{getTurboSrcSystemInfo(turboSrcID: "${turboSrcID}", clientCurrentVersion: "${clientCurrentVersion}")}`
    })
    .set('accept', 'json');

  const json = JSON.parse(res.text);

  //console.log('Egress\ngetTurboSrcSystemInfo clientIsCompatibleWithRouter', clientIsCompatibleWithRouter);
  //console.log('Egress\ngetTurboSrcSystemInfo isCompatibleTurboSrcID', isCompatibleTurboSrcID);
  //console.log('Egress\ngetTurboSrcSystemInfo message', message);

  // Assuming you need to return clientIsCompatibleWithRouter and message based on the previous function signature
  return json.data.getTurboSrcSystemInfo;
}

async function getTurboSrcIDFromRepoName(reponame) {
  console.log('getTurboSrcIDFromRepoName reponame', reponame);
  if (url === 'http://localhost:4000/graphql') {
    console.log('local\ngetTurboSrcIDFromRepoName turboSrcID', turboSrcIDfromInstance);
    return turboSrcIDfromInstance;
  } else {
    const res = await superagent
      .post(`${url}`)
      .send({
        query: `{ getTurboSrcIDFromRepoName(reponame: "${reponame}") }`
      })
      .set('accept', 'json');

    const json = JSON.parse(res.text);
    const turboSrcID = json.data.turboSrcID;
    console.log('Egress\ngetTurboSrcIDFromRepoName turboSrcID', turboSrcID);
    return turboSrcID; // return turboSrcID directly from data
  }
}

async function getTurboSrcIDFromRepoID(repoID) {
  console.log('getTurboSrcIDFromRepoID repoID', repoID);
  if (url === 'http://localhost:4000/graphql') {
    console.log('local\ngetTurboSrcIDFromRepoID turboSrcID', turboSrcIDfromInstance);
    return turboSrcIDfromInstance;
  } else {
    const res = await superagent
      .post(`${url}`)
      .send({
        query: `{ getTurboSrcIDFromRepoID(repoID: "${repoID}") }`
      })
      .set('accept', 'json');

    const json = JSON.parse(res.text);
    console.log('getTurboSrcIDFromRepoID json\n', json)
    const turboSrcID = json.data.turboSrcID;
    console.log('Egress\ngetTurboSrcIDFromRepoID turboSrcID', turboSrcID);
    return turboSrcID; // return turboSrcID directly from data
  }
}

async function postCreateUser(owner, repo, contributor_id, contributor_name, contributor_signature, token) {
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ createUser(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") }`
    })
    .set('accept', 'json');

  const json = JSON.parse(res.text);
  return json.data.createUser;
}

// deprecated
async function postGetContributorName(owner, repo, defaultHash, contributor_id) {
  console.warn('Deprecated of unused function called, postGetContributorName.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getContributorName(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  console.log('gqlr 123');
  const json = JSON.parse(res.text);
  console.log(json);
  return json.data.getContributorName;
}

// Uses real owner. Will switch to repoID in future.
async function postGetContributorID(owner, repo, defaultHash, contributor_name) {
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getContributorID(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_name: "${contributor_name}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  console.log('gqlr 123');
  const json = JSON.parse(res.text);
  console.log(json);
  return json.data.getContributorID;
}

// Unused but not deprecated.
async function postGetContributorSignature(owner, repo, defaultHash, contributor_id) {
  console.warn('Deprecated of unused function called, postGetContributorSignature.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getContributorSignature(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  console.log('gqlr 145');
  const json = JSON.parse(res.text);
  console.log(json);
  return json.data.getContributorSignature;
}

// Takes real owner and repo
async function postFindOrCreateUser(owner, repo, contributor_id, contributor_name, contributor_signature, token) {
  const repoName = `${owner}/${repo}`;
  var turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }

  // Checking if user is an instance owner and owns the repo on Github.
  // If so, we route to their instance via turboSrcID.
  const myTurboSrcID = CONFIG.myTurboSrcID;
  const instanceOwner = CONFIG.myGithubName;
  console.log('is a instance and repo owner');
  console.log('myTurboSrcID', myTurboSrcID);
  console.log('Checking if an instance and repo owner');
  if (myTurboSrcID && owner == instanceOwner) {
    turboSrcID = myTurboSrcID;
    console.log('is a instance and repo owner');
    console.log('myTurboSrcID', myTurboSrcID);
    console.log('owner', owner + '==' + instanceOwner);
  }

  console.log('extension findOrCreateUser called ', turboSrcID, typeof turboSrcID);
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ findOrCreateUser(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") {contributor_name, contributor_id, contributor_signature, token}}`
    })
    .set('accept', 'json');
  const json = JSON.parse(res.text);
  return json.data.findOrCreateUser;
}

// Takes real owner and repo.
async function postCheckGithubTokenPermissions(owner, repo, contributor_name, token) {
  const repoName = `${owner}/${repo}`;
  var turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  console.log('extension check permissions called');
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ checkGithubTokenPermissions(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", contributor_name: "${contributor_name}", token: "${token}") { public_repo_scopes, push_permissions }}`
    })
    .set('accept', 'json');
  const json = JSON.parse(res.text);
  return json.data.checkGithubTokenPermissions;
}

// Takes real owner and repo.
async function postCreateRepo(owner, repo, defaultHash, contributor_id, side, token) {
  const repoName = `${owner}/${repo}`;
  var turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }

  // Checking if user is an instance owner and owns the repo on Github.
  // If so, we route to their instance via turboSrcID.
  const myTurboSrcID = CONFIG.myTurboSrcID;
  const instanceOwner = CONFIG.myGithubName;
  console.log('is a instance and repo owner');
  console.log('myTurboSrcID', myTurboSrcID);
  console.log('owner', owner + '==' + instanceOwner);
  console.log('Checking if an instance and repo owner');
  if (myTurboSrcID && owner == instanceOwner) {
    turboSrcID = myTurboSrcID;
    console.log('is a instance and repo owner');
    console.log('myTurboSrcID', myTurboSrcID);
    console.log('owner', owner + '==' + instanceOwner);
  }

  console.log('extension create repo called');
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ createRepo(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", token: "${token}") {status, repoName, repoID, repoSignature, message} }`,
    })
    .set('accept', 'json');

  const json = JSON.parse(res.text);

  return json.data.createRepo;
}

// Take repoID
async function postGetVotePowerAmount(owner, repo, defaultHash, contributor_id, side, token) {
  console.log('postGetVotePowerAmount', 'repoID', repo)
  const repoID = repo;
  const turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getVotePowerAmount(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", token: "${token}") { status, amount } }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body

    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  console.log(json);
  return json.data.getVotePowerAmount;
}

// Takes repoID
async function postTransferTokens(owner, repo, from, to, amount, token) {
  const repoID = repo;
  const turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ transferTokens(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", from: "${from}", to: "${to}", amount: ${amount}, token: "${token}") { status, repo, from, to, amount, createdAt, network, id } }`
      }
      //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  return json.data.transferTokens;
}

// deprecated
async function postNewPullRequest(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postGetNewPullRequest.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ newPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json')
    .end((err, res) => {
      // Calling the end function will send the request
    });
}

// Takes repoID
async function postSetVote(owner, repo, defaultHash, childDefaultHash, mergeable, contributor_id, side, token) {
  console.log('postSetVote', 'repoID', repo)
  const repoID = repo;
  const turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ setVote(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", mergeable: ${mergeable}, contributor_id: "${contributor_id}", side: "${side}", token: "${token}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //   .end((err, res) => {
  //      Calling the end function will send the request
  //   });
  const json = JSON.parse(res.text);
  return json.data.setVote;
}

// deprecated
async function getRepoStatus(repo_id) {
  console.warn('Deprecated of unused function called, getRepoStatus.')
  const repoID = repo_id;
  const turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ getRepoStatus(turboSrcID: "${turboSrcID}", repo_id: "${repo_id}" ) { status, exists } }`
    })
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  return json.data.getRepoStatus;
}

// Deprecated
async function get_authorized_contributor(contributor_id, repo_id) {
  console.warn('Deprecated of unused function called, get_authoried_contributor.')
  const repoID = repo_id;
  const turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ getAuthorizedContributor(turboSrcID: "${turboSrcID}", contributor_id: "${contributor_id}", repo_id: "${repo_id}") }`
    })
    .set('accept', 'json');
  const json = JSON.parse(res.text);
  return json.data.getAuthorizedContributor;
}

// Not used but not deprecated.
async function postPullFork(owner, repo, issue_id, contributor_id) {
  console.warn('Deprecated of unused function called, postPullFork.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  return await superagent
    .post('http://localhost:4001/graphql')
    .send({
      query: `{ getPRfork(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}") }`
    }) // sends a JSON post body
    .set('accept', 'json');
}

// Not used but not deprecated.
async function postGetPRforkStatus(owner, repo, issue_id, contributor_id) {
  console.warn('Deprecated of unused function called, postGetPRforkStatus.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ getPRforkStatus(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}") }`
    }) // sends a JSON post body
    .set('accept', 'json');
  //const resJSON = JSON.parseFromString(res.text)
  //console.log(resJSON)
  //return resJSON.data.getPRforkStatus
  const json = JSON.parse(res.text);
  return json.data.getPRforkStatus;
}

// Not used (deprecated?)
async function postGetPullRequest(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postGetPullRequest.')
  const repoName = `${owner}/${repo}`;
  var turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  console.log('extension getPullRequest called ', turboSrcID, typeof turboSrcID);
  console.log(owner, repo, defaultHash, contributor_id, side);
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ getPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") { status, state, repo_id, fork_branch, defaultHash, childDefaultHash, mergeableCodeHost } }`
    })
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  return json.data.getPullRequest;
}

// Deprecated.
async function postGetPRpercentVotedQuorum(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postGetPRpercentVotedQuorum.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getPRvoteTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  console.log(json);
  return json.data.percentVotedQuorum;
}

// Deprecated.
async function postGetPRvoteTotals(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postGetPRvoteTotals.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getPRvoteTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  console.log(json);
  return json.data.getPRvoteTotals;
}

// Deprecated.
async function postGetPRvoteYesTotals(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postGetPRvoteYesTotals.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getPRvoteYesTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  //console.log(json)
  return json.data.getPRvoteYesTotals;
}

// Deprecated.
async function postGetPRvoteNoTotals(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postGetPRvoteNoTotals.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  const res = await superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ getPRvoteNoTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  //console.log(json)
  return json.data.getPRvoteNoTotals;
}

// Deprecated.
async function postClosePullRequest(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postClosePullRequest.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ closePullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json')
    .end((err, res) => {
      // Calling the end function will send the request
    });
}

// Deprecated.
async function postMergePullRequest(owner, repo, defaultHash, contributor_id, side) {
  console.warn('Deprecated of unused function called, postMergePullRequest.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ mergePullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
      }
      //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json')
    .end((err, res) => {
      // Calling the end function will send the request
    });
}

// Deprecated.
async function postCreatePullRequest(owner, repo, fork_branch, issue_id, title) {
  console.warn('Deprecated of unused function called, postCreatePullRequest.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      {
        query: `{ createPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", fork_branch: "${fork_branch}", pr_id: "${issue_id}", title: "${title}") }`
      }
      //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json')
    .end((err, res) => {
      // Calling the end function will send the request
    });
}

// Unused, but not deprecated.
async function postFork(owner, repo, org) {
  console.warn('Deprecated of unused function called, postFork.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  superagent
    .post(`${url}`)
    .send(
      //{ query: '{ name: 'Manny', species: 'cat' }' }
      //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
      //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
      //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
      //{ query: `{ getVoteEverything }` }
      { query: `{ fork(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", org: "${org}") }` }
      //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
    ) // sends a JSON post body
    .set('accept', 'json')
    .end((err, res) => {
      // Calling the end function will send the request
    });
}

// Deprecated.
async function getGitHubPullRequest(owner, repo, defaultHash, contributor_id) {
  console.warn('Deprecated of unused function called, getGitHubPullRequest.')
  const repoName = `${owner}/${repo}`;
  const turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  console.log('get github pr called', defaultHash, contributor_id);
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ getGitHubPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") { status, mergeable, mergeCommitSha, state, baseBranch } }`
    })
    .set('accept', 'json');
  //.end((err, res) => {
  // Calling the end function will send the request
  //});
  const json = JSON.parse(res.text);
  return json.data.getGitHubPullRequest;
}

// Takes repoID.
async function postGetRepoData(repo_id, contributor_id) {
  console.log('postGetRepoDatal repoID: ' + repo_id)
  const repoID = repo_id;
  const turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  console.log('extension postGetRepoData called');
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ getRepoData(turboSrcID: "${turboSrcID}", repo_id: "${repo_id}", contributor_id: "${contributor_id}")
    {
      status,
      repo_id,
      owner,
      contributor_id,
      head,
      inSession,
      quorum,
      contributor {
        contributor_id,
        contributor,
        votePower,
      },
    pullRequests {
      state,
      repo_id,
      issue_id,
      title,
      forkBranch,
      baseBranch,
      defaultHash,
      childDefaultHash,
      head,
      defaultHash,
      remoteURL
    voteData {
      contributor {
      contributor_id,
      voted,
      side,
      votePower,
      createdAt,
      },
    voteTotals {
      yesPercent,
      noPercent,
      totalVotes,
      totalYesVotes,
      totalNoVotes,
    },
    votes {
      contributor_id,
      side,
      votePower,
      createdAt
    }
  }
}
}
}`
    })
    .set('accept', 'json');
  const json = JSON.parse(res.text);
  console.log(json.data.getRepoData);
  return json.data.getRepoData;
}

// Takes repoID.
async function postGetVotes(repo, defaultHash, contributor_id) {
  console.log('postGetVotes', 'repoID', repo)
  const repoID = repo;
  const turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
  }
  const res = await superagent
    .post(`${url}`)
    .send({
      query: `
      { getVotes(turboSrcID: "${turboSrcID}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id:"${contributor_id}")
      { status, repo_id, title, head, remoteURL, baseBranch, forkBranch, childDefaultHash, defaultHash, mergeable, state
        voteData {
          contributor {
            voted, side, votePower, createdAt, contributor_id
          },
          voteTotals {
            totalVotes, totalYesVotes, totalNoVotes, votesToQuorum, votesToMerge, votesToClose, totalVotePercent, yesPercent, noPercent, quorum
          },
          votes { contributor_id, side, votePower, createdAt }
          },
        }
}
    `
    })
    .set('accept', 'json');
  const json = JSON.parse(res.text);
  return json.data.getVotes;
}

// Takes repoID or repoName.
async function getNameSpaceRepo(repoNameOrID) {
  console.log('getNameSpaceRepo repoNameOrID: ' + repoNameOrID)
  const isValidEthereumAddress = (address) => {
    try {
      const regex = /^0x[a-fA-F0-9]{40}$/;
      return regex.test(address);
    } catch (e) {
      console.error(`Failed to check if provided string is a valid Ethereum address. Error: ${e.message}`);
      console.error(e.stack);
      return false;
    }
  }

  let turboSrcID;
  if (isValidEthereumAddress(repoNameOrID)) {
    let repoID = repoNameOrID;
    turboSrcID = await getTurboSrcIDFromRepoID(repoID);
  } else {
    let repoName = repoNameOrID;
    turboSrcID = await getTurboSrcIDFromRepoName(repoName);
  }

  console.log('getNameSpaceRepo turboSrcID: ' + turboSrcID)

  if (turboSrcID == null || turboSrcID === 'null') {
    turboSrcID = turboSrcIDfromInstance;
    console.log('getNameSpaceRepo default turboSrcID: ' + turboSrcID)
  }

  const res = await superagent
    .post(`${url}`)
    .send({
      query: `{ getNameSpaceRepo(turboSrcID: "${turboSrcID}", repoNameOrID: "${repoNameOrID}") {status, repoName, repoID, repoSignature, message}}`
    })
    .set('accept', 'json');
  const json = JSON.parse(res.text);
  return json.data.getNameSpaceRepo;
}

export {
  getTurboSrcIDFromRepoName,
  postCreateUser,
  postGetContributorName,
  postGetContributorID,
  postGetContributorSignature,
  postCheckGithubTokenPermissions,
  postFindOrCreateUser,
  postCreateRepo,
  postGetVotePowerAmount,
  postTransferTokens,
  postNewPullRequest,
  postSetVote,
  getRepoStatus,
  get_authorized_contributor,
  postPullFork,
  postGetPRforkStatus,
  postGetPullRequest,
  postGetPRpercentVotedQuorum,
  postGetPRvoteTotals,
  postGetPRvoteYesTotals,
  postGetPRvoteNoTotals,
  postMergePullRequest,
  postCreatePullRequest,
  postFork,
  getGitHubPullRequest,
  postGetRepoData,
  postGetVotes,
  getNameSpaceRepo,
  getTurboSrcSystemInfo
};
