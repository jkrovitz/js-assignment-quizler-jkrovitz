import fs from 'fs'

const _ = require("lodash");

export const chooseRandom = (array, num_items) =>
    array.length === 0 || array.length === 1 ?
        array : num_items === null ?
        _.sample(array) : _.sampleSize(array, num_items)

export const createPrompt = ({numQuestions = 1, numChoices = 2} = {}) => {
    const questionObj = questionNumber => ({
        type: 'input',
        name: `question-${questionNumber}`,
        message: `Enter question ${questionNumber}`
    })

    const choiceObj = (choiceNumber, questionNumber) => ({
        type: 'input',
        name: `question-${questionNumber}-choice-${choiceNumber}`,
        message: `Enter answer choice ${choiceNumber} for question ${questionNumber}`
    })

    return Array(numQuestions + numQuestions * numChoices)
        .fill()
        .map((val, idx) => {
            if (idx % (numChoices + 1) === 0) {
                return questionObj(
                    idx / (numChoices + 1) ? idx / (numChoices + 1) : 1
                )
            } else {
                return choiceObj(
                    idx % (numChoices + 1),
                    Math.ceil(idx / (numChoices + 1))
                )
            }
        })
}

export const createQuestions = (questionObject = {}) => {
    let questionKeys = Object.keys(questionObject)

    let questions = {}

    questionKeys.forEach(element => {
        if (!element.includes('choice')) {
            questions[element] = {
                type: 'list',
                name: element,
                message: questionObject[element],
                choices: []
            }
        } else {
            let indexString = 'question-' + element.split('-')[1]
            let tempObj = questions[indexString]
            tempObj['choices'].push(questionObject[element])
        }
        return Object.values(questions)
    })

    return Object.values(questions)
}

export const readFile = path =>
    new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
    })

export const writeFile = (path, data) =>
    new Promise((resolve, reject) => {
        fs.writeFile(path, data, err =>
            err ? reject(err) : resolve('File saved successfully')
        )
    })
