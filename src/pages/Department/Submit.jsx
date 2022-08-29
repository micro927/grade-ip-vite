
import MainSidebarLayout from "../../layouts/MainSidebarLayout";
import { useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";



const SidebarContent = () => {
    return (
        <>
            <p>123asdsaas</p>
            <p>asdsaas</p>
            <p>asdsaas</p>
            <p>asdsaas</p>

        </>
    )
}

const DepartmentSubmit = () => {
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const navigate = useNavigate()



    return (
        <>
            <MainSidebarLayout sidebarContent={<SidebarContent />}>
                <h2>ยืนยันลำดับขั้นแก้ไขอักษร {gradeTypeTitle} ระดับภาควิชา</h2>
                <Table responsive='xl' bordered hover className='mt-4'>
                    <thead className='tableHead'>
                        <tr className='text-center'>
                            <th>s</th>
                            <th>s</th>
                            <th>s</th>
                            <th>s</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>x</td>
                            <td>x</td>
                            <td>x</td>
                            <td>x</td>
                        </tr>
                    </tbody>
                </Table>
            </MainSidebarLayout>
        </>
    )
}

export default DepartmentSubmit 