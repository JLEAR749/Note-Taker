const express = require('express');
const {v4:uuidv4} = require('uuid');
const path = require('path');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fsUtils');
const { receiveMessageOnPort } = require('worker_threads');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
readFromFile('./db/db.json','utf-8')
.then(data =>res.json(JSON.parse(data)))
});

app.post('/api/notes', (req, res) => {
  readAndAppend({
    id:uuidv4(),
    ...req.body 
  },'./db/db.json')
  .then(data =>{
    res.json(req.body)
  })
});

app.delete('/api/notes/:id', (req, res) => {
  readFromFile('./db/db.json','utf-8')
  .then(data =>{
const notes = JSON.parse(data).filter(note => (
  note.id !== req.params.id
))
  return writeToFile('./db/db.json', notes)
  }).then(()=>res.json({
    success:true
  }))
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
