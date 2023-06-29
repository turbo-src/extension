import React, { useState, useEffect } from 'react';
import VoteTotal from './VoteTotal';
import styled from 'styled-components';
import VotesTable from './VotesTable';
import VoteTotalResults from './VoteTotalResult';
import VoteButtonGroup from './VoteButtonGroup';
import VoteText from './VoteText';
const ModalContent = styled.div`
background-color: #fff;
margin: auto;
padding: 0 9px 20px 9px;
height: 420px;
width: 400px;
text-align: center;
`;

const SinglePullRequestView = ({ pullRequests, repo_id, title, votesArray, state, baseBranch, forkBranch, yes, no, yesVotes, noVotes, createdAt, votePower, alreadyVoted }) => {
  let issue_id = ""
  let contributor_id = ""
  let contributor_name = ""
  let vote_totals = ""
  let githubUser = "";

  const quorum = 0.5;
  let toggleModal = "";
  const [disabled, setDisabled] = useState(false);
  const [voted, setVoted] = useState(voted);
  const [user, setUser] = useState("");
  const [chosenSide, setChosenSide] = useState(''); //we need this in the res under contributor
  const [totalPercent, setTotalPercent] = useState(0); 
  const voteableStates = new Set(['vote', 'pre-open', 'open']);
  const notVoteableStates = new Set(['conflict', 'merge', 'close']);
  const [clickVoteHandler, setClickVoteHandler] = useState(false);
  /* this block of useState calls are waiting for the rest of the response to be given. eventually we will be able to vote from the extension. */

  
  return (
    <ModalContent>

      <VoteTotal
        user={user}
        repo={repo_id}
        issueID={issue_id}
        contributorID={contributor_id}
        contributorName={contributor_name}
        voteTotals={vote_totals}
        
        title={title}
        forkBranch={forkBranch}
        yesVotes={yesVotes}
        noVotes={noVotes}
        votePower={votePower}
        baseBranch={baseBranch}
        toggleModal={toggleModal}
        id="vote-total-main"
      >
        <h2>Vote Total</h2>
      </VoteTotal>

      <VoteText disabled={disabled} voted={voted} chosenSide={chosenSide} userVotedAt={createdAt} />

      <VoteButtonGroup
        disabled={disabled}
        setDisabled={setDisabled}
        voted={voted}
        setVoted={setVoted}
        clickVoteHandler={clickVoteHandler}
        setClickVoteHandler={setClickVoteHandler}
        chosenSide={chosenSide}
        setChosenSide={setChosenSide}
        user={user}
        repo={repo_id}
        issueID={issue_id}
        contributorID={contributor_id}
        contributorName={contributor_name}
        voteTotals={vote_totals}
        githubUser={githubUser}
      />
      <VoteTotalResults
        totalPercent={totalPercent}
        yesPercent={yes}
        noPercent={no}
        yesVotes={yesVotes}
        noVotes={noVotes}
        totalVotes={yesVotes + noVotes}
        quorum={quorum}
        id="vote-total-results"
      />
      <VotesTable allVotes={votesArray} />
  </ModalContent>
  );
};

export default SinglePullRequestView;