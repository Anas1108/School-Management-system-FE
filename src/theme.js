import { createTheme } from '@mui/material/styles';

// Helper to get CSS variable value
const getVar = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

// Note: We use hardcoded values here for the initial setup to ensure MUI works correctly 
// before CSS vars are fully loaded/parsed by JS in some environments.
// Detailed customization effectively happens via the CSS overrides and class names.

const theme = createTheme({
    palette: {
        primary: {
            main: '#9b1b30', // --color-primary-600
            light: '#f87171', // --color-primary-400
            dark: '#6b101e', // --color-primary-800
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#fbbf24', // --color-secondary-400
            light: '#fcd34d', // --color-secondary-300
            dark: '#b45309', // --color-secondary-700
            contrastText: '#ffffff',
        },
        background: {
            default: '#f9fafb', // --color-gray-50
            paper: '#ffffff',    // --color-white
        },
        text: {
            primary: '#111827', // --color-gray-900
            secondary: '#4b5563', // --color-gray-600
        },
        error: {
            main: '#ef4444', // --color-error
        },
        warning: {
            main: '#f59e0b', // --color-warning
        },
        info: {
            main: '#3b82f6', // --color-info
        },
        success: {
            main: '#10b981', // --color-success
        },
    },
    typography: {
        fontFamily: "'Inter', 'Poppins', sans-serif",
        h1: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
        },
        h2: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
        },
        h3: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
        },
        h4: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
        },
        h5: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
        },
        h6: {
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
        },
        button: {
            textTransform: 'none', // Modern apps rarely use all-caps buttons
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
        },
    },
    shape: {
        borderRadius: 12, // --border-radius-xl
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
        '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
        '0 10px 15px -3px rgba(0, 0, 0, 0.1)', // shadow-lg
        '0 20px 25px -5px rgba(0, 0, 0, 0.1)', // shadow-xl
        // ... fill rest if needed or stick to these
        'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', // placeholders
        'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem', // --border-radius-lg
                    padding: '0.6rem 1.5rem',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #9b1b30 0%, #6b101e 100%)', // gradient-primary
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', // gradient-accent
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none', // Remove default material overlay
                },
                rounded: {
                    borderRadius: '1rem', // --border-radius-xl
                },
                elevation1: {
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                },
                elevation2: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                elevation3: {
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '1rem',
                    overflow: 'hidden',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        transition: 'all 0.2s',
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '2px',
                            borderColor: '#9b1b30',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#f87171',
                        }
                    },
                },
            },
        },
    },
});

export default theme;
