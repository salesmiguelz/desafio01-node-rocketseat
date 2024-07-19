export function buildServerResponse(res, statusCode, data,  missingParams){
    res.writeHead(statusCode, {'Content-Type': 'application/json'})

    switch(statusCode){
        case '200':
            res.end(JSON.stringify({
                content: data ?? 'The task was deleted successfully.'
            }))
            break;
        case '201':
            res.end(JSON.stringify({
                message: 'The task was created successfully.',
                content: data
            }))
            break;
        case '400':
            res.end(JSON.stringify({
                error: 'Bad Request',
                message: 'The following parameters must be sent: ' + missingParams.join(", ")
            }))
            break;
        case '404': 
            res.end(JSON.stringify({
                error: 'Not found',
                message: 'No tasks were found.'
            }))
            break;
    }
   
    return res;
}