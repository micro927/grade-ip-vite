import PropTypes from 'prop-types';
import { useEffect } from 'react'
import {
    Container,
    Button,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'



function ErrorWarning(props) {
    const navigate = useNavigate()
    const { children, errorCode } = props
    const errorDetail = {
        401: {
            title: 'Unauthorized',
            subTitle: 'ท่านไม่มีสิทธ์เข้าใช้งานโปรแกรมในหน้านี้',
        },
        404: {
            title: 'Page Not Found',
            subTitle: 'ไม่พบหน้าที่ท่านต้องการ',
        },
        500: {
            title: 'Error 500',
            subTitle: 'พบปัญหาในการเข้าใช้งาน โปรดติดต่อสำนักทะเบียนและประมวลผล',
        }
    }

    function goBackHome() {
        console.log('PLEASE GO BACK TO HOMEPAGE...')
        navigate('/')
    }
    const { title, subTitle } = errorDetail?.[errorCode] ?? ['', '']

    useEffect(() => {
        //
    }, []);

    return (
        <MainLayout>
            <Container fluid className='py-5 text-center'>
                <h1>{title}</h1>
                <h3>{subTitle}</h3>
                <br />
                <Button variant='outline-dark' onClick={goBackHome}>กลับไปยังหน้าแรก</Button>
            </Container>
        </MainLayout>
    )
}

ErrorWarning.propTypes = {
    children: PropTypes.node,
    errorCode: PropTypes.number,
}


export default ErrorWarning