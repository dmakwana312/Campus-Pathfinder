import React from 'react';

import { 
    makeStyles,
    withStyles, 
    Stepper, 
    Step, 
    StepLabel, 
    StepConnector 
} from '@material-ui/core/';

import Check from '@material-ui/icons/Check';

import clsx from 'clsx';

const QontoConnector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    active: {
        '& $line': {
            borderColor: '#3f51b5',
        },
    },
    completed: {
        '& $line': {
            borderColor: '#3f51b5',
        },
    },
    line: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: '#3f51b5',
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: '#3f51b5',
        zIndex: 1,

    },
});

function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

const CreateMapProgressTracker = (props) => {
    const steps = ['Create Campus Map', 'Create For Each Building', 'Final Steps'];

    return (
        <React.Fragment>
            <Stepper alternativeLabel activeStep={props.activeStep} connector={<QontoConnector />}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </React.Fragment>





    );
}

export default CreateMapProgressTracker;
