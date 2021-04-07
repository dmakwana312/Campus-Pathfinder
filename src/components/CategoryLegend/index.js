import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';

import { useStyles } from '../style.js';

const CategoryLegend = (props) => {
    const classes = useStyles();
    return (
        <Paper className={classes.paper} style={{ width: 150, top: 0, right: 0 }} elevation={10}>
            {props.categories.map((category, key) => {
                return (
                    <div>
                        <div style={{ margin: 10, float: "left", border: "1px solid black", height: "10px", width: "10px", backgroundColor: category.mainColour }} />
                        <p style={{paddingTop: 5 }}> {category.categoryName}</p>

                    </div>
                );

            })}
        </Paper>
    );
}

export default CategoryLegend;
