import React from 'react';

import NavBar from '../../components/NavBar';
import AdminPageTable from '../../components/AdminMapTable';

import { Redirect } from 'react-router-dom';

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
            <AdminPageTable />
        </div>
    );
};

export default AdminPage;