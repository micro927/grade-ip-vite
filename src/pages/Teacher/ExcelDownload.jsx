// import { utils, writeFileXLSX } from 'xlsx';
import { utils, writeFileXLSX } from 'sheetjs-style';

import axios from 'axios'

function ExcelDownload(classId) {

    const appApiHost = import.meta.env.VITE_API_HOST
    axios
        .get(`${appApiHost}/teacher/coursedetail/${classId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
        })
        .then(async (response) => {
            const courseDetail = await response.data
            await axios
                .get(`${appApiHost}/teacher/studentlist/${classId}`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                })
                .then(async (response) => {
                    const data = await response.data
                    const studentList = await data.map((row, index) => {
                        const No = index + 1
                        const studentId = row.student_id
                        const Name = row.name
                        const surName = row.surname
                        const Grade = row.grade_new
                        const SECLEC = row.seclec
                        const SECLAB = row.seclab
                        return {
                            No,
                            studentId,
                            Name,
                            surName,
                            Grade,
                            SECLEC,
                            SECLAB,
                        }
                    })
                    const gradeType = localStorage.getItem('gradeType') ?? false
                    const gradeTypeTitle = gradeType.toUpperCase()
                    const sheetName = courseDetail.courseno
                    const workBookName = courseDetail.courseno + '.xlsx'

                    const workSheet = utils.aoa_to_sheet([
                        ["ส่งลำดับขั้นแก้ไขอักษร " + gradeTypeTitle],
                        ['COURSENO', '', courseDetail.courseno],
                        ['TITLE', '', courseDetail.course_title],
                        ['SECTION (lec/lab)', '', courseDetail.seclec],
                        ['LECTURER', '', courseDetail.instructor_id],
                        ['DATE', '', 'THIS DATE'],
                    ]);

                    utils.sheet_add_json(workSheet, studentList, { origin: -1 });

                    if (!workSheet["!merges"]) workSheet["!merges"] = [];
                    workSheet["!merges"].push(utils.decode_range("A1:G1"));


                    workSheet["!merges"].push(utils.decode_range("A2:B2"));
                    workSheet["!merges"].push(utils.decode_range("C2:G2"));

                    workSheet["!merges"].push(utils.decode_range("A3:B3"));
                    workSheet["!merges"].push(utils.decode_range("C3:G3"));

                    workSheet["!merges"].push(utils.decode_range("C4:G4"));
                    workSheet["!merges"].push(utils.decode_range("A4:B4"));

                    workSheet["!merges"].push(utils.decode_range("A5:B5"));
                    workSheet["!merges"].push(utils.decode_range("C5:G5"));

                    workSheet["!merges"].push(utils.decode_range("A6:B6"));
                    workSheet["!merges"].push(utils.decode_range("C6:G6"));

                    workSheet["!merges"].push(utils.decode_range("C7:D7"));

                    workSheet['F2'] = {
                        font: {
                            name: '宋体',
                            sz: 24,
                            bold: true,
                            color: { rgb: "FFFFAA00" }
                        },
                    };

                    const workBook = utils.book_new();
                    utils.book_append_sheet(workBook, workSheet, sheetName);

                    writeFileXLSX(workBook, workBookName);

                }).catch((error) => {
                    console.log('ERROR stdlist', error)
                })
        }).catch((error) => {
            console.log('ERROR coursedetail', error)
        })
}


export default ExcelDownload