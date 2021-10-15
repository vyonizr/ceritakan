function getRandomFloat(min: number, max: number) {
  const randomFloat = Math.random() * (max - min) + min

  return randomFloat.toFixed(1)
}

export default getRandomFloat
