import { Container, Button } from "react-bootstrap"
import PropTypes from 'prop-types';

const NoDataBox = (props) => {
    const msg = props.msg
    return (
        <Container className='text-center py-5'>
            <hr />
            <h3 className='my-5' >{msg}</h3>
            <hr />
            <Button variant='outline-secondary' href='./'>กลับไปหน้าแรก</Button>
        </Container>
    )
}

NoDataBox.propTypes = {
    msg: PropTypes.string
}

export default NoDataBox