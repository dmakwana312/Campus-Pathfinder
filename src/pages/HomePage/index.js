import React, { useState, useRef } from 'react';
import LoginPaper from '../../components/LoginPaper';

import NavBar from '../../components/NavBar';
import { useStyles } from '../style.js';

const HomePage = () => {

    const classes = useStyles();

    return (
        <div className={classes.HomePage}>

            <NavBar />
            <LoginPaper />
            
        </div>

    );
}

export default HomePage;