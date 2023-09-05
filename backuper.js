const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const files = require('./files')
const DROPBOX = 'E:/Dropbox/'
const KLIENCI = "E:/!!! Klienci/"
const SOURCE = "E:"
const DESTINATION = "B:"
const test = "E:/Dropbox/PROFILE/testfiles/"
let startBackup = true

const foldersToBackup = [
    'E:/Dropbox/',
    "E:/!!! Klienci/"
]

app.listen(port, () => {
    console.log(`Express został uruchomiony pod adresem http://localhost:${port};`)
})

setInterval(function () {
    let now = new Date()
    let hour = now.getHours()
    let minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()

    if (hour == 23 && startBackup === true) {
        startBackup = false
        console.log("Wybiła godzina 23.00. Czas zrobić backup :) !!!")

        foldersToBackup.forEach(folder => {
            let filesArray = files.getFiles(folder)
            files.copyFiles(filesArray, SOURCE, DESTINATION)
        })

        setTimeout(function() {
            startBackup = true
        }, 1000 * 60 * 120)
    }
    else if (startBackup === false) {
        console.log("Backup w trakcie...")
    }
    else {
        console.log("Jest dopiero " + hour + ":" + minutes, "jest jeszcze czas na backup")
    }
}, 1000 * 60)