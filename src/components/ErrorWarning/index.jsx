import { useEffect } from 'react'
import {
    Container,
} from 'react-bootstrap'
import './index.scss'
import MainLayout from '../../layouts/MainLayout'

function goBackHome() {
    console.log('WRONG PAGE BABY')
    setTimeout(() => {
        window.location.href = '/'
    }, 5000)
}

const Error404 = function Error404() {
    useEffect(() => {
        goBackHome()
    }, []);

    return (
        <MainLayout>
            <Container fluid className='py-5 text-center'>
                <h1>Page Not Found</h1>
                <h3>ไม่พบหน้าที่ท่านต้องการ</h3>
                <h6>...ระบบกำลังพาท่านกลับไปยังหน้าแรก...</h6>
            </Container>
        </MainLayout>
    )
}

const Error401 = function Error401() {
    useEffect(() => {
        goBackHome()
    }, []);

    return (
        <MainLayout>
            <Container fluid className='py-5 text-center'>
                <h1>Unauthorized</h1>
                <h3>ไม่สามารถใช้งานหน้าที่ท่านต้องการได้</h3>
                <h6>...ระบบกำลังพาท่านกลับไปยังหน้าแรก...</h6>
            </Container>
        </MainLayout>
    )
}

export { Error404, Error401 }