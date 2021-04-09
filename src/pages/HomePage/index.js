import React, { useState, useRef } from 'react';
import LoginPaper from '../../components/LoginPaper';

import NavBar from '../../components/NavBar';
import { useStyles } from '../style.js';
import { loggedInUser } from '../../utils/userState';
import { Redirect } from 'react-router-dom';

const HomePage = () => {

    const classes = useStyles();

    function checkLoggedIn() {
        if (loggedInUser.use() === null) {
            return <Redirect to='/' />;
        }
    }

    return (
        <div className={classes.page}>
            {checkLoggedIn()}
            <NavBar />
            <LoginPaper />
            
        </div>

    );
}

export default HomePage;