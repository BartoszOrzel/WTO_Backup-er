const files = require('./files')
const fs = require('fs')

const test = "E:/Dropbox/PROFILE/testfiles/"
const testDest = "B:/Dropbox/PROFILE/testfiles/"
let testFiles = files.getFiles(test)



const modificationDates = (file) => {
    const sourceModificationDate =  fs.statSync(file).mtimeMs

    let destFile = file.replace("E:", "B:")
    const destinationModificationDate = fs.statSync(destFile)

    return destinationModificationDate
    // if (sourceModificationDate == destinationModificationDate) {
    //     return true
    // } else {
    //     return false
    // }
}

testFiles.forEach(file => {
    console.log(JSON.stringify(modificationDates(file)))
})