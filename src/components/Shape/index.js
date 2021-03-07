import React, { useRef, useEffect } from 'react';
import { Rect, Group, Text, Transformer, Line, Tag } from 'react-konva';

const Shape = (props) => {

    const transformRef = React.useRef();
    const groupRef = useRef();
    const shapeRef = useRef();
    const textRef = useRef();

    useEffect(() => {
        if (props.shapeProps.selected) {
            transformRef.current.nodes([groupRef.current]);
            transformRef.current.getLayer().batchDraw();

        }
    }, [props.shapeProps.selected])

    return (
        <React.Fragment>
            {/* <Line

                points={props.shapeProps.points}
                stroke={'blue'}
                closed={true}
            /> */}
            <Group
                ref={groupRef}
                shapePoints={props.shapeProps.points}
                // key={props.index}
                // index={props.index}
                draggable
                onDragStart={(e) => props.dragStart(e, props.index)}
                onDragMove={(e) => props.dragMove(e, props.index)}
                onDragEnd={(e) => props.dragEnd(e, props.index)}
                onClick={() => props.onSelect(props.index)}
                onTap={() => props.onSelect(props.index)}
                rotation={parseInt(props.shapeProps.rotation)}
                x={props.shapeProps.x}
                y={props.shapeProps.y}
                // offsetX={props.shapeProps.width / 2}
                // offsetY={props.shapeProps.height / 2}
                width={props.shapeProps.width}
                height={props.shapeProps.height}
                name={props.shapeProps.name}

                onTransformEnd={(e) => {
                    var node = groupRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    var shape = shapeRef.current;
                    const width = shape.width();
                    const height = shape.height();

                    var text = textRef.current;
                    const absScale = text.getAbsoluteScale();
                    text.scaleX(text.scaleX() / absScale.x);
                    text.scaleY(text.scaleY() / absScale.y);

                    props.updatePropertiesOfShape("x", node.x());
                    props.updatePropertiesOfShape("y", node.y());
                    props.updatePropertiesOfShape("width", width * scaleX);
                    props.updatePropertiesOfShape("height", height * scaleY);
                    props.updatePropertiesOfShape("rotation", Math.floor(node.rotation()));
                    
                    props.updatePoints();

                    props.dragEnd(e, props.index);

                }}
            >
                <Rect
                    ref={shapeRef}
                    fill={props.shapeColour}
                    width={props.shapeProps.width}
                    height={props.shapeProps.height}

                />

                <Text
                    ref={textRef}
                    text={props.shapeProps.label}
                    width={props.shapeProps.width}
                    height={props.shapeProps.height}
                    fontSize={parseInt(props.shapeProps.fontSize)}
                    fontFamily='Calibri'
                    fill={props.fontColour}
                    verticalAlign="middle"
                    align={props.shapeProps.textAlign}
                />

            </Group>


            {props.shapeProps.selected && (
                <Transformer
                    width={200}
                    // rotateEnabled={false}
                    ref={transformRef}
                    boundBoxFunc={(oldBox, newBox) => {

                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {

                            return oldBox;
                        }

                        return newBox;

                    }}
                />
            )}
        </React.Fragment>


    )

}

export default Shape;