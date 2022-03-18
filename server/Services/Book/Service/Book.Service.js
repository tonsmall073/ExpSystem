class BookService {
  _ObjectID = require('mongodb').ObjectID;
  _context;
  constructor(con) {
    this._context = con;
  }
  _serviceTime = require('./../../../Libs/DateTime/GetDateTime.service');

  async CreateAddBook(modelReq, modelRes) {
    try {
      const res = await this.insertBook(
        modelReq.Title,
        modelReq.Description,
        modelReq.Image,
        modelReq.Price,
      );

      if (res instanceof TypeError) {
        modelRes.MessageDesc = `Method name CreateAddBook error message : ${res.message}`;
        modelRes.Status = 500;
        return modelRes;
      }
      modelReq.DataImage.mv('Temp/' + modelReq.Image);
      modelRes.MessageDesc = "Success";
      modelRes.Status = 200;
      return modelRes;
    } catch (err) {
      return { MessageDesc: `Method name CreateAddBook error message : ${err.message}` };
    }
  }

  async CreateDatasBook(modelReq, modelRes) {
    try {
      const res = await this.getBooks(
        modelReq.StartLimit,
        modelReq.LengthLimit,
        modelReq.SearchValue,
        modelReq.ColumnName,
        modelReq.OrderDir,

      );
      if (res instanceof TypeError) {
        modelRes.MessageDesc = `Method name getBooks error message : ${res.message}`;
        modelRes.Status = 500;
        return modelRes;
      }

      const fullRows = await this.getFullRowBook(modelReq.SearchValue);

      if (fullRows instanceof TypeError) {
        modelRes.MessageDesc = `Method name getFullRowBook error message : ${fullRows.message}`;
        modelRes.Status = 500;
        return modelRes;
      }

      await this.mapGetBooksResponseModel(modelRes, res);

      modelRes.RecordsTotal = fullRows;
      modelRes.RecordsFiltered = fullRows;
      modelRes.MessageDesc = "Success";
      modelRes.Status = 200;
      return modelRes;
    }
    catch (err) {
      return { MessageDesc: `Method name CreateDatasBook error message : ${err.message}` };
    }
  }

  async CreateUpdateBook(modelReq, modelRes) {
    try {
      const res = await this.updateBook(
        modelReq.Id,
        modelReq.Image,
        modelReq.Title,
        modelReq.Description,
        modelReq.Price,
        modelReq.DataImage,
      );

      if (res instanceof TypeError) {
        modelRes.MessageDesc = `Method name updateBook error message : ${res.message}`;
        modelRes.Status = 500;
        return modelRes;
      }
      //ไม่อัพรูปรูปก็ยังเหมือนเดิม
      if (modelReq.DataImage) modelReq.DataImage.mv('Temp/' + modelReq.Image);
      modelRes.MessageDesc = "Success";
      modelRes.Status = 200;
      return modelRes;

    } catch (err) {
      return { MessageDesc: `Method name CreateUpdateBook error message : ${err.message}` };
    }
  }

  async CreateDeleteBook(modelReq, modelRes) {
    try {
      const res = await this.deleteBook(
        modelReq.Id,
      );
      if (res instanceof TypeError) {
        modelRes.MessageDesc = `Method name deleteBook error message : ${res.message}`;
        modelRes.Status = 500;
        return modelRes;
      }

      modelRes.MessageDesc = "Success";
      modelRes.Status = 200;
      return modelRes;
    }
    catch (err) {
      return { MessageDesc: `Method name CreateDeleteBook error message : ${err.message}` };
    }
  }

  async insertBook(valTitle, valDes, valImage, valPrice) {
    try {
      const service = new (this._serviceTime);
      const createDateTime = await service.AsyncDateTimeNow();

      const datas = {
        title: valTitle,
        description: valDes,
        image: valImage,
        price: valPrice,
        created_at: createDateTime,
        updated_at: "0000-00-00 00:00:00",
      };

      const res = await this._context.collection("Books").insertOne(datas);
      return res;
    } catch (err) {
      return err;
    }
  }

  async getBooks(
    valStart,
    valLimit,
    valSearch = "",
    valColumn = "",
    valOrderBy = "",
  ) {
    try {

      let mapColumnSearch = [];
      const regExpSearch = new RegExp(`.*${valSearch}.*`);
      mapColumnSearch.push({ "_id": regExpSearch });
      mapColumnSearch.push({ "title": regExpSearch });
      mapColumnSearch.push({ "description": regExpSearch });
      mapColumnSearch.push({ "image": regExpSearch });
      mapColumnSearch.push({ "price": parseFloat(valSearch) });
      mapColumnSearch.push({ "created_at": regExpSearch });
      mapColumnSearch.push({ "updated_at": regExpSearch });

      let columnSort = {};
      if (valColumn !== "" && valOrderBy !== "") {
        if (valOrderBy === 'ASC' || valOrderBy === 'asc') {
          columnSort[valColumn] = 1;
        } else {
          columnSort[valColumn] = -1;
        }
      }

      const res = await this._context.collection("Books")
        .find({ $or: mapColumnSearch })
        .sort(columnSort)
        .skip(parseInt(valStart) > 0 ? parseInt(valStart) : parseInt(0))
        .limit(parseInt(valLimit))
        .toArray();
      return res;
    } catch (err) {
      return err;
    }
  }

  async getFullRowBook(valSearch = "") {
    try {
      let mapColumnSearch = [];
      const regExpSearch = new RegExp(`.*${valSearch}.*`);
      mapColumnSearch.push({ "_id": regExpSearch });
      mapColumnSearch.push({ "title": regExpSearch });
      mapColumnSearch.push({ "description": regExpSearch });
      mapColumnSearch.push({ "image": regExpSearch });
      mapColumnSearch.push({ "price": parseFloat(valSearch) });
      mapColumnSearch.push({ "created_at": regExpSearch });
      mapColumnSearch.push({ "updated_at": regExpSearch });

      const res = await this._context.collection("Books")
        .find({ $or: mapColumnSearch })
        .limit(parseInt(0))
        .toArray();
      return res.length;
    } catch (err) {
      return err;
    }
  }

  async mapGetBooksResponseModel(modelRes, params) {
    try {
      for (let datas of params) {
        const row = await modelRes.PushDatasList();
        modelRes.Datas[row].Id = datas._id;
        modelRes.Datas[row].Title = datas.title;
        modelRes.Datas[row].Description = datas.description;
        modelRes.Datas[row].Image = datas.image;
        modelRes.Datas[row].Price = datas.price;
        modelRes.Datas[row].CreatedAt = datas.created_at;
        modelRes.Datas[row].UpdatedAt = datas.updated_at;
      }
      return true
    }
    catch (err) {
      return err;
    }
  }

  async updateBook(
    valId,
    valImage,
    valTitle,
    valDescription,
    valPrice,
    datasImg,
  ) {
    try {
      const service = new (this._serviceTime);
      const createDateTime = await service.AsyncDateTimeNow();
      let update = {};
      if (datasImg) {
        update = { $set: { updated_at: createDateTime, image: valImage, title: valTitle, description: valDescription, price: valPrice } };
      } else {
        update = { $set: { updated_at: createDateTime, title: valTitle, description: valDescription, price: valPrice } };
      }
      const res = await this._context.collection("Books").updateOne(
        { _id: this._ObjectID(valId) },
        update,
      );
      return res;
    } catch (err) {
      return err;
    }
  }

  async deleteBook(valId) {
    try {
      const res = await this._context.collection("Books").deleteOne(
        { _id: this._ObjectID(valId) }
      );
      return res;
    } catch (err) {
      return err;
    }
  }
}

module.exports = BookService;
