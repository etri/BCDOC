require('dotenv').config()

const MongoClient = require('mongodb').MongoClient
const _ = require('lodash')
const http = require('http')
const rp = require('request-promise')

const host = 'http://localhost:4000'
const users = []
const documents = []
const orgs = ['org1', 'org2']

const buildUsers = async count => {
  for (let i = 0; i < count; i++) {
    const userID = getRandomID(5)
    const password = getRandomID(10)
    const userName = getRandomName()
    const orgName = orgs[getRandomInt(0, 2)]
    const departmentName = 'department1'

    const bodyToRegister = {
      orgName,
      departmentName,
      userID,
      userName,
      password
    }

    await register(bodyToRegister)

    const bodyToLogin = {
      orgName,
      departmentName,
      password
    }

    const payload = await login(userID, bodyToLogin)
    console.log({
      userID,
      userName,
      password,
      orgName,
      departmentName,
      jwt: payload.jwt
    })

    users.push({
      userID,
      userName,
      password,
      orgName,
      departmentName,
      jwt: payload.jwt
    })
  }
}

const register = async body => {
  const options = {
    uri: `${host}/user`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
    json: true
  }

  const response = await rp(options)
  return response.payload
}

const login = async (userID, body) => {
  const options = {
    uri: `${host}/user/${userID}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
    json: true
  }

  const response = await rp(options)
  return response.payload
}

const buildDocument = async count => {
  for (let i = 0; i < count; i++) {
    const author = users[getRandomInt(0, users.length)]

    // Field setting
    const docID = getRandomID(10)
    const docType = getRandomType()

    const authorList = JSON.stringify([
      { id: author.userID, name: author.userName },
      ...getRandomNameList()
    ])

    let document = {}
    document.title = getRandomTitle()
    document.authorList = authorList
    document.projectID = getRandomID(5)
    document.fileName = getRandomFileName()
    document.version = `v${getRandomInt(0, 100)}`
    document.issueDate = getRandomMillisecond()

    const response = await createDocument(document, docID, docType, author.jwt)
    const hashValue = response.payload.versionList[0].hashValue
    documents.push({ docID, hashValue })
    console.log({ docID, docType, hashValue })
  }
}

const createDocument = async (document, docID, docType, jwt) => {
  const options = {
    uri: `${host}/document/${docType}/${docID}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: document,
    json: true
  }

  return await rp(options)
}

const buildEvaluation = async count => {
  const docsLength = documents.length
  const usersLength = users.length

  for (let i = 0; i < count; i++) {
    const target = documents[getRandomInt(0, docsLength)]
    const evaluator = users[getRandomInt(0, usersLength)]
    let comment = ''

    for (let j = 0; j < getRandomInt(0, 100); j++) {
      comment += getRandomWord(nouns) + ' '
    }

    const evaluatorJWT = evaluator.jwt
    const evaluationID = getRandomID(10)
    const evaluation = {
      score: getRandomInt(0, 6),
      comment,
      date: getRandomInt(1231231, 1231231231),
      documentID: target.docID,
      documentHashValue: target.hashValue,
      evaluatorID: evaluator.userID
    }

    const response = await createEvaluation(evaluation, evaluationID, evaluatorJWT)
    console.log(response)
  }
}

const createEvaluation = async (evaluation, evaluationID, jwt) => {
  const options = {
    uri: `${host}/evaluation/${evaluationID}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`
    },
    body: evaluation,
    json: true
  }

  return await rp(options)
}

const sendPOST = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, () => resolve())
    req.write(JSON.stringify(data))
    req.end()
  })
}

const getRandomID = len => {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < len; i++) {
    text += possible.charAt(getRandomInt(0, possible.length))
  }

  return text
}

const getRandomMillisecond = () => {
  return getRandomInt(1134757440000, 1540690931715)
}

const getRandomNameList = () => {
  const count = getRandomInt(1, 8)
  const list = []
  for (let i = 0; i < count; i++) {
    list.push({
      id: getRandomID(6),
      name: getRandomName()
    })
  }

  return list
}

const getRandomTitle = () => {
  return `${getRandomWord(adjectives)}_${getRandomWord(nouns)}_${getRandomWord(
    adjectives
  )}_${getRandomWord(nouns)}`
}

const getRandomFileName = () => {
  return `${getRandomWord(adjectives)}_${getRandomWord(nouns)}_${getRandomWord(
    adjectives
  )}_${getRandomWord(nouns)}.docx`
}

const getRandomType = () => {
  return getRandomWord(docType)
}

const getRandomName = () => {
  return `${getRandomWord(adjectives)} ${getRandomWord(nouns)}`
}

const getRandomWord = list => {
  const index = getRandomInt(0, list.length)
  return list[index]
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

var docType = [
  'technical-document',
  'paper-document',
  'patent-document',
  'report-document',
  'book-document',
  'standard-document'
]

var adjectives = [
  'adamant',
  'adroit',
  'amatory',
  'animistic',
  'antic',
  'arcadian',
  'baleful',
  'bellicose',
  'bilious',
  'boorish',
  'calamitous',
  'caustic',
  'cerulean',
  'comely',
  'concomitant',
  'contumacious',
  'corpulent',
  'crapulous',
  'defamatory',
  'didactic',
  'dilatory',
  'dowdy',
  'efficacious',
  'effulgent',
  'egregious',
  'endemic',
  'equanimous',
  'execrable',
  'fastidious',
  'feckless',
  'fecund',
  'friable',
  'fulsome',
  'garrulous',
  'guileless',
  'gustatory',
  'heuristic',
  'histrionic',
  'hubristic',
  'incendiary',
  'insidious',
  'insolent',
  'intransigent',
  'inveterate',
  'invidious',
  'irksome',
  'jejune',
  'jocular',
  'judicious',
  'lachrymose',
  'limpid',
  'loquacious',
  'luminous',
  'mannered',
  'mendacious',
  'meretricious',
  'minatory',
  'mordant',
  'munificent',
  'nefarious',
  'noxious',
  'obtuse',
  'parsimonious',
  'pendulous',
  'pernicious',
  'pervasive',
  'petulant',
  'platitudinous',
  'precipitate',
  'propitious',
  'puckish',
  'querulous',
  'quiescent',
  'rebarbative',
  'recalcitant',
  'redolent',
  'rhadamanthine',
  'risible',
  'ruminative',
  'sagacious',
  'salubrious',
  'sartorial',
  'sclerotic',
  'serpentine',
  'spasmodic',
  'strident',
  'taciturn',
  'tenacious',
  'tremulous',
  'trenchant',
  'turbulent',
  'turgid',
  'ubiquitous',
  'uxorious',
  'verdant',
  'voluble',
  'voracious',
  'wheedling',
  'withering',
  'zealous'
]
var nouns = [
  'ninja',
  'chair',
  'pancake',
  'statue',
  'unicorn',
  'rainbows',
  'laser',
  'senor',
  'bunny',
  'captain',
  'nibblets',
  'cupcake',
  'carrot',
  'gnomes',
  'glitter',
  'potato',
  'salad',
  'toejam',
  'curtains',
  'beets',
  'toilet',
  'exorcism',
  'stick figures',
  'mermaid eggs',
  'sea barnacles',
  'dragons',
  'jellybeans',
  'snakes',
  'dolls',
  'bushes',
  'cookies',
  'apples',
  'ice cream',
  'ukulele',
  'kazoo',
  'banjo',
  'opera singer',
  'circus',
  'trampoline',
  'carousel',
  'carnival',
  'locomotive',
  'hot air balloon',
  'praying mantis',
  'animator',
  'artisan',
  'artist',
  'colorist',
  'inker',
  'coppersmith',
  'director',
  'designer',
  'flatter',
  'stylist',
  'leadman',
  'limner',
  'make-up artist',
  'model',
  'musician',
  'penciller',
  'producer',
  'scenographer',
  'set decorator',
  'silversmith',
  'teacher',
  'auto mechanic',
  'beader',
  'bobbin boy',
  'clerk of the chapel',
  'filling station attendant',
  'foreman',
  'maintenance engineering',
  'mechanic',
  'miller',
  'moldmaker',
  'panel beater',
  'patternmaker',
  'plant operator',
  'plumber',
  'sawfiler',
  'shop foreman',
  'soaper',
  'stationary engineer',
  'wheelwright',
  'woodworkers'
]

buildUsers(4)
  .then(() => buildDocument(20))
  .then(() => buildEvaluation(20))
