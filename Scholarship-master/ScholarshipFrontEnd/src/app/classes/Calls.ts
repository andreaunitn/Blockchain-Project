
export class Call{
    name: String;
    description: String;
    ISEE: number;
    residenceRegion: String;
    credits: number;    
    averageRating: number;
    birthYear: number;
    endDate: Date;
    
    constructor(name: string, description: string, ISEE: number, residenceRegion: string, credits: number, averageRating: number, birthYear: number, endDate: Date) {
      this.name = name;
      this.description = description;
      this.ISEE = ISEE;
      this.residenceRegion = residenceRegion;
      this.credits = credits
      this.averageRating = averageRating;
      this.birthYear = birthYear;
      this.endDate = endDate;
    }
}