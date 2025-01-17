import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { randomUUID } from 'node:crypto';
import { buildServerResponse } from './utils/build-server-response.js';
import { readCSVFile } from './utils/read-csv-file.js';

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
                return buildServerResponse(res, '400', null, missingParams);
            }
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            if(!title && !description){
                return buildServerResponse(res, '400', null, ['title', 'description']);
            }
            
            const task = database.select('tasks', null, id);

            if(task){
                const updatedTask = database.update('tasks', id, req.body);
                return buildServerResponse(res, '200', updatedTask, null);
            } else {
                return buildServerResponse(res, '404', null, null);
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const task = database.select('tasks', null, id);
            if(task){
                database.delete('tasks', id);
                return buildServerResponse(res, '200', null, null);
            } else {
                return buildServerResponse(res, '404', null, null);
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;
            const task = database.select('tasks', null, id);
            if(task){
                const patchedTask = database.patch('tasks', id);
                return buildServerResponse(res, '200', patchedTask, null);
            } else {
                return buildServerResponse(res, '404', null, null);
            }
        }
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks/read-csv'),
        handler: (req, res) => {
           readCSVFile(req, res);
        }
    }

]