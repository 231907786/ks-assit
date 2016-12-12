const login = require('./login')
const requestJSON = require('./requestInventoryToJSON');

export default async ({username, password}) => {
  await login([username, password])
  const obj = await requestJSON()
  console.log(typeof obj, obj)
}
