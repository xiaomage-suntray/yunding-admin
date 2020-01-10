export default data => {
    console.log('1111111')
    if (!data) {
        return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', 'excel.xlsx')

    document.body.appendChild(link)
    link.click()
}
