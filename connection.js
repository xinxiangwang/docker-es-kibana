const esapi = require('elasticsearch')
const ESPORT = process.env.ES_PORT || 9200
const ESHOST = process.env.ES_HOST || 'localhost'
const client = new esapi.Client({ host: { host: ESHOST, port: ESPORT } })
const index = 'jdbook'

async function checkConnection() {
  let isConnected = false
    try {
      await client.cluster.health({})
      isConnected = true
    } catch (err) {
      console.log('connection failed, retrying...', err)
    }
  return isConnected
}

// 输入数据
async function inputData(hasConnect, bookList) {
  if (!hasConnect) return
  const schema = {
    "title": { "type": "text" },
    "img": { "type": "keyword" },
    "price": { "type": "float" },
    "name": { "type": "text" },
    "shopnum": { "type": "text" },
    "icons": { "type": "text" }
  }
  await client.indices.exists({
    index
  }).then(async res => {
    if (res) return
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: schema
        }
      }
    }, (err, res, status) => {
      console.log(err)
      console.log(res)
      console.log(status)
    })
  }).catch(err => {
    console.log(err)
  })

  const body = bookList.flatMap(doc => [{index: { _index: index }}, doc])
  await client.bulk({ refresh: true, body })
}

async function search(query) {
  const query_fields = ['name', 'title', 'icons']
  const should = query_fields.map(item => {
    return { match: { [item]: query.val } }
  })
  return client.search({
    index,
    body: {
      query: { bool: { should }},
      highlight: {
        pre_tags: "<span class='keywords'>",
        post_tags: "</span>",
        fields: {
          name: {},
          title: {},
          icons: {}
        }
      }
    },
    from: query.page || 1,
    size: 1000
  })
}

module.exports = {
  index,
  checkConnection,
  inputData,
  search
}