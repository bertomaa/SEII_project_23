//400
function BadRequestException() {}
//401
function UnauthorizedException() {}
//404
function NotFoundException() {}
//409
function ConflictException() {}
//500
function InternalServerErrorException() {}

//funzione che fa da wrapper a tutti gli handler
const exceptionWrapper = (foo, req, res) => {
    try{
        foo(req,res);
    }catch(e){
        if(e instanceof BadRequestException)
            res.status(400).send();
        else if(e instanceof UnauthorizedException)
            res.status(401).send();
        else if(e instanceof NotFoundException)
            res.status(404).send();
        else if(e instanceof ConflictException)
            res.status(409).send();
        else if(e instanceof InternalServerErrorException)
            res.status(500).send();
    }
}