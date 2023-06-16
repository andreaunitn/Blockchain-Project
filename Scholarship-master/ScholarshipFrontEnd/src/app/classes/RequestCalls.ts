export class RequestCall{
    name: String;
    address: String;
    message: String;
    dateTime: Date;
    result: Boolean;
    
    constructor(name: string, address: string, message: string, dateTime: Date, result: Boolean) {
      this.name = name;
      this.address = address;
      this.message = message;
      this.dateTime = dateTime;
      this.result = result;
    }
}