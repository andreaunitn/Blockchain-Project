
export class Call{
    name: String;
    description: String;
    ISEE: number;
    budget: number;
    credits: number;    
    averageRating: number;
    endDate: Date;
    
    constructor(name: string, description: string, ISEE: number, budget: number, credits: number, averageRating: number, endDate: Date) {
      this.name = name;
      this.description = description;
      this.ISEE = ISEE;
      this.budget = budget;
      this.credits = credits
      this.averageRating = averageRating;
      this.endDate = endDate;
    }
}