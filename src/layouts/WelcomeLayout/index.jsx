import PropTypes from 'prop-types';
import {
    Container,
} from 'react-bootstrap'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
function WelcomeLayout(props) {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Container fluid className='px-0'>
                    {props.children}
                </Container>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}

WelcomeLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default WelcomeLayout