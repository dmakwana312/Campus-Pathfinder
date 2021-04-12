import React, { useState } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

const ColourPicker = (props) => {
    const [displayColourPicker, setDisplayColourPicker] = useState(false);
    const [colour, setColour] = useState(props.colour);

    console.log(props.colour);

    function handleClick() {
        setDisplayColourPicker(!displayColourPicker);
    }

    function handleClose() {
        setDisplayColourPicker(false);
    }

    function handleChange(colour) {
        setColour(colour.hex);
        props.handleColourChange(colour.hex);
    }




    const styles = reactCSS({
        'default': {
            colour: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: colour ,
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return (
        <div>
            <div style={styles.swatch} onClick={handleClick}>
                <div style={styles.colour} />
            </div>
            { displayColourPicker ? <div style={styles.popover}>
                <div style={styles.cover} onClick={handleClose} />
                {console.log(colour)}
                <SketchPicker color={colour} onChange={handleChange} />
            </div> : null}

        </div>
    )

}

export default ColourPicker;