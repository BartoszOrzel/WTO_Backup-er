const files = require('./files')
const fs = require('fs')

const promiseResults = {
    success: [],
    errored: [],
    skipped: []
}

const test = "E:/Dropbox/PROFILE/testfiles/"
const testDest = "B:/Dropbox/PROFILE/testfiles/"



let testFiles = files.getFiles(test)
files.copyFiles(testFiles, "E:", "B:")
// testFiles.forEach(el=> {
//     promiseResults.success.push({test:el})
// })
// let a = Object.values(promiseResults.success[0])[0]
// console.log('\x1b[31m' +  a.split("/")[1] + '\x1b[0m' )
// console.log('test')


// const modificationDates = (file) => {
//     const sourceModificationDate =  fs.statSync(file).mtimeMs

//     let destFile = file.replace("E:", "B:")
//     const destinationModificationDate = fs.statSync(destFile)

//     return destinationModificationDate
//     // if (sourceModificationDate == destinationModificationDate) {
//     //     return true
//     // } else {
//     //     return false
//     // }
// }

// testFiles.forEach(file => {
//     console.log(JSON.stringify(modificationDates(file)))
// })