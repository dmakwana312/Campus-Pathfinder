import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';

import { useStyles } from '../style.js';

const CategoryLegend = (props) => {
    const classes = useStyles();
   
    return (
        <Paper className={classes.paper} style={{ width: 150, top: 0, right: 0 }} elevation={10}>
            <div>
                {props.categories.map((category, key) => {
                    return (
                        <React.Fragment>
                            <div style={{ margin: 10, float: "left", border: "1px solid black", height: "10px", width: "10px", backgroundColor: category.mainColour }} />
                            <p style={{ paddingTop: 5 }}> {category.categoryName}</p>
                        </React.Fragment>

                    );

                })}
                <div style={{ margin: 10, float: "left", border: "1px solid black", height: "10px", width: "10px", backgroundColor: "#03b1fc" }} />
                <p style={{ paddingTop: 5 }}> Search Result</p>

                <div style={{ margin: 10, float: "left", border: "1px solid black", height: "10px", width: "10px", backgroundColor: "#03fc0f" }} />
                <p style={{ paddingTop: 5 }}> Origin</p>

                <div style={{ margin: 10, float: "left", border: "1px solid black", height: "10px", width: "10px", backgroundColor: "#fc03ce" }} />
                <p style={{ paddingTop: 5 }}> Destination</p>

                <div style={{ margin: 10, float: "left", border: "1px solid black", height: "10px", width: "10px", backgroundColor: "#0000FF" }} />
                <p style={{ paddingTop: 5 }}> Route</p>

            </div>
        </Paper>
    );
}

export default CategoryLegend;
