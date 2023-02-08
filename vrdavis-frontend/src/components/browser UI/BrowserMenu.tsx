import Container from '@mui/material/Container';

const BrowserMenu = ({children, ...rest}: any) => {
    return (
        <div id="browser-menu">
            <Container maxWidth="sm">
                {children}
            </Container>
        </div>
    );
};

export default BrowserMenu;