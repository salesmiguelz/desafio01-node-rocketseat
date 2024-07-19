import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url);

export class Database{
    #database = {}

    constructor(){
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data);
        })
        .catch(() => {
            this.#persist();
        })
    }

    #persist(){
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search, id){
        let data = this.#database[table] ?? [];
        if(id){
           const rowIndex = this.#database[table].findIndex(row => row.id === id);
           if(rowIndex >= -1){
                data = this.#database[table][rowIndex] 
            } else {
                data = [];
            }
        } else if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase().split('%20').join(' '));
                })
            })
        }
        return data;
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data];
        }

        this.#persist();
        return data;
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex >= -1){
            const resource = this.#database[table][rowIndex];
            const updatedResource = {
                ...resource,
                title: data.title ? data.title : resource.title, 
                description: data.description ? data.description : resource.description,
                updated_at: new Date()
            }
            this.#database[table][rowIndex] = updatedResource;
            this.#persist();
            return updatedResource;
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex >= -1){
            this.#database[table].splice(rowIndex, 1);
            this.#persist();
        }
    }

    patch(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id);
        if(rowIndex >= -1){
            const resource = this.#database[table][rowIndex];
            let updatedResource = null;
            if(!resource.completed_at){
                updatedResource = {...resource, completed_at: new Date()} 
            } else {
                updatedResource = {...resource, completed_at: null} 
            }
            this.#database[table][rowIndex] = updatedResource;
            this.#persist();

            return updatedResource;
        }
    }

}