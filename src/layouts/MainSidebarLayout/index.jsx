import './index.scss'

import {
    Col,
    Container,
    Row,
} from 'react-bootstrap'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'



const MainSidebarLayout = (props) => {

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Container fluid>
                    <Row>
                        <Col xl={2} className='sidebarBox'>
                            <div className='sidebar px-4 pt-2'>
                                {props.sidebarContent}
                            </div>
                        </Col>
                        <Col xl={10}>
                            <div className='m-4'>
                                {props.children}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}

export default MainSidebarLayout 