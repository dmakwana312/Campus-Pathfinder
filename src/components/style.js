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
        width: "9.7ch",
        borderColor: "blue"
    },
    modalContent: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    //View Map Page Styling
    viewMapCanvas: {
        backgroundColor: "#e6e5e3",
        overflow: "hidden"
    },
    paper: {
        zIndex: 1000,
        position: 'absolute',
        margin: theme.spacing(1),
        padding: theme.spacing(2),
    },
    paperComponent: {
        margin: theme.spacing(1),
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
    paperTabs: {
        flexGrow: 1
    },
    tab: {
        minWidth: 90, // a number of your choice
    },

    // Sidebar Styling
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: 2
    },
    noLabel: {
        marginTop: theme.spacing(3)
    },

    // Homepage styling
    loginPaper: {
        position: "absolute",
        top: "50%",
        right: "50%",
        transform: "translate(50%,-50%)",
        margin: theme.spacing(1),
        padding: theme.spacing(2),
    },
    form: {
        width: '30ch',
        margin: theme.spacing(1),
        marginRight: theme.spacing(3),
        
    },
    formTextfield: {
        width: '30ch',
        margin: theme.spacing(1),

    },

    registerText: {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "80%",
        marginBottom: 10
        
    }

}));

export { useStyles }