class AddBookRequestModel {
  Title;
  Description;
  Image;
  DataImage;
  Price = 0;
}

class AddBookResponseModel {
  MessageDesc;
  Status;
}

class GetBooksRequestModel {
  Draw = 0;
  OrderColumn;
  OrderDir;
  StartLimit = 0;
  LengthLimit = 0;
  ColumnName;
  SearchValue;
}

class GetBooksResponseModel {
  Datas = new Array();
  RecordsTotal;
  RecordsFiltered;
  Draw = 0;
  MessageDesc;
  Status;

  async PushDatasList() {
    const objList = new getBooksDatasListResponse();
    this.Datas.push(objList);
    const posi = parseInt(this.Datas.length) - parseInt(1);
    return posi;
  }
}

class getBooksDatasListResponse {
  Id;
  Title;
  Description;
  Image;
  Price = 0;
  CreatedAt;
  UpdatedAt;
}

class UpdateBookRequestModel {
  Id;
  Title;
  Description;
  Image;
  DataImage;
  Price = 0;
}

class UpdateBookResponseModel {
  MessageDesc;
  Status;
}

class DeleteBookRequestModel {
  Id;
}

class DeleteBookResponseModel {
  MessageDesc;
  Status;
}

module.exports = {
  AddBookResponseModel,
  AddBookRequestModel,
  UpdateBookRequestModel,
  UpdateBookResponseModel,
  GetBooksRequestModel,
  GetBooksResponseModel,
  DeleteBookRequestModel,
  DeleteBookResponseModel,
};
