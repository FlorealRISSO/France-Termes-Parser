class Metadata {
    toSeeId: number[];
    notes: string;
    source: string;
    warning: string;
    toQuestion: string;

    constructor(notes: string, source: string, warning: string, toQuestion: string, toSeeId: number[]) {
        this.notes = notes;
        this.source = source;
        this.warning = warning;
        this.toQuestion = toQuestion;
        this.toSeeId = toSeeId;
    }

    toString(): string {
        return `Notes: ${this.notes}\nSource: ${this.source}\nWarning: ${this.warning}\nTo Question: ${this.toQuestion}`;
    }
}
export { Metadata };