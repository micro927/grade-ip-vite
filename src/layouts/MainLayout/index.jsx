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
                <Container fluid>
                    <div className='m-4'>
                        {props.children}
                    </div>
                </Container>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}

export default MainLayout