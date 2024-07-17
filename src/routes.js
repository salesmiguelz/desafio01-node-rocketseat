import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'node:crypto';
import { buildServerResponse } from './utils/build-server-response.js';

const database = new Database;

export const routes = [
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

                database.insert('/tasks', task)
                
                return buildServerResponse(res, '201', 'task', null, null);
            } else {    
                return buildServerResponse(res, '400', 'task', missingParams, null);
            }
        }
    }
]