import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({

    // Create map page styling
    content: {
        // backgroundColor: 'blue',
    },
    root: {
        display: 'flex',
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