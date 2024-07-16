import { Database } from './database';
import { buildRoutePath } from './utils/build-route-path';
import { randomUUID } from 'node:crypto';
import { buildServerResponse } from './utils/build-server-response';

const database = new Database;

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;
            if(!title){
                missingParams.push('title');
            }
            if(!description){
                missingParams.push('description');
            }
            if(!missingParams){
                const task = {
                    "id": randomUUID(),
                    "title": title,
                    "description": description,
                    "completed_at": null,
                    "created_at": Date.now(),
                    "updated_at": Date.now()
                }
                database.insert('/tasks', task)
                
                return buildServerResponse(res, '201', 'task', null, null);
            } else {    
                return buildServerResponse(res, '400', 'task', missingParams, null);
            }
        }
    }
]