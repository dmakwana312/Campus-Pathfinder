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