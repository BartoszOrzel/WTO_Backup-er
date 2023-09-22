const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const files = require('./files')
const DROPBOX = 'E:/Dropbox/'
const KLIENCI = "E:/!!! Klienci/"
const SOURCE = "E:"
const DESTINATION = "B:"
// const test = "E:/Dropbox/PROFILE/testfiles/"
let startBackup = true

const foldersToBackup = [
    'E:/Dropbox/',
    "E:/!!! Klienci/"
]

const testFolders = ['E:/Dropbox/PROFILE/testfiles/', 'E:/Dropbox/PROFILE/TESTY/']

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
        let i = 0


        backupFiles(i)
        function backupFiles(i) {
            let time = 0
            const timePassing = setInterval(function () {
                time++
            }, 1000)

            let filesArray = files.getFiles(foldersToBackup[i])
            // let filesArray = files.getFiles(testFolders[i])
            files.copyFilesByStream(filesArray, SOURCE, DESTINATION)
                .then(promiseResults => {
                    clearInterval(timePassing)
                    let minutesPassed = Math.floor(time / 60)
                    let secondsPassed = time % 360

                    console.log("----------------------------------------------------------------")
                    console.log('Zakończono kopiowanie folderu ' + foldersToBackup[i])
                    console.table([{ "Udane transfery": promiseResults.success.length, "Nieudane transfery": promiseResults.errored.length, "Pominięte ": promiseResults.skipped.length }])
                    console.log("----------------------------------------------------------------")
                    console.log("Czas trwania backupu: " + minutesPassed + ":" + secondsPassed)
                    i++
                    if (i < foldersToBackup.length) {
                    // if (i < testFolders.length) {
                        backupFiles(i)
                    }
                })

        }

       

        setTimeout(function () {
            startBackup = true
        }, 1000 * 60 * 120)
    }
    else if (startBackup === false) {
        // console.log("Backup w trakcie...")
    }
    else {
        console.log("Jest dopiero " + hour + ":" + minutes, "jest jeszcze czas na backup")
    }
}, 1000 * 60)