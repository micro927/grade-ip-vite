function datetimeTextThai(datetime) {
    return datetime == null ? '' : new Date(datetime).toLocaleString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h24'
    })
}

function getAllSubmitStatusTitle() {
    return [
        'รอกรอกลำดับขั้น',
        'รอภาควิชาฯ ยืนยัน',
        'รอคณะยืนยัน',
        'รอคณะนำส่ง',
        'รอสำนักทะเบียนฯ ยืนยัน',
        'สำนักทะเบียนฯ ยืนยันแล้ว']
}

export { datetimeTextThai, getAllSubmitStatusTitle }