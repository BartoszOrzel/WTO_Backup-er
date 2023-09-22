const files = require('./files')
const fs = require('fs')
const test = 'E:/Dropbox/PROFILE/testfiles/'
const testDest = 'B:/Dropbox/PROFILE/testfiles/'

const getFiles = (dir, files = []) => {
  const fileList = fs.readdirSync(dir)
  const currentTime = new Date()
  let arrayOfObjects = []

  for (const file of fileList) {
    const name = `${dir}/${file}`
    const lastModified = fs.statSync(name).atime
    const differenceMs = currentTime - lastModified
    const seconds = Math.floor(differenceMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 730) {
      const promise = new Promise((resolve, reject) => {
        fs.unlink(name, (err) => {
          if (err)
            resolve({
              name: name,
              lastModified: lastModified,
              days: days,
              status: 'błąd',
            })
          resolve({
            name: name,
            lastModified: lastModified,
            days: days,
            status: 'usunieto',
          })
        })
      })
      arrayOfObjects.push(promise)
    }
  }

  Promise.all(arrayOfObjects)
    .then((results) => {
      const deleted = []
      const notDeleted = []

      results.forEach((file) => {
        const fileObj = {
          Plik: file.name,
          Data: file.lastModified.toDateString(),
          'Ost. modyfikacja': file.days + ' dni',
          Status: file.status,
        }

        if (file.status == 'błąd') {
          notDeleted.push(fileObj)
        } else {
          deleted.push(fileObj)
        }
      })

      console.log('-------------------------------Usunięte--------------------------------------')
      console.table(deleted)
      console.log('---------------------------------Błędy---------------------------------------')
      console.table(notDeleted)
    })
    .catch((failed) => {
      console.log(failed)
    })
}
getFiles(testDest)

