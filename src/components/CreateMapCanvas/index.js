import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { useStyles } from '../style.js';
import Shape from '../Shape';
import { categories } from '../categories';


const CreateMapCanvas = (props) => {

    const classes = useStyles();

    const [stageScale, setStageScale] = useState(1);
    const [stageX, setStageX] = useState(0);
    const [stageY, setStageY] = useState(0);

    let points = [];

    function handleWheel(e) {
        e.evt.preventDefault();

        const scaleBy = 1.01;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });


        setStageScale(newScale)
        setStageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
        
        setStageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);

    };

    function activeStepIs0() {
        return (
            props.shapes.map((shape, key) => {

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
            })
        );
    }

    function activeStepIs1() {

        if (props.buildingBeingViewed) {

            points = [
                props.buildingBeingViewed.x, props.buildingBeingViewed.y,
                props.buildingBeingViewed.x + props.buildingBeingViewed.width, props.buildingBeingViewed.y,
                props.buildingBeingViewed.x + props.buildingBeingViewed.width, props.buildingBeingViewed.y + props.buildingBeingViewed.height,
                props.buildingBeingViewed.x, props.buildingBeingViewed.y + props.buildingBeingViewed.height
            ];

            return (
                <React.Fragment>

                    <Rect

                        x={props.buildingBeingViewed.x}
                        y={props.buildingBeingViewed.y}
                        width={props.buildingBeingViewed.width}
                        height={props.buildingBeingViewed.height}
                        fill={categories[props.buildingBeingViewed.category]["mainColour"]}
                        closed={true}
                        rotation={0}

                    />

                    {props.buildingBeingViewed.internal.map((shape, key) => {
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
                </React.Fragment>

            );
        }

    }

    return (
        <Stage
            className={classes.canvas}
            width={document.documentElement.clientWidth}
            height={document.documentElement.clientHeight}
            draggable
            ref={props.stageRef}
            onMouseDown={(e) => props.checkDeselect(e)}
            onTouchStart={(e) => props.checkDeselect(e)}
            onWheel={handleWheel}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stageX}
            y={stageY}

        >
            <Layer
                ref={props.layerRef}
            >

                {props.activeStep === 0 ? activeStepIs0() : activeStepIs1()}

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