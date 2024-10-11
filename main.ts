import { TermParser } from "./parser";
import { readFileSync } from 'fs';
import { setupDatabase, insertDomain, insertArticleTerms, insertArticle, insertSubDomain, insertArticleSubDomains, insertTerm, insertArticleDomains, insertArticleRelations } from './sql';
import { Database } from 'sqlite3';
import { constants } from "buffer";

const XML_PATH = 'data.xml';
const DB_PATH = './france-termes.db';

function main(): void {
  // open xml file
  const xmlString = readFileSync(XML_PATH, 'utf-8');
  const termParser = new TermParser(xmlString);

  // parse xml
  termParser.parse_all();

  // setup database
  const db = new Database(DB_PATH);

  setupDatabase(db);

  console.log('insertDomain');
  termParser.domainMap.forEach((domain) => {
    insertDomain(db, domain);
  });

  console.log('insertSubDomain');
  termParser.subDomainMap.forEach((subDomain) => {
    insertSubDomain(db, subDomain);
  });

  console.log('insertArticle');
  termParser.articleList.forEach((article) => {
    insertArticle(db, article);
  });

  console.log('insertArticleSubDomains');
  termParser.articleList.forEach((article) => {
    article.subDomainIds.forEach((subDomain) => {
      insertArticleSubDomains(db, article.id, subDomain);
    });
  });

  console.log('insertArticleDomains');
  termParser.articleList.forEach((article) => {
    article.domainIds.forEach((domain) => {
      insertArticleDomains(db, article.id, domain);
    });
  });

  console.log('insertTerms');
  termParser.termListAll.forEach((term) => {
    insertTerm(db, term);
  });

  console.log('insertArticleTerms');
  termParser.articleList.forEach((article) => {
    article.termIds.forEach((term) => {
      insertArticleTerms(db, article.id, term);
    });
  });

  console.log('insertArticleRelations');
  termParser.articleList.forEach((article) => {
    article.toSee.forEach((relation) => {
      insertArticleRelations(db, article.id, relation);
    });
  });


  db.close();
}

main();
