import {
    Container,
} from 'react-bootstrap'

function AppFooter() {

    return (
        <>
            <hr className=" border-light my-0" />
            <Container className='h-100 d-flex justifty-content-center align-items-center'>
                <div className='text-secondary text-center w-100 small my-0'>
                    <span className='d-none d-sm-inline'>Developed by</span> Information technology and procession section,
                    <span className='d-block d-md-inline'>Registration office, Chiang Mai University &copy; 2022</span>
                </div>
            </Container>
        </>

    );
}

export default AppFooter;