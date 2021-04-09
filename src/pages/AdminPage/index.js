import React from 'react';

import NavBar from '../../components/NavBar';

import { Redirect } from 'react-router-dom';

import { loggedInUser } from '../../utils/userState';
import { useStyles } from '../style.js';

import AdminPageTable from '../../components/AdminMapTable';

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