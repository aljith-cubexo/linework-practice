import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";



@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost){};

    catch(exception: unknown, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus = exception instanceof HttpException ? 
            exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        
        const message = exception instanceof Error ?
            exception.message : 'An error occurred';


        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}






// @Catch(HttpException)
// export class  HttpExceptionFilter implements ExceptionFilter {
//     catch(exception: HttpException, host: ArgumentsHost){
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();
//         const request = ctx.getRequest<Request>();
//         const status = exception.getStatus();

//         response.status(status).json({
//             statusCode: status,
//             timestamp: new Date().toISOString(),
//             path: request.url
//         })
//     }
// }