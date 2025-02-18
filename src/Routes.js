import React from 'react';
import { Routes as Switch, BrowserRouter, Route } from 'react-router-dom';
import Header from './Components/Extension/Nav/Header';
import Auth from './Components/Extension/Auth';
import Transfer from './Components/Extension/Transfer/Transfer';
import Success from './Components/Extension/Create/Success';
import Nav from './Components/Extension/Nav/Nav';
import Account from './Components/Extension/Account/Account';
import Onboard from './Components/Extension/Create/CreateRepo';
import Home from './Components/Extension/Home/Home';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from './store/auth';
import { setRepo } from './store/repo';
import { useEffect, useState } from 'react';
import superagent from 'superagent';
import { postFindOrCreateUser} from './requests';

export default function Routes(props) {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setRepo(props.currentRepo))
    },[])

  //Same values:
  //ethereumAddress === contributor_id
  //ethereumKey === contributor_signature
  let [user, setUser] = useState('');
  useEffect(() => {
    if (auth.isLoggedIn) {
      return;
    }
    chrome.storage.local.get(['turbosrcUser'], data => setUser(data.turbosrcUser));
  });

  useEffect(() => {
    const findOrCreateUser = async function(owner, repo, contributor_id, contributor_name, contributor_signature, token) {
      return await postFindOrCreateUser(owner, repo, contributor_id, contributor_name, contributor_signature, token).then(res => res)
    }
    if (auth.isLoggedIn && auth.user.ethereumAddress !== 'none' && auth.user.ethereumKey !== 'none') {
      return;
    } else if (user) {
      let githubUser = JSON.parse(user);
      // Pass 'owner' and 'repo' if on a git repo page. If not, pass owner and repo as "7db9a" and "demo".
      console.log('current repo ', props.currentRepo.message)
      findOrCreateUser(
      props.currentRepo?.message === 'Not Found' ? 'reibase' : props.currentRepo.owner.login,
      props.currentRepo?.message === 'Not Found' ? 'marialis' : props.currentRepo.name,
      'none',
      githubUser.login,
      'none',
      githubUser.token
      )
      .then(res => {
        githubUser.ethereumAddress = res.contributor_id,
        githubUser.ethereumKey = res.contributor_signature});
        dispatch(setAuth(githubUser));
    }
  }, [user]);

  return auth.isLoggedIn ? (
    <BrowserRouter>
      <div className="container">
        <Header />
        <Switch>
          <Route exact path="/popup.html" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/settings" element={<Account />} />
          <Route exact path="/onboard" element={<Onboard />} />
          <Route exact path="/account" element={<Account />} />
          <Route exact path="/transfer" element={<Transfer />} />
          <Route exact path="/success" element={<Success />} />
        </Switch>
        <Nav />
      </div>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <div className="container">
        <Header />
        <Switch>
          <Route exact path="/popup.html" element={<Auth />} />
          <Route exact path="/home" element={<Auth />} />
          <Route exact path="/onboard" element={<Onboard />} />
          <Route exact path="/account" element={<Auth />} />
          <Route exact path="/transfer" element={<Transfer />} />
          <Route exact path="/success" element={<Success />} />
        </Switch>
        <Nav />
      </div>
    </BrowserRouter>
  );
}