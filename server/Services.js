const express = require('express');
const server = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const port = 8000;

const ConDatabases = require('./Connections/ConDatabases');
const Book = require('./Services/Book/Book.controller');

const _connect = new ConDatabases();
const bodyParser = require('body-parser');

//start setting express
server.use(bodyParser.urlencoded({ extended: false }));
server.use(fileUpload({ createParentPath: true }));
server.use(cors());
server.use(express.json());
//end setting express

async function StartServices() {
  try {
    const _context = await _connect.ExpSystem();

    if (_context instanceof TypeError)
      throw new ('Connect Database name ExpSystem Fail!');

    //Start ServerService
    const book = new Book(server, "/Books", _context);
    await book.Controller();
    //End ServerService

    server.listen(port, () => {
      console.log(`Services start success port ${port}`);
    });
  } catch (err) {
    console.log(`Services start fail! : error message : ` + err.message);
  }
}
StartServices();

