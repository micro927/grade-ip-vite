import {
    Container,
} from 'react-bootstrap'
import Footer from '../../components/Footer'
function AlertLayout(props) {
    return (
        <>
            <header>
            </header>
            <main>
                <Container fluid>
                    {props.children}
                </Container>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}

export default AlertLayout