const config = require('config');
const _ = require('lodash');
const school = require('./modules/school');
const weather = require('./modules/weather');
const resizer = require('./modules/image-resizer');
const sequelize = require('./db/sequelize');

const OUTPUT_DIR = config.get('images.outputDir');
const IMAGE_RESIZE_TEST_NAME = config.get('images.testName');
const WEATHER_TEST_NAME = config.get('weather.testName');
const SCHOOL_TEST_NAME = config.get('school.testName');

async function init() {
    await sequelize.sync({ force: config.get('db.sequelize.forceSync') });
    await school.init();
    await weather.init();

    const result = {};

    await resizer.resizeImages();
    _.set(result, IMAGE_RESIZE_TEST_NAME, OUTPUT_DIR);
    _.set(result, WEATHER_TEST_NAME, await weather.getStateWithMinTemperature());
    _.set(result, SCHOOL_TEST_NAME, await school.updateSchoolScore());

    return { result };
}

init().then(result => console.log(result)).catch(err => console.log(err));



