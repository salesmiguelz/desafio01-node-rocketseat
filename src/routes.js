import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'node:crypto';
import { buildServerResponse } from './utils/build-server-response.js';

const database = new Database;

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null);
            if(tasks){
                return buildServerResponse(res, '200', tasks, null);
            } else{
                return buildServerResponse(res, '404', tasks, null);
            }
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const missingParams = [];
            const { title, description } = req.body;
            if(!title){
                missingParams.push('title');
            }
            if(!description){
                missingParams.push('description');
            }
            if(!missingParams.length){
                const task = {
                    "id": randomUUID(),
                    "title": title,
                    "description": description,
                    "completed_at": null,
                    "created_at": new Date(),
                    "updated_at": new Date()
                }

                database.insert('tasks', task)
                
                return buildServerResponse(res, '201', task, null);
            } else {    
                return buildServerResponse(res, '400', missingParams);
            }
        }
    }
]