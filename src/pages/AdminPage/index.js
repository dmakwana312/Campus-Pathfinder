import React, { useState, useEffect } from 'react';

import NavBar from '../../components/NavBar';

import { Redirect } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';

import { loggedInUser } from '../../utils/userState';
import { useStyles } from '../style.js';

const AdminPage = (props) => {
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
        </div>
    );
};

export default AdminPage;