import {
  CARD_MAX_ROTATE_DEGREE,
  CARD_MIN_ROTATE_DEGREE,
} from 'src/common/constants'

function getRandomIntInclusive(
  min = CARD_MIN_ROTATE_DEGREE,
  max = CARD_MAX_ROTATE_DEGREE
) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default getRandomIntInclusive
