"use client";
import React from "react";
import { FaGithub } from "react-icons/fa";

const GitHubBtn = () => {
  const signInWithGithubHandler = () => {
    const githubAuth = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/github`;
    window.open(githubAuth, "_self");
  };

  return (
    <div className="form-group">
      <button
        className="btn siweBtn"
        type="button"
        name="sign-in-github"
        onClick={signInWithGithubHandler}
      >
        SIGN IN With GitHub <FaGithub />
      </button>
    </div>
  );
};

export default GitHubBtn;
