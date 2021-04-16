import React, { useState, useEffect } from 'react';

import {
    Paper,
    TextField,
    Link,
    Modal,
    Button
} from '@material-ui/core';

import { Redirect } from 'react-router-dom';

import Firebase from '../../utils/firebase';

import { loggedInUser, setUser } from '../../utils/userState';

import { useStyles } from '../style.js';

const LoginPaper = () => {

    const classes = useStyles();

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");

    const [resetPasswordEmail, setResetPasswordEmail] = useState("")
    const [resetPasswordEmailError, setResetPasswordEmailError] = useState("")

    useEffect(() => {
        setEmailError("");
        setPasswordError("");
        setPasswordConfirmError("");
    }, [showRegisterModal])

    useEffect(() => {
        authListener();
    }, [])

    function login() {
        Firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {
                switch (error.code) {
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
            if (user) {
                setUser(user);
            }
            else {
                setUser(null);
            }
        });
    }

    function register() {
        if (password === passwordConfirm) {
            Firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .catch(error => {
                    switch (error.code) {

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

    function resetPassword(e) {
        e.preventDefault()
        setResetPasswordEmailError("")
        if (resetPasswordEmail !== "") {
            Firebase
                .auth()
                .sendPasswordResetEmail(resetPasswordEmail).then(function () {
                    alert("Reset Password Link Sent To Email. Please Check Your Junk Folder As Well")
                }).catch(function (error) {
                    setResetPasswordEmailError(error.message)
                });
        }
        else {

            setResetPasswordEmailError("Please Enter Email")
        }
    }

    function checkLoggedIn() {
        if (loggedInUser.use() !== null) {
            return <Redirect to='/admin' />;
        }
    }

    return (
        <React.Fragment>
            {checkLoggedIn()}
            <Paper className={classes.centerPaper} elevation={10}>

                <form className={classes.form}>
                    <TextField id={"emailLogin"} error={emailError === "" ? false : true} helperText={emailError} className={classes.formTextfield} label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} />
                    <TextField id={"passwordLogin"} error={passwordError === "" ? false : true} helperText={passwordError} className={classes.formTextfield} type="password" label="Password" variant="outlined" onChange={(event) => setPassword(event.target.value)} />
                    <Link id={"resetPasswordHint"} color={"primary"} className={classes.resetPasswordText} href="#" onClick={(e) => { e.preventDefault(); setShowResetPasswordModal(true) }} >
                        Forgotten Password
                    </Link>
                    <Button id={"loginButton"} style={{ margin: 18, width: '30ch', marginBottom: 10 }} variant="contained" color="primary" onClick={login}>
                        Login
                    </Button>

                </form>

                <Link id={"registerHint"} color={"primary"} className={classes.registerText} href="#" onClick={(e) => { e.preventDefault(); setShowRegisterModal(true) }} >
                    Dont Have An Account? Register
                </Link>

            </Paper>

            {showRegisterModal && <Modal
                open={true}
                onClose={() => setShowRegisterModal(false)}
                id={"registerModal"}
            >
                <div className={classes.modalContent}>

                    <Paper className={classes.centerPaper} >
                        <Button onClick={() => setShowRegisterModal(false)} style={{ position: "absolute", top: 0, right: 0, margin: 10 }}>X</Button>
                        <form className={classes.form} style={{ marginTop: 20 }}>
                            <TextField id={"emailRegister"} error={emailError === "" ? false : true} helperText={emailError} className={classes.formTextfield} label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} />
                            <TextField id={"passwordRegister"} error={passwordError === "" ? false : true} helperText={passwordError} className={classes.formTextfield} type="password" label="Password" variant="outlined" onChange={(event) => setPassword(event.target.value)} />
                            <TextField id={"passwordRegisterConfirm"} error={passwordConfirmError === "" ? false : true} helperText={passwordConfirmError} className={classes.formTextfield} type="password" label="Confirm Password" variant="outlined" onChange={(event) => setPasswordConfirm(event.target.value)} />


                            <Button id={"registerButton"} style={{ margin: 18, width: '30ch', marginBottom: 0 }} variant="contained" color="primary" onClick={register}>
                                Register
                            </Button>

                        </form>

                    </Paper>
                </div>

            </Modal>}

            {showResetPasswordModal && <Modal
                open={true}
                onClose={() => setShowResetPasswordModal(false)}
                id={"resetPasswordModal"}
            >
                <div className={classes.modalContent}>

                    <Paper className={classes.centerPaper} >
                        <Button onClick={() => setShowResetPasswordModal(false)} style={{ position: "absolute", top: 0, right: 0, margin: 10 }}>X</Button>
                        <form className={classes.form} style={{ marginTop: 20 }}>
                            <TextField id={"emailResetPasswordTextField"} error={resetPasswordEmailError === "" ? false : true} helperText={resetPasswordEmailError} className={classes.formTextfield} label="Email" variant="outlined" onChange={(event) => setResetPasswordEmail(event.target.value)} />

                            <Button id={"resetPasswordButton"} style={{ margin: 18, width: '30ch', marginBottom: 0 }} variant="contained" color="primary" onClick={resetPassword}>
                                Reset Password
                            </Button>

                        </form>

                    </Paper>
                </div>

            </Modal>}
        </React.Fragment>

    );
}

export default LoginPaper;