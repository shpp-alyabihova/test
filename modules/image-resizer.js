const _ = require('lodash');
const sharp = require('sharp');
const fse = require('fs-extra');
const config = require('config');

const FILE_PATH = config.get('images.path');
const OUTPUT_DIR = config.get('images.outputDir');
const SIZES = config.get('images.sizes');

module.exports.resizeImages = async (filePath = FILE_PATH) => {
    const filesList = await getFiles(filePath);
    const images = _.flattenDeep(filesList).filter(fileName => fileName.toLowerCase().endsWith('.jpg'));
    await ensureDir(OUTPUT_DIR);

    await Promise.all(images.map(image => fse.readFile(image)
        .then(buff => Promise.all(SIZES
            .map(size => resize(buff, size)
                .then(data => fse.writeFile(`${OUTPUT_DIR}/${size}x${size}_${_.last(image.split('/'))}`, data)))))
        .catch(error => console.error(error))));
};

async function ensureDir(dirPath) {
    try {
        await fse.stat(dirPath);
    } catch (error) {
        if (_.get(error, 'message').includes('ENOENT')) {
            await fse.mkdir(dirPath)
        }
    }
}

async function resize(buff, size) {
    return sharp(buff)
        .resize(size, size)
        .withoutEnlargement(true)
        .toBuffer();
}

async function getFiles(sourcePath) {
    const stats = await fse.stat(sourcePath);
    if (stats.isFile()) {
        return _.concat(sourcePath);
    } else if (stats.isDirectory()){
        return getFileList(sourcePath);
    }
    return [];
}


async function getFileList(dirPath) {
    const fileList = await fse.readdir(dirPath);
    return await Promise.all(fileList.map(filePath => getFiles(`${dirPath}/${filePath}`)));
}
