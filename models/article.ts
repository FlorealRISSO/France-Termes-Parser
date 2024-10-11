class Article {
  static baseUrl: string = "http://www.culture.fr/franceterme/terme/";

  id: number; // primary key
  numero: string;
  date: string;
  termIds: number[]; // foreign key

  domainIds: number[]; // foreign key
  subDomainIds: number[]; // foreign key

  definition: string;
  notes: string;
  toSee: number[]; // foreign key

  constructor(id: number, numero: string, date: string, termIds: number[], domainIds: number[], subDomainIds: number[], definition: string, notes: string, toSee: number[]) {
    this.id = id;
    this.numero = numero;
    this.date = date;
    this.termIds = termIds;
    this.domainIds = domainIds;
    this.subDomainIds = subDomainIds;
    this.definition = definition;
    this.notes = notes;
    this.toSee = toSee;
  }
}

export { Article };
