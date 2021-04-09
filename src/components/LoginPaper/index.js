import React, { useState, useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Modal from '@material-ui/core/Modal';

import { useStyles } from '../style.js';
import { Button } from '@material-ui/core';

import Firebase from '../../utils/firebase';

import { loggedInUser, setUser } from '../../utils/userState';

const LoginPaper = () => {

    const classes = useStyles();

    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");

    useEffect(() => {
        setEmailError("");
        setPasswordError("");
        setPasswordConfirmError("");
    }, [showRegisterModal])

    useEffect(() =>{
        authListener();
    }, [])

    function login() {
        Firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {
                switch(error.code){
                    case "auth/invalid-email":
                    case "auth/user-disabled":
                    case "auth/user-not-found":
                        setEmailError(error.message);
                        break;
                    case "auth/wrong-password":
                        setPasswordError(error.message);
                }
            });
    }

    function authListener() {
        Firebase.auth().onAuthStateChanged(user => {
            if(user){
                setUser(user);
            }
            else{
                setUser(null);
            }
        });
    }

    function register() {
        if (password === passwordConfirm) {
            Firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(error => {
                switch(error.code){

                    case "auth/email-already-in-use":
                    case "auth/invalid-email":
                        setEmailError(error.message);
                        break;
                    case "auth/weak-password":
                        setPasswordError(error.message);
                    
                }
            });
        }
        else {
            setPasswordError("Passwords Do Not Match");
            setPasswordConfirmError("Passwords Do Not Match");
        }
    }

    return (
        <React.Fragment>

            <Paper className={classes.loginPaper} >

                <form className={classes.form}>
                    <TextField error={emailError === "" ? false : true} helperText={ emailError } className={classes.formTextfield} id="emailLogin" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} />
                    <TextField error={passwordError === "" ? false : true} helperText={ passwordError } className={classes.formTextfield} id="passwordLogin" type="password" label="Password" variant="outlined" onChange={(event) => setPassword(event.target.value)} />

                    <Button style={{ margin: 18, width: '30ch', marginBottom: 10 }} variant="contained" color="primary" onClick={login}>
                        Login
                    </Button>

                </form>

                <Link color={"primary"} className={classes.registerText} href="#" onClick={(e) => { e.preventDefault(); setShowRegisterModal(true) }} >
                    Dont Have An Account? Register
            </Link>

            </Paper>

            {showRegisterModal && <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={true}
                onClose={() => setShowRegisterModal(false)}
            >
                <div className={classes.modalContent}>

                    <Paper className={classes.loginPaper} >

                        <form className={classes.form}>
                            <TextField error={emailError === "" ? false : true} helperText={ emailError } className={classes.formTextfield} id="emailRegister" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} />
                            <TextField error={passwordError === "" ? false : true} helperText={ passwordError } className={classes.formTextfield} id="passwordRegister" type="password" label="Password" variant="outlined" onChange={(event) => setPassword(event.target.value)} />
                            <TextField error={passwordConfirmError === "" ? false : true} helperText={ passwordConfirmError } className={classes.formTextfield} id="passwordRegisterConfirm" type="password" label="Confirm Password" variant="outlined" onChange={(event) => setPasswordConfirm(event.target.value)} />


                            <Button style={{ margin: 18, width: '30ch', marginBottom: 0 }} variant="contained" color="primary" onClick={register}>
                                Register
                            </Button>

                        </form>

                    </Paper>
                </div>

            </Modal>}
        </React.Fragment>

    );
}

export default LoginPaper;