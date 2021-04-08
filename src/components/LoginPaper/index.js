import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Modal from '@material-ui/core/Modal';

import { useStyles } from '../style.js';
import { Button } from '@material-ui/core';

const LoginPaper = () => {

    const classes = useStyles();

    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    function login() {
        console.log(email, password);
    }

    function register() {
        console.log(email, password);
    }

    return (
        <React.Fragment>

            <Paper className={classes.loginPaper} >

                <form className={classes.form}>
                    <TextField className={classes.formTextfield} id="emailLogin" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} />
                    <TextField className={classes.formTextfield} id="passwordLogin" type="password" label="Password" variant="outlined" onChange={(event) => setPassword(event.target.value)} />

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
                            <TextField className={classes.formTextfield} id="emailRegister" label="Email" variant="outlined" onChange={(event) => setEmail(event.target.value)} />
                            <TextField className={classes.formTextfield} id="passwordRegister" type="password" label="Password" variant="outlined" onChange={(event) => setPassword(event.target.value)} />
                            <TextField className={classes.formTextfield} id="passwordRegisterConfirm" type="password" label="Confirm Password" variant="outlined" onChange={(event) => setPasswordConfirm(event.target.value)} />


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