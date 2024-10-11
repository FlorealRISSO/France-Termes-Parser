import { Database } from 'sqlite3';
import { Domain } from './models/domain';
import { SubDomain } from './models/sub_domain';
import { Article } from './models/article';
import { Term } from './models/term';

function setupDatabase(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS Domain (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS SubDomain (
      id INTEGER PRIMARY KEY,
      idDomain INTEGER NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY (idDomain) REFERENCES Domain(id)
    );

    CREATE TABLE IF NOT EXISTS Article (
      id INTEGER PRIMARY KEY,
      numero TEXT NOT NULL,
      date DATE NOT NULL,
      definition TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS Term (
      id INTEGER PRIMARY KEY,
      idArticle INTEGER NOT NULL,
      word TEXT NOT NULL,
      language TEXT NOT NULL,
      statut INTEGER,
      FOREIGN KEY (idArticle) REFERENCES Article(id)
    );

    CREATE TABLE IF NOT EXISTS ArticleTerms (
      articleId INTEGER NOT NULL,
      termId INTEGER NOT NULL,
      PRIMARY KEY (articleId, termId),
      FOREIGN KEY (articleId) REFERENCES Article(id),
      FOREIGN KEY (termId) REFERENCES Term(id)
    );

    CREATE TABLE IF NOT EXISTS ArticleDomains (
      articleId INTEGER NOT NULL,
      domainId INTEGER NOT NULL,
      PRIMARY KEY (articleId, domainId),
      FOREIGN KEY (articleId) REFERENCES Article(id),
      FOREIGN KEY (domainId) REFERENCES Domain(id)
    );

    CREATE TABLE IF NOT EXISTS ArticleSubDomains (
      articleId INTEGER NOT NULL,
      subDomainId INTEGER NOT NULL,
      PRIMARY KEY (articleId, subDomainId),
      FOREIGN KEY (articleId) REFERENCES Article(id),
      FOREIGN KEY (subDomainId) REFERENCES SubDomain(id)
    );

	CREATE TABLE IF NOT EXISTS ArticleRelations (
    idArticleA INTEGER NOT NULL,
    idArticleB INTEGER NOT NULL,
    PRIMARY KEY (idArticleA, idArticleB),
    FOREIGN KEY (idArticleA) REFERENCES Article(id),
    FOREIGN KEY (idArticleB) REFERENCES Article(id)
	);
  `);
}

function insertDomain(db: Database, domain: Domain): void {
  db.run(`INSERT INTO Domain (id, name) VALUES (?, ?)`, domain.id, domain.name);
}

function insertSubDomain(db: Database, subDomain: SubDomain): void {
  db.run(`INSERT INTO SubDomain (id, idDomain, name) VALUES (?, ?, ?)`, subDomain.id, subDomain.idDomain, subDomain.name);
}

function insertArticle(db: Database, article: Article): void {
  db.run(`INSERT INTO Article (id, numero, date, definition, notes) VALUES (?, ?, ?, ?, ?)`, article.id, article.numero, article.date, article.definition, article.notes);
}

function insertTerm(db: Database, term: Term): void {
  db.run(`INSERT INTO Term (id, idArticle, word, language, statut) VALUES (?, ?, ?, ?, ?)`, term.id, term.idArticle, term.word, term.language, term.statut);
}

function insertArticleTerms(db: Database, articleId: number, termId: number): void {
  db.run(`INSERT INTO ArticleTerms (articleId, termId) VALUES (?, ?)`, articleId, termId);
}

function insertArticleDomains(db: Database, articleId: number, domainId: number): void {
  db.run(`INSERT INTO ArticleDomains (articleId, domainId) VALUES (?, ?)`, articleId, domainId);
}

function insertArticleSubDomains(db: Database, articleId: number, subDomainId: number): void {
  db.run(`INSERT INTO ArticleSubDomains (articleId, subDomainId) VALUES (?, ?)`, articleId, subDomainId);
}

function insertArticleRelations(db: Database, articleIdA: number, articleIdB: number): void {
  db.run(`INSERT INTO ArticleRelations (idArticleA, idArticleB) VALUES (?, ?)`, articleIdA, articleIdB);
}

export { setupDatabase, insertDomain, insertSubDomain, insertArticle, insertTerm, insertArticleTerms, insertArticleDomains, insertArticleSubDomains, insertArticleRelations };
