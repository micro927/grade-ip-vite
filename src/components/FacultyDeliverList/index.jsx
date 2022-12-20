import { useContext } from "react";
import { Button } from "react-bootstrap";
import axios from 'axios';
import Swal from 'sweetalert2';
import { AppContext } from '../../components/Provider';
import { datetimeTextThai } from '../../utils';



function FacultyDeliverList({ deliverIdList }) {
    const appApiHost = import.meta.env.VITE_API_HOST
    const { organization_code } = JSON.parse(localStorage.getItem('loginInfo'))
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const { AppThisSemester, AppThisYear } = useContext(AppContext)

    async function downloadCMR541(deliverId) {
        await axios
            .get(`${appApiHost}/faculty/cmr541/${deliverId}`, {
                responseType: 'blob',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            }).then((response) => {
                console.log(response);
                const href = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `รายงานสรุปการส่งเกรดแก้ไขอักษรลำดับขึั้น ${gradeTypeTitle}_${AppThisSemester}${AppThisYear}_${deliverId}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);

            })
            .catch((error) => {
                console.log('cmr541 download: ', error);
            });
    }

    function handleClickDeliver(deliverId) {
        const deliverDetail = deliverIdList.find(deliver => deliver.deliver_id == deliverId);
        const { deliver_id, status, class_amount, facuser_deliver_datetime, class_deliver_list, facuser_deliver_itaccountname, reg_submit_itaccountname, reg_submit_datetime } = deliverDetail;
        const deliverTime = datetimeTextThai(facuser_deliver_datetime);
        const isShowDenyButton = status == 1 && !(reg_submit_itaccountname);
        const statusText = status == 0 ? `<span class='text-danger'>ยกเลิกการนำส่งครั้งนี้</span>` : `ปกติ`;
        const regSubmitStatus = datetimeTextThai(reg_submit_datetime) || 'ยังไม่ได้ยืนยัน';
        const ClassList = class_deliver_list.split(',');
        let ClassListHtml = '';
        ClassList.map((classId, index) => {
            const thisTerm = classId.substring(0, 5);
            const thisCourseNo = classId.substring(5, 11);
            const thisSecLec = classId.substring(11, 14);
            const thisSecLab = classId.substring(14, 17);
            const thisIndex = index + 1;
            ClassListHtml += `
            <tr>
                    <td>${thisIndex}</td>
                    <td>${thisTerm}</td>
                    <td>${thisCourseNo}</td>
                    <td>${thisSecLec}</td>
                    <td>${thisSecLab}</td>
                </tr>`;
        });

        const html = `<hr />
                    <table class='table table-bordered'>
                    <tbody>
                    <tr>
                    <th>สถานะ</th>
                    <td style='text-align: left;'>${statusText}</td>
                    </tr>
                    <tr>
                    <tr>
                    <th>วันเวลาที่นำส่ง</th>
                    <td style='text-align: left;'>${deliverTime}</td>
                    </tr>
                    <tr>
                    <th>เจ้าหน้าที่คณะที่นำส่ง</th>
                    <td style='text-align: left;'>${facuser_deliver_itaccountname}</td>
                    </tr>
                    <tr>
                    <th>จำนวนตอนกระบวนวิชาที่นำส่ง</th>
                    <td style='text-align: left;'>${class_amount} ตอน</td>
                    </tr>
                    <tr>
                    <th class='text-success'>สำนักทะเบียนฯ ยืนยันแล้วเมื่อ</th>
                    <td style='text-align: left;'>${regSubmitStatus}</td>
                    </tr>
                    </tbody>
                    </table>
                    <hr />
                    <table class='table table-bordered'>
                    <thead>
                    <tr>
                    <th>ที่</th>
                    <th>ภาคการศึกษา<br />ที่ได้รับอักษร ${gradeTypeTitle}</th>
                    <th>รหัสกระบวนวิชาที่นำส่ง</th>
                    <th>ตอนบรรยาย</th>
                    <th>ตอนปฏิบัติการ</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${ClassListHtml}
                    </tbody>
                    </table>
                    <p class='small'>code: ${deliver_id}</p>`;

        Swal.fire({
            title: `ประวัติการนำส่ง`,
            width: '80vw',
            showCancelButton: true,
            showDenyButton: isShowDenyButton,
            confirmButtonText: `พิมพ์ใบนำส่ง`,
            denyButtonText: 'ยกเลิกการนำส่งนี้',
            cancelButtonText: `ปิด`,
            html: html
        }).then(async (result) => {
            if (result.isConfirmed) {
                await downloadCMR541(deliver_id);
            }
            else if (result.isDenied) {
                Swal.fire({
                    icon: "question",
                    title: 'ต้องการยกเลิกการนำส่งนี้ ?',
                    confirmButtonText: `ยืนยันยกเลิกการนำส่ง`,
                    confirmButtonColor: `#dc3545`,
                    showLoaderOnConfirm: true,
                    backdrop: true,
                    preConfirm: async () => {
                        const facultyId = organization_code;
                        // const facultyId = '01'
                        return await axios
                            .post(`${appApiHost}/faculty/delivercancel/${deliver_id}`, {
                                facultyId
                            }, {
                                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                            }).then((response) => {
                                return response.data;
                            }).catch((error) => {
                                console.log(error);
                                // console.log(error.response.data);
                                Swal.showValidationMessage(`DeliverCancel API failed`);
                            });
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            icon: 'warning',
                            title: `ยกเลิกการนำส่งครั้งนี้แล้ว`,
                            confirmButtonText: 'ตกลง',
                            timer: '3000',
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                });
            }
        });
    }
    return (
        <div className='mt-4'>
            <h5 className='text-secondary'>ประวัติการนำส่ง</h5>
            <hr />
            {deliverIdList.map(deliver => {
                const { deliver_id, facuser_deliver_datetime, class_amount, status } = deliver
                const deliverTime = datetimeTextThai(facuser_deliver_datetime)
                return (
                    <Button variant='' key={deliver_id}>
                        <h6 className={status == 0 ? 'text-danger' : ''} onClick={() => handleClickDeliver(deliver_id)}>{deliverTime}  {status == 0 ? '(ยกเลิก)' : '(' + class_amount + ' ตอน)'}</h6>
                    </Button>
                )
            })}
        </div>
    )
}

export default FacultyDeliverList