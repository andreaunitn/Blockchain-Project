
export class Ranking{
    address: String;
	ISEE: number;
	credits: number;
	year: number;
	score: number;
	funds: number;
    status: String;
    
    constructor(address: string, ISEE: number, credits: number, year: number, score: number, funds: number, status: string) {
      this.address = address;
      this.ISEE = ISEE;
      this.credits = credits;
      this.year = year;
      this.score = score;
      this.funds = funds;
      this.status = status;
    }
}