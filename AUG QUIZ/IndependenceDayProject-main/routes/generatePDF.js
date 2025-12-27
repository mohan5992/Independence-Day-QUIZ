import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { jsPDF } from 'jspdf'
import fs from 'fs'

const router = Router()


router.post('/', (req, res) => {
    let { username } = req.body;
    username = username.charAt(0).toUpperCase() + username.slice(1)

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        compress: true
    })

    const margin = 15

    //FONTS
    //font for headline
    const fontForHeadline = fs.readFileSync(path.join('./', 'fonts', 'EduVICWANTBeginner-VariableFont_wght.ttf'))
    //base64 font for headline
    const base64FontForHeadline = fontForHeadline.toString('base64')

    doc.addFileToVFS("EduVICWANTBeginner-VariableFont_wght.ttf", base64FontForHeadline);
    doc.addFont("EduVICWANTBeginner-VariableFont_wght.ttf", "Edu", "normal", "bold");



    //finding width and hight of the page
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()

    //fetures for headline
    // let username = 'Amarjeet'
    const headline = `I, ${username}, hereby solemnly pledge to uphold and embody the following principles, which reflect the true spirit of being an Indian:`

    //headline is too long soo increse the line count
    //headline width
    const headlineWidth = doc.getTextWidth(headline)
    //headline center
    const headlineWidthCenter = headlineWidth / 2

    //fetures for points
    const points = ['I love my India and uphold its dignity at all times.', 'I respect women and am committed to ensuring their safety and dignity.', 'I respect and embrace diversity in religion, gender, caste, and region.', 'I uphold and respect the principles of the Indian Constitution.', 'I actively engage in questioning the government and value political literacy.', 'I take responsibility for the well-being of society and contribute to social upliftment.', 'I prioritize environmental stewardship for a sustainable future.', 'I focus on continuous education and personal growth.']



    //font for points
    const fontForPoints = fs.readFileSync(path.join('./', 'fonts', 'Caveat-VariableFont_wght.ttf'))
    //base64 font for points
    const base64FontForPoints = fontForPoints.toString('base64')

    doc.addFileToVFS("Caveat-VariableFont_wght.ttf", base64FontForPoints);
    doc.addFont("Caveat-VariableFont_wght.ttf", "Caveat", "normal", "bold");

    //finding center of the page
    const Xcenter = pageWidth / 2
    const Ycenter = pageHeight / 2


    //image to put on pdf center as water mark
    const image = fs.readFileSync(path.join('./', 'satyameva jyate opcity10.png'))
    //base64 file of the image
    const base64Image = image.toString('base64')


    const imageHeight = 3396 / 8 //in px
    const imageWidth = 2000 / 8 // in px

    const coordinateXforimage = Xcenter - (imageWidth / 2)
    const coordinateYforimage = Ycenter - (imageHeight / 2)


    function generatePDF() {
        //adding reactangle
        doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);
        //adding image
        doc.addImage(base64Image, 'PNG', coordinateXforimage, coordinateYforimage, imageWidth, imageHeight,)
        //adding headline
        doc.setFontSize(20)
        doc.setFont("Edu", "bold")
        const multilineHeadline = doc.splitTextToSize(headline, pageWidth - margin * 3.5)
        doc.text(multilineHeadline, margin * 2, margin * 5)
        //adding points
        doc.setFontSize(20)
        doc.setFont("Caveat", "bold")
        let countTwo = 1
        points.forEach((e, index) => {
            const point = `${index + 1} ${e}`
            const multilinePoint = doc.splitTextToSize(point, pageWidth - margin * 6)
            const linecount = multilinePoint.length
            let textXcoordinate = margin * 3.5
            let textYcoordinate = margin * (9 + index + 4)
            if (linecount === 2) {
                textYcoordinate = textYcoordinate + 25 * countTwo
                countTwo++
            }
            else {
                textYcoordinate = textYcoordinate + 25 * countTwo
            }
            doc.text(multilinePoint, textXcoordinate, textYcoordinate)
        })
        doc.setFont("Edu", "bold")
        let usernameWidth = doc.getTextWidth(username)
        doc.text(username, Xcenter + 110 - (usernameWidth / 2), Ycenter + 250)

        const x1 = Xcenter + 95;
        const y1 = Ycenter + 257;
        const x2 = Xcenter + 155;
        const y2 = Ycenter + 257;

        const signLineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        doc.line(x1 - (signLineLength / 2), y1, x2, y2)

        doc.setFont("Caveat", "bold")
        let DeshBhaktText = "The DeshBhakt"
        let DeshBhaktWidth = doc.getTextWidth(DeshBhaktText)
        doc.text(DeshBhaktText, Xcenter + 110 - (DeshBhaktWidth / 2), Ycenter + 270)

        doc.save('example.pdf')

    }

    //generating PDF
    generatePDF()


    //pdf file path
    const pdfPath = path.join('./', 'example.pdf')
    const file = fs.readFileSync(pdfPath, (err, data) => {
        if (err) {
            console.log('file reading err')
        }
        return data
    })
    //converting pdf to base64 encodeing
    const base64string = file.toString('base64')
    res.json({ base64string: base64string })
})

export default router