const _ = require('lodash');
const School  = require('../db/models/school');
const config = require('config');

const fs = require('fs');

const fileName = config.get('school.sourceJson');


module.exports.init = async () => {
    const sourceData = fs.readFileSync(fileName, 'utf8');
    const schoolData = JSON.parse(sourceData);
    return School.bulkCreate(schoolData, { returning: true }).catch(err => console.error(err));
};

module.exports.updateSchoolScore = async () => {
    const students = await School.findAll();
    const scores = await Promise.all(students.map(student => updateStudentScore(student)));
    return _.maxBy(scores, 'score')['id'];
};

function updateStudentScore(student) {
    const scores = _.get(student, 'scores') || [];
    let minIdx = scores.length;
    let minScore = Infinity;
    scores.forEach((score, idx) => {
        if (_.get(score, 'type') === 'homework' && _.get(score, 'score') < minScore) {
            minIdx = idx;
        }
    });

    return student.update({ scores })
        .then(() => _.assign({ id: _.get(student, '_id') }, {
            score: scores.reduce((sum, score) => sum + (_.get(score, 'score') || 0), 0)
        }))
        .catch(error => console.error(error))
}