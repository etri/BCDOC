import { Author } from '../types/index'

export function toyyyymmdd(date: Date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  var d = date.getDate()
  return `${y}.${m < 10 ? `0${m}` : m}.${d < 10 ? `0${d}` : d}`
}

export function toyyyy(date: Date) {
  var y = date.getFullYear()
  return `${y}`
}

export function parseAuthor(authorListStr: string): string {
  const authorList: Author[] = JSON.parse(authorListStr)

  return authorList.reduce((cumulated: string, author: Author, index: number) => {
    cumulated += `${author.name}${authorList.length - 1 !== index ? ', ' : ''}`

    return cumulated
  }, '')
}

export function getFirstAuthorID(authorListStr: string): string {
  const authorList: Author[] = JSON.parse(authorListStr)
  return authorList[0].id
}

export function getFirstAuthorName(authorListStr: string): string {
  const authorList: Author[] = JSON.parse(authorListStr)
  return authorList[0].name
}
