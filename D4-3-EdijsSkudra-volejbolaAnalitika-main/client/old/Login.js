import React from "react";
import { firebase } from "./firebase";
import { Flex, Image } from "@chakra-ui/react";
import googleSignInButtonImg from "./google_btn.png";
import logo from "./Logo.PNG";

var provider = new firebase.auth.GoogleAuthProvider();

export function Login() {
  function onLogin() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(token, user);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode, errorMessage);
      });
  }
  return (
    <div className="Login">
      <Flex align="center" justify="center" height="90vh" direction="column">
        <Image src={logo} alt="" />
        <button type="button" onClick={onLogin}>
          <Image width="200px" src={googleSignInButtonImg} alt="" />
        </button>
      </Flex>
    </div>
  );
}
