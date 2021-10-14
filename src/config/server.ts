const isDev = process.env.NODE_ENV !== 'production'
const server = isDev
  ? `http://localhost:${process.env.PORT}/api`
  : `${process.env.DEPLOY_URL}/api`

export default server
