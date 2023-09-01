const fs = require('fs')



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

module.exports.copyFiles = (filesArray, SOURCE, DESTINATION) => {
    const filesObject = {
        success: [],
        errored: [],
        skipped: []
    }
    const copyFilePromise = (source, destination) => {
        return new Promise((resolve, reject) => {
            fs.cp(source, destination, (err) => {
                if (err) {
                    const errorMessage = `${source} errno: ${err.errno} code: ${err.code} syscall: ${err.syscall}`;
                    reject(errorMessage);
                } else {
                    resolve(destination);
                }
            })
        })
    }

    const promises = filesArray.map(file => {
        let destination = file.replace(SOURCE, DESTINATION);
        if (this.modificationDates(file, SOURCE, DESTINATION) === false) {
            return copyFilePromise(file, destination)
                .then(destination => {
                    filesObject.success.push(destination)
                    console.log("done -> ", destination)
                    return { success: destination }
                })
                .catch(error => {
                    filesObject.errored.push(error);
                    console.error(error)
                    return { errored: error }
                });
        } else {
            filesObject.skipped.push(destination)
            console.log("skipped ->", destination)
            return Promise.resolve({ skipped: destination })
        }
    })

    Promise.all(promises).then(results => {
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
        console.table([{ "Udane transfery": promiseResults.success.length, "Nieudane transfery": promiseResults.errored.length, "Pominięte": promiseResults.skipped.length }])
    })

}