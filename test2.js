const objects = require('./objects')

const testDest = 'B:/Dropbox/PROFILE/testfiles/'
objects.FileStats.expired(testDest, 30).forEach(file => {
    console.log("delete file: " + file)
})