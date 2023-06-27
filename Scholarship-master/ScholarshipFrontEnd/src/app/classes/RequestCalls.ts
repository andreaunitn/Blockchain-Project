export class RequestCall{
    name: String;
    address: String;
    dateTime: Date;
    eligible: Boolean;
    released: Boolean;
    fund: Number;
    
    constructor(name: string, address: string, dateTime: Date, eligible: Boolean, released: Boolean, fund: Number) {
      this.name = name;
      this.address = address;
      this.dateTime = dateTime;
      this.eligible = eligible;
      this.released = released;
      this.fund = fund;
    }
}