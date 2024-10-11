# France-Termes-Parser

A Node.js script written in TypeScript that parses the scientific and technical terms file provided by [FranceTerme](https://www.franceterme.culture.gouv.fr/).

## Description

This parser processes the XML file from FranceTerme's "Base FranceTerme : Termes scientifiques et techniques" dataset. It builds a SQLite database to be used by the [France Termes app](https://github.com/FlorealRISSO/France-Termes-v2).

The FranceTerme dataset contains:
- A list of terms recommended in the Official Journal of the French Republic by the Commission for the Enrichment of the French Language, under the authority of the Prime Minister.
- Terms from various scientific and technical fields.
- Reference material for translators and technical writers.

While these terms are only mandatory for use in French government administrations and institutions, they serve as valuable references for anyone interested in precise French terminology.

## Features

- Parses the XML file from FranceTerme
- Builds a SQLite database for use in the France Termes app
- Written in TypeScript for better maintainability

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

or

```bash
make run
```

## File Structure

- `data.xml`: Input XML file from FranceTerme
- `main.ts`: Main TypeScript file
- `parser.ts`: XML parsing logic
- `sql.ts`: Database operations
- `models`: TypeScript models/interfaces
- `france-termes.db`: Output SQLite database

## Dependencies

See `package.json` for a full list of dependencies.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Related Projects

- [France Termes App](https://github.com/FlorealRISSO/France-Termes-v2)
- [France Terme DB](https://github.com/FlorealRISSO/France-Terme-SQL-DB)

## Data Source

The XML file is provided by FranceTerme and is updated after each new publication of recommended terms in the Official Journal. You can download the latest XML file from the [FranceTerme website](https://www.franceterme.culture.gouv.fr/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Questions or Issues?

If you have any questions or encounter any issues, please open an issue in this repository.
