const fs = require('fs');

module.exports.getFiles = (dir, files = []) => {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            this.getFiles(name, files);
        } else {
            files.push(name)
        }
    }
    return files;
}

module.exports.modificationDates = (file, SOURCE, DESTINATION) => {
    let destFile = file.replace(SOURCE, DESTINATION)
    if (fs.existsSync(destFile) === true) {
        const sourceModificationDate = fs.statSync(file).mtimeMs
        const destinationModificationDate = fs.statSync(destFile).mtimeMs

        if (sourceModificationDate == destinationModificationDate) {
            return true
        } else {
            return false
        }
    }
    else {
        return false
    }
}

module.exports.copyFilesNew = (filesArray, SOURCE, DESTINATION) => {
    return new Promise((resolve, reject) => {
        const obietnice = []

        const copyFilePromise = (source, destination) => {
            return new Promise((resolve, reject) => {
                fs.cp(source, destination, (err) => {
                    if (err) {
                        console.error(`${source} errno: ${err.errno} code: ${err.code} syscall: ${err.syscall}`)
                        resolve({ errored: source });
                    } else {
                        // console.log("success ->", destination )
                        resolve({ success: destination });
                    }
                })
            })
        }

        const skipFilePromise = (destination) => {
            return new Promise((resolve, reject) => {
                if (destination) {
                    // filesObject.skipped.push(destination)
                    // console.log("skipped ->", destination )
                    resolve({ skipped: destination })
                }
                else {
                    reject("Error: brak destynacji")
                }


            })
        }

        const loop = filesArray.map(file => {
            let destination = file.replace(SOURCE, DESTINATION);
            if (this.modificationDates(file, SOURCE, DESTINATION) === false) {
                const obietnicaKopiowania = copyFilePromise(file, destination)
                obietnice.push(obietnicaKopiowania)
            } else {
                const obietnicaPominiecia = skipFilePromise(destination)
                obietnice.push(obietnicaPominiecia)
            }
        })


        Promise.all(obietnice)
            .then(results => {
                // console.log(results)
                const promiseResults = {
                    success: [],
                    errored: [],
                    skipped: []
                }
                results.forEach(result => {
                    if (Object.keys(result) == "skipped") {
                        promiseResults.skipped.push(result)
                    }
                    else if (Object.keys(result) == "errored") {
                        promiseResults.errored.push(result)
                    }
                    else if (Object.keys(result) == "success") {
                        promiseResults.success.push(result)
                    }
                })
                // console.log("----------------------------------------------------------------")
                // console.log('Zakończono kopiowanie folderu ' + Object.values(results[0])[0].split("/")[1])
                // console.table([{ "Udane transfery": promiseResults.success.length, "Nieudane transfery": promiseResults.errored.length, "Pominięte ": promiseResults.skipped.length }])
                // console.log("----------------------------------------------------------------")
                // console.log()
                resolve(promiseResults)

            })
            .catch(errors => {
                console.error(errors)
            })
    })
}



module.exports.copyFilesByStream = (filesArray, SOURCE, DESTINATION) => {
    return new Promise((resolve, reject) => {
        const obietnice = []

        const copyFilePromise = (source, destination) => {
            return new Promise((resolve, reject) => {
                // console.time('copying')
                fs.stat(source, function (err, stat) {
                    // const filesize = stat.size
                    // let bytesCopied = 0

                    const readStream = fs.createReadStream(source)
                    readStream.on('error', function () {
                        console.log("errored ->", source)
                        resolve({ errored: source })
                    })

                    // readStream.on('data', function (buffer) {
                    //     bytesCopied += buffer.length
                    //     let porcentage = ((bytesCopied / filesize) * 100).toFixed(2)
                    //     console.log(porcentage + '%') // run once with this and later with this line commented
                    // })
                    readStream.on('end', function () {
                        // console.timeEnd('end')
                        console.log("success ->", destination)
                        resolve({ success: destination })
                    })

                    const writeStream = fs.createWriteStream(destination)
                    readStream.pipe(writeStream)

                    writeStream.on("error", () => {
                        console.log("errored ->", destination)
                        resolve({ errored: destination })
                    })

                })
            })
        }

        const skipFilePromise = (destination) => {
            return new Promise((resolve, reject) => {
                if (destination) {
                    // filesObject.skipped.push(destination)
                    console.log("skipped ->", destination)
                    resolve({ skipped: destination })
                }
                else {
                    reject("Error: brak destynacji")
                }


            })
        }

        const loop = filesArray.map(file => {
            let destination = file.replace(SOURCE, DESTINATION);
            if (this.modificationDates(file, SOURCE, DESTINATION) === false) {
                const obietnicaKopiowania = copyFilePromise(file, destination)
                obietnice.push(obietnicaKopiowania)
            } else {
                const obietnicaPominiecia = skipFilePromise(destination)
                obietnice.push(obietnicaPominiecia)
            }
        })


        Promise.all(obietnice)
            .then(results => {
                // console.log(results)
                const promiseResults = {
                    success: [],
                    errored: [],
                    skipped: []
                }
                results.forEach(result => {
                    if (Object.keys(result) == "skipped") {
                        promiseResults.skipped.push(result)
                    }
                    else if (Object.keys(result) == "errored") {
                        promiseResults.errored.push(result)
                    }
                    else if (Object.keys(result) == "success") {
                        promiseResults.success.push(result)
                    }
                })
                // console.log("----------------------------------------------------------------")
                // console.log('Zakończono kopiowanie folderu ' + Object.values(results[0])[0].split("/")[1])
                // console.table([{ "Udane transfery": promiseResults.success.length, "Nieudane transfery": promiseResults.errored.length, "Pominięte ": promiseResults.skipped.length }])
                // console.log("----------------------------------------------------------------")
                // console.log()
                resolve(promiseResults)

            })
            .catch(errors => {
                console.error(errors)
            })
    })
}
