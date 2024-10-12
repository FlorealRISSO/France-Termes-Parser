import { XmlDocument, XmlElement } from 'xmldoc';
import { readFileSync } from 'fs';
import { Article } from './models/article';
import { Domain } from './models/domain';
import { SubDomain } from './models/sub_domain';
import { Term } from './models/term';
import { Statut } from './models/statut';

class XmlConstants {
    static equivalentField = 'Equivalent';
    static equivalentProp = 'Equi_prop';
    static varianteDefaultType = 'Abréviation';
    static language = 'langue';
    static admis = 'admis';
    static domainList = 'Domaine';
    static domainField = 'Dom';
    static termField = 'Terme';
    static termVariantes = 'variantes';
    static termVariante = 'variante';
    static termVarianteType = 'type';
    static statut = 'statut';
    static articleId = 'id';
    static definition = 'Definition';
    static articleNum = 'numero';
    static articleDate = 'DatePub';
    static articleField = 'Article';
    static termPartOfSpeech = 'categorie';
    static toSee = "Voir";
    static toSeeIndividual = "A";
    static toSeeAttribute = "href";
    static antonyme = "Antonyme";
    static notes = "Notes";
    static warning = "Attention";
    static toQuestion = "A-interroger";
    static defaultLang = "fr";
    static subDomainField = "S-dom";
    static url = "url";
    static criter = "CRITER";
}


type Tuple<A, B> = [A, B];

class TermParser {

    termListAll: Term[];
    domainMap: Map<string, Domain>;
    subDomainMap: Map<Tuple<number, string>, SubDomain>;
    articleList: Article[];
    doc: XmlDocument;

    constructor(xml: string) {
        this.termListAll = [];
        this.domainMap = new Map<string, Domain>();
        this.subDomainMap = new Map<Tuple<number, string>, SubDomain>();
        this.articleList = [];

        this.doc = new XmlDocument(xml);
    }

    generateDomains(name: string): number {
        const id = this.domainMap.size;
        if (!this.domainMap.has(name)) {
            this.domainMap.set(name, { id: id, name });
        }
        return this.domainMap.get(name)?.id || id;
    }

    generateTerm(idArticle: number, word: string, language: string, statut: number): number {
        const id = this.termListAll.length;
        this.termListAll.push({ id: id, idArticle: idArticle, word, language, statut });
        return id;
    }

    generateSubDomains(idDomain: number, name: string): number {
        const id = this.subDomainMap.size;
        if (!this.subDomainMap.has([idDomain, name])) {
            this.subDomainMap.set([idDomain, name], { id: id, idDomain, name });
        }
        return this.subDomainMap.get([idDomain, name])?.id || id;
    }

    //  to parse the URL and extract the FIC_ID parameter
    static getFICId(url: string): string | null {
        // Create a URL object
        const parsedUrl = new URL(url, 'http://dummybase.com'); // Provide a dummy base URL for relative URLs
        const params = new URLSearchParams(parsedUrl.search);

        // Get the value of FIC_ID parameter
        const ficId = params.get('FIC_ID');

        return ficId; // Returns the FIC_ID or null if it doesn't exist
    }

    parse_domains(domains: XmlElement): Tuple<number[], number[]> {
        const domainIds: number[] = [];
        const subDomainIds: number[] = [];

        let currentDomainId = -1;
        for (const domain of domains.children) {
            if (domain.name === XmlConstants.domainField) {
                const id = this.generateDomains(domain.val)
                domainIds.push(id);
                currentDomainId = id;
            } else if (domain.name === XmlConstants.subDomainField) {
                const id = this.generateSubDomains(currentDomainId, domain.val);
                subDomainIds.push(id);
            }
        }

        return [domainIds, subDomainIds];
    }

    parse_terms(terms: XmlElement[], idArticle: number): number[] {
        const termList: number[] = [];
        for (const term of terms) {
            const statut = term.attr[XmlConstants.statut];
            const tempStatut = Statut.STATUTS.findIndex((s) => s === statut);
            const idStatut = tempStatut > -1 ? tempStatut : Statut.UNKNOWN;
            const word = term.val.replaceAll('\n', '');
            const language = term.attr[XmlConstants.language] || XmlConstants.defaultLang;

            termList.push(this.generateTerm(idArticle, word, language, idStatut));
        }

        return termList;
    }

    parse_equivalents(equivalents: XmlElement[], idArticle: number): number[] {
        const terms: number[] = [];
        for (const equivalent of equivalents) {
            const language = equivalent.attr[XmlConstants.language] || XmlConstants.defaultLang;
            const statut = Statut.EQUIVALENT;

            for (const equivalentProp of equivalent.childrenNamed(XmlConstants.equivalentProp)) {
                const word = equivalentProp.val.replaceAll('\n', '');
                terms.push(this.generateTerm(idArticle, word, language, statut));
            }

        }
        return terms;
    }

    parse_definition(definition: XmlElement): string {
        return definition.val.replaceAll('\n', '');
    }

    parse_note(note: XmlElement): string {
        const notes: any[] = [];
        note.children.map((note) => {
            if (note.name == 'div') {
                notes.push(note.val);
            } else {
                notes.push(note.text);
            }
        });
        let result:any = notes.join('');
        result = result.replaceAll('\n', '');
        return result;
    }

    parse_tosee(toSee: XmlElement): number[] {
        const toSeeList: number[] = [];

        if (!toSee) {
            return toSeeList;
        }

        for (const toSeeIndividual of toSee.childrenNamed(XmlConstants.toSeeIndividual)) {
            const url = toSeeIndividual.attr[XmlConstants.toSeeAttribute];
            const ficId = TermParser.getFICId(url);

            if (ficId) {
                const nFicId = Number.parseInt(ficId);
                toSeeList.push(nFicId);
            }
        }

        return toSeeList;
    }


    parse_article(article: XmlElement): Article {
        const idArticle = article.attr[XmlConstants.articleId];
        const numero = article.attr[XmlConstants.articleNum];

        // parse domains
        const domains = article.childNamed(XmlConstants.domainList);
        const [domainList, subDomainList] = this.parse_domains(domains);

        // parse terms
        const terms: XmlElement[] = article.childrenNamed(XmlConstants.termField);
        const termListTmp = this.parse_terms(terms, idArticle);

        // parse equivalent
        const equivalents: XmlElement[] = article.childrenNamed(XmlConstants.equivalentField);
        const equivalentList = this.parse_equivalents(equivalents, idArticle);

        const termList = termListTmp.concat(equivalentList);

        // parse definition
        const definition = article.childNamed(XmlConstants.definition);
        const definitionString = this.parse_definition(definition);

        // parse note
        const note = article.childNamed(XmlConstants.notes);
        const noteString = this.parse_note(note);

        // parse toSee
        const toSee = article.childNamed(XmlConstants.toSee);
        const toSeeList = this.parse_tosee(toSee);

        // parse date
        const date = article.childNamed(XmlConstants.articleDate).val;
        const [day, month, year] = date.split('/');
        const dateSql = `${year}-${month}-${day}`;

        return new Article(idArticle, numero, dateSql, termList, domainList, subDomainList, definitionString, noteString, toSeeList);
    }

    parse_all(): void {
        const articles = this.doc.childrenNamed(XmlConstants.articleField);
        for (const article of articles) {
            const articleParsed = this.parse_article(article)
            if (!articleParsed.termIds.map((id) => this.termListAll[id]).some((term) => term.word.startsWith('Recommandation'))) {
                this.articleList.push(articleParsed);
            }
        }
    }
}

export { TermParser }; 
