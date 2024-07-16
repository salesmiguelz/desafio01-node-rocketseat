export function buildServerResponse(res, statusCode, resourceName, missingParams, searchedId){
    res.writeHead(statusCode, {'Content-Type': 'application/json'})

    switch(statusCode){
        case 200:
            res.end(JSON.stringify({
                message: 'The ' + resourceName + ' was created successfully.'
            }))
            break;
        case 400:
            res.end(JSON.stringify({
                error: 'Bad Request',
                message: 'The following parameters must be sent: ' + missingParams.join(", ")
            }))
            break;
        case 404: 
            res.end(JSON.stringify({
                error: 'Not found',
                message: 'The ' + resourceName + ' with the following id ' + searchedId + ' was not found.'
            }))
            break;
    }
   
    return res;
}