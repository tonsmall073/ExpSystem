const { AddBookRequestModel,
  AddBookResponseModel,
  GetBooksRequestModel,
  GetBooksResponseModel,
  UpdateBookRequestModel,
  UpdateBookResponseModel,
  DeleteBookRequestModel,
  DeleteBookResponseModel, } = require('./Model/Book.model');
const BookService = require('./Service/Book.Service');
const pathJoin = require('path');
class Book {
  _path
  _server
  _context
  constructor(ser, path, con) {
    this._server = ser;
    this._path = path;
    this._context = con
  }

  async Controller() {
    this._server.post(this._path, async (req, res) => {
      try {
        res.setHeader('Content-Type', 'application/json');

        if (req.body.Controller === "AddBooks") {

          if (!req.files.Image) throw new Error('Request param Image not file');
          const modelReq = new AddBookRequestModel();
          modelReq.DataImage = req.files.Image;
          modelReq.Title = req.body.Title;
          modelReq.Image = req.files.Image.name;
          modelReq.Description = req.body.Description;
          modelReq.Price = parseFloat(req.body.Price);
          if (isNaN(modelReq.Price)) throw new Error('Request param name Price to NaN want number only');

          const modelRes = new AddBookResponseModel();
          const service = new BookService(this._context);
          const content = await service.CreateAddBook(modelReq, modelRes);
          res.send(content);
          return true;

        } else if (req.body.Controller === "GetsBooks") {
          const modelReq = new GetBooksRequestModel();
          modelReq.StartLimit = parseInt(req.body.Start);
          if (isNaN(modelReq.StartLimit)) throw new Error('Request param name Start to NaN want number only');

          modelReq.LengthLimit = parseInt(req.body.Length);
          if (isNaN(modelReq.LengthLimit)) throw new Error('Request param name Length to NaN want number only');

          const modelRes = new GetBooksResponseModel();
          const service = new BookService(this._context);
          const content = await service.CreateDatasBook(modelReq, modelRes);
          res.send(content);
          return true;

        } else if (req.body.Controller === "GetsBooksDataTable") {
          const modelReq = new GetBooksRequestModel();
          modelReq.StartLimit = parseInt(req.body.start);
          if (isNaN(modelReq.StartLimit)) throw new Error('Request param name start to NaN want number only');

          modelReq.LengthLimit = parseInt(req.body.length);
          if (isNaN(modelReq.LengthLimit)) throw new Error('Request param name length to NaN want number only');

          const modelRes = new GetBooksResponseModel();
          const service = new BookService(this._context);
          const content = await service.CreateDatasBook(modelReq, modelRes);
          res.send(content);
          return true;

        }

        else if (req.body.Controller === "UpdateBooks") {

          const modelReq = new UpdateBookRequestModel();
          if (req.body.ChkUpload !== "Y") {
            if (!req.files.Image) throw new Error('Request param Image not file');
            modelReq.DataImage = req.files.Image;
            modelReq.Image = req.files.Image.name;
          }

          modelReq.Id = req.body.Id;
          modelReq.Title = req.body.Title;
          modelReq.Description = req.body.Description;
          modelReq.Price = parseFloat(req.body.Price);
          if (isNaN(modelReq.Price)) throw new Error('Request param name Price to NaN want number only');

          const modelRes = new UpdateBookResponseModel();
          const service = new BookService(this._context);
          const content = await service.CreateUpdateBook(modelReq, modelRes);
          res.send(content);
          return true;

        }
        else if (req.body.Controller === "DeleteBooks") {
          const modelReq = new DeleteBookRequestModel();
          modelReq.Id = req.body.Id;
          const modelRes = new DeleteBookResponseModel();
          const service = new BookService(this._context);
          const content = await service.CreateDeleteBook(modelReq, modelRes);
          res.send(content);
          return true;
        }
        else {

          res.send({ MessageDesc: `Controller ${req.body.Controller} unknown`, Status: 400 });
          return true;
        }
      } catch (err) {

        res.send({ MessageDesc: `Type POST Book service error message : ${err.message}`, Status: 500 });
        return true;
      }
    });

    this._server.get(this._path, async (req, res) => {
      try {
        if (req.query.Controller === "GetImageBooks") {

          res.sendFile(pathJoin.join(__dirname + `../../../Temp/${req.query.ImageName}`));

          return true;
        }
        else {
          res.send({ MessageDesc: `Controller ${req.query.Controller} unknown`, Status: 400 });
          return true;
        }

      } catch (err) {
        res.send({ MessageDesc: `Type GET Book service error message : ${err.message}`, Status: 500 });
        return true;
      }
    });
  }
}

module.exports = Book;