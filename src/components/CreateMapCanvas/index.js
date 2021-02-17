import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useStyles } from '../style.js';
const CreateMapCanvas = () => {
    const classes = useStyles();
    return (
        <Stage

        height={document.documentElement.clientHeight}
            className={classes.canvas}
        >
            <Layer>

                <Rect

                    fill="blue"
                    width={150}
                    height={150}
                />
            </Layer>
        </Stage>
    );
}

export default CreateMapCanvas;