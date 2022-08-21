import './index.scss'

import {
    Container,
} from 'react-bootstrap'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
function MainLayout(props) {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Container fluid className='px-0 pt-0 pb-5'>
                    {props.children}
                </Container>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}

export default MainLayout