const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')
const colors = require('colors')

const { checkConnection, inputData, search } = require('./connection')

colors.enable()
const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0'
const app = express()
app.set('search page', 'ejs')
console.log(__dirname + '/views/public')
app.use(express.static(__dirname + '/views/public'))

// 进入地址
function getBook(page, type) {
  return new Promise((resolve, reject) => {
    console.log(colors.green("开始爬取"))
    superagent
      .get(`https://search.jd.com/Search?keyword=${type}&wq=${type}&page=${page}&s=1`)
      .end((err, res) => {
        if (err) {
          reject(false)
        } else {
          resolve(res.text)
        }
      })
  })
}

// 分析dom
function parseDom(bookText) {
  let $ = cheerio.load(bookText)
  let bookList = []
  $('div#J_goodsList ul li > div').each((idx, ele) => {
    let book = {
      title: '',
      img: '',
      price: '',
      name: '',
      shopnum: '',
      icons: []
    }
    if (!ele) return
    ele.children.forEach(Sele => {
      let cls = $(Sele).attr('class')
      if (cls === 'p-img') {
        Sele.children.forEach(img => {
          if (img.name === 'a') {
            book.title = $(img).attr('title')
            book.img = $(img.children[1]).attr('data-lazy-img')
          }
        })
      }
      if (cls === 'p-price') {
        book.price = $(Sele.children[1].children[2]).text()
      }
      if (cls === 'p-name') {
        book.name = $(Sele.children[1].children[1]).text()
      }
      if (cls === 'p-shopnum') {
        book.shopnum = $(Sele.children[1].children[0]).text()
      }
      if (cls === 'p-icons') {
        Sele.children.forEach(icon => {
          if(icon.name === 'i') {
            book.icons.push($(icon).text())
          }
        })
      }
    })
    bookList.push(book)
  })
  return bookList
}

app.get('/', (req, res) => {
  res.send('Hello Dockeraaxzc')
})

app.get('/zzz', async (req, res) => {
  for (let i = 3; i < 20; i++) {
    const bookText = await getBook(i, 'docker')
    try {
      bookList = parseDom(bookText)
      const hasConnect = checkConnection()
      inputData(hasConnect, bookList)
      console.log(i)
    } catch(err) {
      // res.json('错误信息' + err)
    }
  }
  res.send('爬取结束')
})

app.get('/search', (req, res) => {
  search(req.query).then(esData => {
    const book = esData.hits.hits.map(item => {
      return { ...item._source, ...item.highlight }
    })
    const { total, max_score } = esData.hits
    res.render('index.ejs', { book, total, max_score })
  }).catch(err => {
    console.log(err)
    res.render('index.ejs', { book: [], total: 0, max_score: 0 })
  })
})



app.listen(PORT, HOST)
console.log(`Runningaaa on http://${HOST}:${PORT}`);