import React from 'react';
import './App.css';
import $ from 'jquery';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      _showModelBook: false,
      _showModalEditBook: false,
      idKeyEdit: 0,
    });
  }

  _dataTableUseReLoad;

  closeModalEditBook = () => { this.setState({ _showModalEditBook: false }); };
  closeModalAddBook = () => { this.setState({ _showModelBook: false }); };
  openModalAddBook = () => { this.setState({ _showModelBook: true }); };
  componentDidMount() {

    this.elemBookTable = $(this.elemBookTable)
    this._dataTableUseReLoad = this.elemBookTable.DataTable(
      {
        data: this.props.data,
        "processing": true,
        "serverSide": true,
        "ajax": {
          "url": 'http://localhost:8000/Books',
          "type": 'POST',
          "data": {
            "Controller": 'GetsBooksDataTable'
          },
          dataFilter: (datas) => {
            const json = JSON.parse(datas);
            if (json.Datas === null) json.Datas = [];
            json.Datas.forEach((obj) => {
              obj.De = obj.Id;
              obj.Image = `http://localhost:8000/Books?Controller=GetImageBooks&ImageName=${obj.Image}`;
            });
            json.data = json.Datas;
            json.recordsTotal = json.RecordsTotal;
            json.recordsFiltered = json.RecordsFiltered;
            return JSON.stringify(json);
          }
        },
        columnDefs: [
          {
            targets: [4],
            createdCell: (td, cellData, row) =>
              ReactDOM.render(
                <Row>
                  <Col>
                    <a target='_blank' href={row.Image} rel="noreferrer">
                      <img src={row.Image} style={{ height: " 77px" }} alt="" />
                    </a>
                  </Col>
                </Row>
                , td)
          }, {
            targets: [7],
            createdCell: (td, cellData, row) =>
              ReactDOM.render(
                <Row>
                  <Col>
                    <button className='btn btn-sm btn-warning' onClick={() => this.showModalEditBook(row.Id, row.Title, row.Description, row.Price, row.Image)}>Edit</button>
                    <button className='btn btn-sm btn-danger' onClick={() => this.deleteBooks(row.Id)}>Delete</button>
                  </Col>
                </Row>
                , td)
          }
        ],
        columns: [
          {
            title: 'Id',
            data: 'Id',
            name: '_id',
            orderable: false
          }, {
            title: 'Title',
            data: 'Title',
            name: 'title',
            orderable: false
          }, {
            title: 'Description',
            data: 'Description',
            name: 'description',
            orderable: false
          }, {
            title: 'Price',
            data: 'Price',
            name: 'price',
            orderable: false
          }, {
            title: 'Image',
            data: 'Image',
            name: 'image',
            orderable: false
          }, {
            title: 'CreatedAt',
            data: 'CreatedAt',
            name: 'created_at',
            orderable: false
          }, {
            title: 'UpdatedAt',
            data: 'UpdatedAt',
            name: 'updated_at',
            orderable: false
          }, {
            title: 'Edit/Del',
            data: 'De',
            name: '_id',
            orderable: false
          }
          //เวลาไม่พอที่จะทำ
        ], "searching": false
        , "scrollX": true

      }
    );
  }

  async saveBook() {
    try {
      if (!$("#title").val()) {
        alert('Title Please key in the information');
        $("#title").focus()
        return false;
      }
      if (!$("#description").val()) {
        alert('Title Description key in the information');
        $("#description").focus();
        return false;
      }
      if (!$("#price").val()) {
        alert('Title Price key in the information');
        $("#price").focus();
        return false;
      }
      // if (!$("#image").val()) {
      //   alert('Title Image key in the information');
      //   $("#image").focus();
      //   return false;
      // }
      if (document.getElementById("image").files.length === 0) {
        alert('Please upload file');
        $("#image").focus();
        return false;
      }
      const datasForm = new FormData();
      datasForm.append('Controller', 'AddBooks');
      datasForm.append('Title', $("#title").val());
      datasForm.append('Description', $("#description").val());
      datasForm.append('Price', $("#price").val());
      datasForm.append('Image', document.getElementById("image").files[0]);
      // let mapReq = {};

      // await datasForm.forEach((val, key) => {
      //   mapReq[key] = val;
      // });
      const res = await $.ajax({
        "url": 'http://localhost:8000/Books',
        "type": 'POST',
        "processData": false,
        "contentType": false,
        "dataType": 'JSON',
        "data": datasForm,
        success: async (dataRes) => {
          return dataRes;
        }
      });

      if (res.Status !== 200) {
        alert('Add Book Fail! status : ' + res.Status + " error message : " + res.MessageDesc);
        return false;
      }

      await this._dataTableUseReLoad.ajax.reload();
      await this.setState({ _showModelBook: false });
      alert('Save datas success!');
      return true;
    } catch (err) {
      alert(`Function name saveBook ${err.message}`);
      return false;
    }
  }

  async showModalEditBook(valId, valTitle, valDescription, valPrice, valImage) {
    try {

      await this.setState({ idKeyEdit: valId, _showModalEditBook: true });
      await $("#editTitle").val(valTitle);
      await $("#editDescription").val(valDescription);
      await $("#editPrice").val(valPrice);
      // await $("#editImage").val(valImage);

      return true;
    } catch (err) {
      alert(`Function showModalEditBook error message : ${err.message}`);
      return false;
    }
  };

  async updateBooks(valId) {
    try {
      if (!$("#editTitle").val()) {
        alert('Title Please key in the information');
        $("#editTitle").focus()
        return false;
      }
      if (!$("#editDescription").val()) {
        alert('Title Description key in the information');
        $("#editDescription").focus();
        return false;
      }
      if (!$("#editPrice").val()) {
        alert('Title Price key in the information');
        $("#editPrice").focus();
        return false;
      }
      // if (!$("#editImage").val()) {
      //   alert('Title Image key in the information');
      //   $("#editImage").focus();
      //   return false;
      // }
      if ($("#chkEditImage:checked").val() !== "Y") {
        if (document.getElementById("editImage").files.length === 0) {
          alert('Please upload file');
          $("#editImage").focus();
          return false;
        }
      }
      const datasForm = new FormData();
      datasForm.append('Controller', 'UpdateBooks');
      datasForm.append('Id', valId);
      datasForm.append('Title', $("#editTitle").val());
      datasForm.append('Description', $("#editDescription").val());
      datasForm.append('Price', $("#editPrice").val());
      datasForm.append('Image', window.document.getElementById("editImage").files[0]);
      datasForm.append('ChkUpload', $("#chkEditImage:checked").val());
      // let mapReq = {};

      // await datasForm.forEach((val, key) => {
      //   mapReq[key] = val;
      // });

      const res = await $.ajax({
        "url": 'http://localhost:8000/Books',
        "type": 'POST',
        "dataType": 'JSON',
        "processData": false,
        "contentType": false,
        "data": datasForm,
        success: async (dataRes) => {
          return dataRes;
        }
      });

      if (res.Status !== 200) {
        alert('Update Book Fail! status : ' + res.Status + " error message : " + res.MessageDesc);
        return false;
      }

      await this._dataTableUseReLoad.ajax.reload();
      await this.setState({ _showModalEditBook: false });
      alert('Update datas success!');
      return true;
    } catch (err) {
      alert(`Function updateBooks error message ${err.message}`);
      return false;
    }
  }

  async deleteBooks(valId) {
    try {
      if (window.confirm('You want delete Book Yes/No') === false) {
        return false;
      }

      const res = await $.ajax({
        "url": 'http://localhost:8000/Books',
        "type": 'POST',
        "dataType": 'JSON',
        "data": {
          "Controller": 'DeleteBooks',
          "Id": valId
        },
        success: async (dataRes) => {
          return dataRes;
        }
      });
      if (res.Status !== 200) {
        alert(`Delete Books fail Status : ${res.Status} error message : ${res.MessageDesc}`);
        return false;
      }
      alert('Delete datas suscess');
      await this._dataTableUseReLoad.ajax.reload();
      return true;
    } catch (err) {
      alert(`Function name deleteBooks ${err.message}`);
      return false;
    }
  }
  async noUploadImage() {
    if ($("#chkEditImage:checked").val() === "Y") {
      $("#editImage").slideUp();
    } else {
      $("#editImage").slideDown();
    }
    return true;
  }
  render() {
    return (
      <>
        <Row>
          <Row>
            <Col>

              <Button className='btn btn-success'
                style={{ width: '100%' }}
                onClick={() => this.openModalAddBook()}>
                <i className='bi bi-plus'></i>
                Add Books
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <table width='100%' cellSpacing='0' className='table table-bordered dataTable'
                id='getProductsDataTable' ref={elemBookTable => this.elemBookTable = elemBookTable}>
              </table>
            </Col>
          </Row>
          <Row>
            <Col>
              <>

                <Modal show={this.state._showModelBook} onHide={() => this.closeModalAddBook()}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Books</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row>
                      <Col xs={4}>Title :</Col>
                      <Col xs={8}>
                        <input type="text" id="title" />
                      </Col>
                      <Col xs={4}>Description :</Col>
                      <Col xs={8}>
                        <input type="text" id="description" />
                      </Col>
                      <Col xs={4}>Price :</Col>
                      <Col xs={8}>
                        <input type="text" id="price" />
                      </Col>
                      <Col xs={4}>Image :</Col>
                      <Col xs={8}>
                        <input type="file" id="image" />
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModalAddBook()}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={() => this.saveBook()}>
                      Save
                    </Button>
                  </Modal.Footer>
                </Modal>

              </>
            </Col>
          </Row>
          <Row>
            <Col>
              <>

                <Modal show={this.state._showModalEditBook} onHide={() => this.closeModalEditBook()}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Books</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Row>
                      <Col xs={4}>Title :</Col>
                      <Col xs={8}>
                        <input type="text" id="editTitle" />
                      </Col>
                      <Col xs={4}>Description :</Col>
                      <Col xs={8}>
                        <input type="text" id="editDescription" />
                      </Col>
                      <Col xs={4}>Price :</Col>
                      <Col xs={8}>
                        <input type="text" id="editPrice" />
                      </Col>
                      <Col xs={4}>Image :</Col>
                      <Col xs={8}>
                        <input type="file" id="editImage" />
                        <input type="checkbox" id="chkEditImage" value="Y" onClick={() => this.noUploadImage()} /> <b style={{ color: "red" }}>*ไม่ต้องการอัพโหลดกดติก!</b>
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModalEditBook()}>
                      Close
                    </Button>
                    <Button variant="warning" onClick={() => this.updateBooks(this.state.idKeyEdit)}>
                      Save
                    </Button>
                  </Modal.Footer>
                </Modal>

              </>
            </Col>
          </Row>
        </Row>
      </>
    );
  }
}

export default App;
