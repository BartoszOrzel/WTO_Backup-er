const files = require('./files')
const fs = require('fs')
const test = 'E:/Dropbox/PROFILE/testfiles/'
const testDest = 'B:/Dropbox/PROFILE/testfiles/'


// Tablica plików używanych (atime) dawniej  od "days"
exports.FileStats = {
    currentTime: new Date(),
    arrayPromises: [],
    fileList: (dir) => {
        return fs.readdirSync(dir)
    },
    pathToFile: function (dir, file) {
        return `${dir}${file}`
    },
    lastModified: function (dir, file) {
        return fs.statSync(this.pathToFile(dir, file)).atime
    },
    difference: function (dir, file) {
        return Math.floor((this.currentTime - this.lastModified(dir, file)) / 1000 / 60 / 60 / 24)
    },
    expired: function (dir, days) {
        let arr = []
        this.fileList(dir).forEach((file) => {
            if (this.difference(dir, file) > days) {
                arr.push(this.pathToFile(dir, file))
            }
        })
        return arr
    },
    deleteExpired: function (dir, days) {
        this.expired(dir, days).forEach((file) => {
            console.log("delete expired:", file)
            
        })
    }
}

this.FileStats.deleteExpired(testDest, 21)
