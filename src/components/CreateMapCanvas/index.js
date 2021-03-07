import React, { useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useStyles } from '../style.js';
import Shape from '../Shape';


const CreateMapCanvas = (props) => {

    const classes = useStyles();

    return (
        <Stage
            className={classes.canvas}
            width={document.documentElement.clientWidth}
            height={document.documentElement.clientHeight}
            draggable
            ref={props.stageRef}
            onMouseDown={(e) => props.checkDeselect(e)}
            onTouchStart={(e) => props.checkDeselect(e)}
        >
            <Layer
                ref={props.layerRef}
            >

                {props.shapes.map((shape, key) => {

                    return (
                        <React.Fragment>

                            <Shape
                                key={key}
                                index={key}
                                shapeProps={shape}
                                dragStart={props.dragStart}
                                dragMove={props.dragMove}
                                dragEnd={props.dragEnd}
                                onSelect={props.onSelect}
                                updatePropertiesOfShape={props.updateProperty}
                                shapeColour={props.categories[shape.category].mainColour}
                                fontColour={props.categories[shape.category].fontColour}
                                // updatePoints={() => props.updatePoints(key)}
                                updatePoints={props.updatePoints}
                            />




                        </React.Fragment>

                    )
                })}

                {props.guides.map((guide, key) => {
                    if (guide['orientation'] === 'V') {
                        return (
                            <Line
                                key={key}
                                x={guide['lineGuide']}
                                y={0}
                                points={[0, -6000, 0, 6000]}
                                stroke={'#0000FF'}
                                strokeWidth={1}
                                name={'guide-line'}
                                dash={[4, 6]}
                            />
                        );
                    }
                    else if (guide['orientation'] === 'H') {
                        return (
                            <Line
                                key={key}
                                x={0}
                                y={guide['lineGuide']}
                                points={[-6000, 0, 6000, 0]}
                                stroke={'#0000FF'}
                                strokeWidth={1}
                                name={'guide-line'}
                                dash={[4, 6]}
                            />
                        );
                    }
                })}

            </Layer>
        </Stage>
    );
}

export default CreateMapCanvas;