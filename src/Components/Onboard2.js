import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import loadergif from '../loader.gif';
import Loader from './Loader';
import Fail from './Fail';
import Success from './Success';
export default function Onboard2() {
  let user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  //For testing
  let repo = 'Nixpckgs';
  let currency = 'nix';

  let [failed, setFailed] = useState(false);
  let [apiKey, setApiKey] = useState('');
  let [loader, setLoader] = useState(false);
  let [checking, setChecking] = useState(false);
  let [verified, setVerified] = useState(false);
  let [successful, setSuccessful] = useState(false);
  let [length, setLength] = useState(false);

  const changeHandler = e => {
    e.preventDefault();
    setApiKey(e.target.value);
    if (e.target.value.length) {
      setLength(true);
      setChecking(true);
      setTimeout(() => {
        setChecking(false);
        if (e.target.value === 'ghp_123') {
          setVerified(true);
        } else {
          setVerified(false);
        }
      }, 1000);
    } else {
      setLength(false);
      setVerified(false);
      setChecking(false);
    }
  };

  const submitHandler = () => {
    if (verified) {
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        setSuccessful(true);
      }, 2000);
    }
  };

  useEffect(() => {
    if (user.ethereumAddress === 'none' || user.ethereumKey === 'none') {
      navigate('/ethereum');
    }
  });

  if (loader) {
    return <Loader />;
  }
  if (failed) {
    return <Fail setFailed={setFailed} repo={repo} />;
  }
  if (successful) {
    return <Success currency={currency} repo={repo} />;
  }

  return (
    <div className="content">
      <div className="">
        <span className="bold">Tokenize NixPckgs</span>
        <span>Tokenizing NixPckgs will automatically create 100,000,000 tokens.</span>

        <form name="apikey" onSubmit={() => submitHandler()}>
          <div className="apiKey">
            <span className="">Enter your Personal Access Token for Nixpckgs</span>
            <span className="">
              <input
                type="text"
                name="apikey"
                placeholder="ghp_123"
                value={apiKey}
                onChange={e => changeHandler(e)}
                required
              ></input>
              {checking ? (
                <img src={loadergif}></img>
              ) : verified ? (
                <img src="../../icons/success.png"></img>
              ) : length ? (
                <img src="../../icons/incorrect.png"></img>
              ) : (
                <img src="../../icons/warning.png"></img>
              )}
            </span>
          </div>
          <span className="items-center">
            <button type="submit" className="startButton">
              Review and Submit
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}
