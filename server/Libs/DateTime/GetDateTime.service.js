class GetDateTimeService {
  async AsyncDateTimeNow() {
    try {
      const dateNow = new Date();
      const createD = `${dateNow.getFullYear()}-${("0" + dateNow.getMonth()).substr(-2)}-${("0" + dateNow.getDate()).substr(-2)}`;
      const createT = `${("0" + dateNow.getHours()).substr(-2)}:${("0" + dateNow.getMinutes()).substr(-2)}:${("0" + dateNow.getSeconds()).substr(-2)}`;
      const createDateTime = `${createD} ${createT}`;
      return createDateTime;
    } catch (err) {
      return err;
    }

  }
}
module.exports = GetDateTimeService;