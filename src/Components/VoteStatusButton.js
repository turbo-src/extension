import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { postGetPullRequest, postGetPRvoteYesTotals, postGetPRvoteNoTotals } from '../requests';
import commonUtil from '../utils/commonUtil';
import mathUtil from '../utils/mathUtil';
import { Button } from 'react-bootstrap';

export default function VoteStatusButton(props){

    const [user, setUser] = useState(props.user);
    const [repo, setRepo] = useState(props.repo);
    const [issueID, setIssueID] = useState(props.issueID);
    const [contributorID, setContributorID] = useState(props.contributorID);
    const [voteStatusButton, setVoteStatusButton] = useState({ color: 'gray', text: '?' });
    let [tsrcPRStatus, setTsrcPRStatus] = useState(props.tsrcPRstatus);
    const [voteYesTotalState, setVoteYesTotalState] = useState(0.0);
    const [voteNoTotalState, setVoteNoTotalState] = useState(0.0);
    const [voteTotals, setVoteTotals] = useState(0);
    const [side, setSide] = useState(props.side);
    const [clicked, setClicked] = useState(props.clicked);
    const buttonStyle = {
      '': ['lightgreen', 'vote'],
      'pre-open': ['green', voteTotals],
      open: ['orchid', voteTotals],
      conflict: ['orange', 'conflict'],
      merge: ['darkorchid', 'merged'],
      close: ['red', 'closed']
    };

    useEffect(() => {
      const fetchVoteStatus = async () => {
      let textMath = voteStatusButton.textMath;
      try {
        setTsrcPRStatus = await postGetPullRequest(
          user,
          repo,
          issueID,
          contributorID,
          side
          );
        const voteYesTotal = await postGetPRvoteYesTotals(
          user,
          repo,
          issueID,
          contributorID,
          ""
        );
        const voteNoTotal = await postGetPRvoteNoTotals(
          user,
          repo,
          issueID,
          contributorID,
          ""
        );
        const resYes = mathUtil.votePercentToMergeInteger(voteYesTotal);
        const resNo = mathUtil.votePercentToMergeInteger(voteNoTotal);
        if (resYes !== null && resNo !== null) {
          textMath = resYes / 2 + resNo / 2;
          setVoteTotals(`${textMath}%`);
        }
        setVoteYesTotalState(voteYesTotal);
        setVoteNoTotalState(voteNoTotal);
        console.log('tsrcPRStatus:', tsrcPRStatus)
        console.log('voteYesTotal:', voteYesTotal)
        console.log('voteNoTotal:', voteNoTotal)
        console.log('resYes:', resYes)
        console.log('resNo:', resNo)
        console.log('textMath:', textMath)
      } catch (error) {
        console.log('fetchVoteStatus error:', error)
        textMath = "";
      }
        };

        fetchVoteStatus();
    }, [clicked]);

    useEffect(() => {
    const buttonColor = buttonStyle[tsrcPRStatus.state][0]
    const buttonText = buttonStyle[tsrcPRStatus.state][1]
    console.log('buttonColor:', buttonColor)
    console.log('buttonText:', buttonText)
    setVoteStatusButton({color: buttonColor, text: buttonText});
    }, [voteYesTotalState, voteNoTotalState, props.tsrcPRstatus, voteTotals]);

    const handleClick = (e) => {
        e.preventDefault();
    };

    return (
        <Button
        style={{ color: 'white', background: voteStatusButton.color }}
        onClick={handleClick}
        >
        {voteStatusButton.text}
        </Button>
    );
};
