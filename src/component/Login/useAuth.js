import React from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../firebaseConfig";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { createContext } from "react";
import { useContext } from 'react';
import { useEffect } from 'react';
import { Route,Redirect } from "react-router-dom";

firebase.initializeApp(firebaseConfig)
const AuthContext =createContext();

 export const AuthContextProvider =(props) =>{
    const auth=Auth()
    return <AuthContext.provider value={auth}>{props.children}</AuthContext.provider>
}
 export const useAuth=()=> useContext(AuthContext);

  export const  PrivateRoute=({ children, ...rest })=> {
     const auth=useAuth()
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

 const getUser=user=>{
    const {displayName,email,photoURL}=user;
    return {name: displayName,email,photo: photoURL};
 }


const Auth= ()=>{

    const [user, setUser]=useState(null);
    

     const signInWithGoogle=()=>{
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider)
         .then(res=> {
             const signedInUser = getUser(res.user)
           
            setUser(signedInUser);
            return res.user;
         })
         .catch(err=>{
             console.log(err);
             setUser(null)
             return err.message;
         })
     }
     const signOut =()=>{
       return firebase.auth().signOut().then(function() {
            setUser(null)
            return true;
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
            console.log(error)
            return false;
          });
     }
     useEffect(()=>{
         firebase.auth().onAuthStateChanged(function(usr){
             if(usr){
                // user is sign in
                const currUser =getUser(usr)
                setUser(currUser)
             }
             else{
                // no  user is sign in
             }
         });
     },[])

     return {
         user,
         signInWithGoogle,
         signOut
     }
}

export default Auth;