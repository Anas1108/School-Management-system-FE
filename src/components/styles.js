import {
    TableCell,
    TableRow,
    styled,
    tableCellClasses,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
} from "@mui/material";

const drawerWidth = 260; // Increased width for better whitespace

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'var(--color-gray-50)',
        color: 'var(--text-secondary)',
        fontWeight: 600,
        fontSize: '0.8rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-family-sans)',
        padding: '14px 20px',
        borderBottom: '2px solid var(--color-primary-200)',
        whiteSpace: 'nowrap',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: '0.9rem',
        fontFamily: 'var(--font-family-sans)',
        color: 'var(--text-primary)',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: 'var(--bg-paper)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: 'var(--color-primary-50)',
        boxShadow: 'inset 3px 0 0 0 var(--color-primary-500)',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: 'var(--bg-glass)',
    backdropFilter: 'var(--backdrop-blur)',
    boxShadow: 'none',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            backgroundColor: 'var(--bg-paper)',
            borderRight: '1px solid var(--border-color)',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);