const config = require('config');
const school = require('./modules/school');
const weather = require('./modules/weather');
const resizer = require('./modules/image-resizer');
const sequelize = require('./db/sequelize');

const OUTPUT_DIR = config.get('images.outputDir');

async function init() {
    await sequelize.sync({ force: config.get('db.sequelize.forceSync') });
    await school.init().catch(err => console.error(err));
    await weather.init().catch(err => console.error(err));

    await resizer.resizeImages();
    const stateWithLowestTemperature = await weather.getStateWithMinTemperature();
    const smartStudentId = await school.updateSchoolScore();
    return { stateWithLowestTemperature, smartStudentId };
}

init().catch(err => console.log(err));



