import './index.scss'
import { read, utils, writeFile } from 'xlsx';
import axios from 'axios';
import { Table } from 'react-bootstrap';






async function ExcelDownload(classId) {
    const appApiHost = import.meta.env.VITE_API_HOST
    await axios
        .get(`${appApiHost}/teacher/coursedetail/${classId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
        })
        .then(async (response) => {
            const courseDetail = response.data
            await axios
                .get(`${appApiHost}/teacher/studentlist/${classId}`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                })
                .then(async (response) => {
                    const studentList = await response.data

                    const ExcelTable = (
                        <Table>
                            {studentList.map((row) => {
                                <tr>
                                    <td>{row.student_id}</td>
                                    <td>{row.name}</td>
                                    <td>{row.surname}</td>
                                    <td>{row.grade_new}</td>
                                </tr>
                            })
                            }
                        </Table>
                    )
                    // create excelsheet form data here
                    // data ====> courseDetail ...... studentList ......

                    // const worksheet = utils.json_to_sheet(studentList);
                    // const workbook = utils.book_new();
                    const workbook = utils.table_to_book(ExcelTable);

                    // utils.book_append_sheet(workbook, worksheet);
                    return writeFile(workbook, "test.xlsx");
                }).catch((error) => {
                    console.log('ERROR stdlist', error)
                })
        })
        .catch((error) => {
            console.log('ERROR cdetail', error)
        })
}

export default ExcelDownload