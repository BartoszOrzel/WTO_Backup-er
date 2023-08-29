const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs')

fs.readdir('E:/Dropbox', (err, files) =>{
    console.log(files)
})
fs.stat('E:/Dropbox', (err,stat) =>{
    console.log(stat)
})

app.listen(port, () => {
    console.log(`Express został uruchomiony pod adresem http://localhost:${port}; ` + `naciśnij Ctrl-C, aby zakończyć.`)
})

