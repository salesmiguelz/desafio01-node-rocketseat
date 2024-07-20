import { parse } from 'csv-parse';
import fs from 'fs';

export async function readCSVFile(req, res){
    const csvPath = new URL('./tasks.csv', import.meta.url);
    const csvStream = fs.createReadStream(csvPath);

    const csvParsed = parse({
        delimiter: ';',
        skipEmptyLines: true,
        fromLine: 2 
    });
      
    if(csvParsed){
        process.stdout.write('Starting to read CSV...\n');
        const linesParsed = csvStream.pipe(csvParsed);

        for await (const line of linesParsed) {
            const [ title, description] = line;
            await fetch('http://localhost:3333/tasks', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title,
                  description,
                })
              })

            process.stdout.write("The '" + title +  "' task was read and inserted into the database. \n");
        }
      
      
        process.stdout.write('Done!\n');

        res.writeHead('201', {'Content-Type': 'application/json'})
        return res.end(JSON.stringify({
            message: 'The CSV has been read and the tasks were inserted in the database'
        }))
    } else {
        res.writeHead('500', {'Content-Type': 'application/json'})
        return res.end(JSON.stringify({
            message: 'There was a problem reading the CSV file.'
        }))
    }
};