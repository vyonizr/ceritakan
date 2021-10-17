import {
  CARD_MAX_ROTATE_DEGREE,
  CARD_MIN_ROTATE_DEGREE,
} from 'src/common/constants'

function getRandomFloat(
  min = CARD_MIN_ROTATE_DEGREE,
  max = CARD_MAX_ROTATE_DEGREE
) {
  const randomFloat = Math.random() * (max - min) + min

  return randomFloat.toFixed(1)
}

export default getRandomFloat
