const File = require('./src/lib/file')

const data = File.read('./connect.json',{
    version: '1.4.0'
})

File.write('./connect.json', data)