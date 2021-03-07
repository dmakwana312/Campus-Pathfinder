import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
    // Create map page styling
    content: {
        textAlign: "center",
        display: "inline-block",
    },
    root: {
        display: 'flex',
        overflowY: 'hidden',
        overflowX: 'hidden',
    },
    canvas: {
        backgroundColor: "#e6e5e3",
        width: 'calc(100vw - 500px);',
        height: 'calc(100vh - 170px);',
    },
    createMapHeadingContainer: {
        width: 100,
    },
    createMapHeading: {
        width: 100,
    },
    propertiesForm: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justify: "center",

    },
    propertiesFormDisabled: {
        filter: "blur(5px)"
    },
    modalButton: {
        marginTop: 20
    },
    propertiesFormDisabledText: {
        position: "absolute",
        textAlign: "center"
    },
    textField: {
        margin: theme.spacing(1),
        marginBottom: theme.spacing(0),
        width: '100%',
        justifyContent: 'center',
    },
    positionTextField: {
        width: "10.7ch",
        borderColor: "blue"
    },
    modalContent: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    // Appbar styling
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    list: {
        width: 200,
    },
    button: {
        marginRight: 30,
        cursor: "pointer",
    },
    sideBarIcon: {
        padding: 0,
        color: "white",
        cursor: "pointer",
    },
    // Sidebar Styling
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
}));

export { useStyles }