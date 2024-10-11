class Term {
    id: number; // primary key
    idArticle: number; // foreign key
    word: string;
    language: string;
    statut: number;
}

export { Term };