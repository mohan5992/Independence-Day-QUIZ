import express from 'express'
import path from 'path'
import generatePDF from './routes/generatePDF.js';

const app = express()


const port = 3000;
app.use(express.static('public'))
app.use(express.json());

app.use('/generatePDF', generatePDF)

// const base64Image = file.toString('base64');

app.get('/', (req, res) => {
    res.sendFile(path.join(serveStaticFile(), 'public', 'index.html'))
})

// app.get('/generatePDF',(req, res)=>{
//     console.log('get request')
//     res.send('hello world')
// })

// console.log(path.join(path.dirname(__filename), 'logo.png'))


app.listen(port, () => {
    console.log(`Independence Day app is listening on port: ${port}`)
})