import { Injectable } from '@angular/core';
@Injectable()
export class APIException {

    public Exception_Message(reject: any): String {

        let ServiceResponce: String = "";
        let aErrorDetails = reject.error;
        if (reject.error.ResponseMessage == '' && typeof (reject.error.ResponseMessage) != 'undefined') {
            if (reject.status == 404) {
                return ServiceResponce = "Invalid server request";;
            }
            else if (reject.status == 405) {

                if (typeof (aErrorDetails.ExceptionMessage) != 'undefined') {
                    ServiceResponce = this.Validate_Message(aErrorDetails.ExceptionMessage);
                }
                else if (typeof (aErrorDetails.Message) != 'undefined') {
                    ServiceResponce = this.Validate_Message(aErrorDetails.Message);
                }
                return ServiceResponce;
            }
            else if (reject.status == 500) {

                if (typeof (aErrorDetails.ExceptionMessage) != 'undefined') {
                    ServiceResponce = this.Validate_Message(aErrorDetails.ExceptionMessage);
                }
                else if (typeof (aErrorDetails.Message) != 'undefined') {
                    ServiceResponce = this.Validate_Message(aErrorDetails.Message);
                }
                return ServiceResponce;
            }
            else {
                let errordata = reject.error;
                if (typeof (errordata) != 'undefined') {
                    let aInnerException = errordata.InnerException;
                    if (typeof (aInnerException) != 'undefined') {
                        let eInnerException = aInnerException.InnerException;
                        if (typeof (eInnerException) != 'undefined') {
                            ServiceResponce = this.Validate_Message(eInnerException.ExceptionMessage);
                        } else {
                            ServiceResponce = this.Validate_Message(errordata.ExceptionMessage);
                        }
                    }
                    else {
                        ServiceResponce = this.Validate_Message(errordata.ExceptionMessage);
                    }
                }
                else {
                    ServiceResponce = this.Validate_Message(reject.message);
                }


            }

        }
        else if (aErrorDetails.Message != '' && typeof (aErrorDetails.Message) != 'undefined') {
            if (reject.status == 500) {

                if (typeof (aErrorDetails.ExceptionMessage) != 'undefined') {
                    ServiceResponce = this.Validate_Message(aErrorDetails.ExceptionMessage);
                }
                else if (typeof (aErrorDetails.Message) != 'undefined') {
                    ServiceResponce = this.Validate_Message(aErrorDetails.Message);
                }
                return ServiceResponce;

            }
            ServiceResponce = aErrorDetails.Message;
        }
        else if (reject.status == 0) {
            ServiceResponce = this.Validate_Message(reject.Message);

        }
        else {
            ServiceResponce = reject.error.ResponseMessage;

        }
        return ServiceResponce;

    }


    Validate_Message(pErrorMessage): String {
        let aServiceResponce: string = "";
        if (typeof (pErrorMessage) == 'undefined') {
            pErrorMessage = "Server not responding.";
        }
        if ((pErrorMessage.toLowerCase().indexOf("Microsoft.ServiceBus.Messaging.MessagingEntityNotFoundException".toLowerCase()) == -1 ? false : true) ||
            (pErrorMessage.toLowerCase().indexOf("40400: Endpoint not found".toLowerCase()) == -1 ? false : true)
        ) {
            aServiceResponce = "Servicebus queue not created";
        }
        else if (pErrorMessage.toLowerCase().indexOf("The remote name could not be resolved: ".toLowerCase()) == -1 ? false : true) {
            aServiceResponce = "Please check your internet connection";
        }
        else if (pErrorMessage.toLowerCase().indexOf("Failed to execute 'open' on 'XMLHttpRequest': Invalid URL".toLowerCase()) == -1 ? false : true) {
            aServiceResponce = "Invalid api server URL";
        }
        else if ((pErrorMessage.toLowerCase().indexOf("Could not find file ".toLowerCase()) == -1 ? false : true) &&
            (pErrorMessage.toLowerCase().indexOf('SQLiteScriptFiles'.toLowerCase()) == -1 ? false : true)) {
            aServiceResponce = "Procedure not found";
        }
        else if (pErrorMessage.toLowerCase().indexOf("The requested resource does not support http method 'GET'".toLowerCase()) == -1 ? false : true) {
            aServiceResponce = "Invalid request url";
        }
        else if (pErrorMessage.toLowerCase().indexOf("The requested resource does not support http method 'POST'".toLowerCase()) == -1 ? false : true) {
            aServiceResponce = "Invalid request url";
        }
        else if ((pErrorMessage.toLowerCase().indexOf("Could not find a part of the path ".toLowerCase()) == -1 ? false : true) &&
            (pErrorMessage.toLowerCase().indexOf('Outlet.txt'.toLowerCase()) == -1 ? false : true)) {
            aServiceResponce = "Temporarily the connection to the server had lost. Please logout your session and try again.";
        }
        else if ((pErrorMessage.toLowerCase().indexOf("Could not find a part of the path ".toLowerCase()) == -1 ? false : true) &&
            (pErrorMessage.toLowerCase().indexOf('MasterData'.toLowerCase()) == -1 ? false : true)) {
            aServiceResponce = "Temporarily the connection to the server had lost. Please refresh again.";
        }
        else if ((pErrorMessage.toLowerCase().indexOf("Could not find file ".toLowerCase()) == -1 ? false : true) &&
            (pErrorMessage.toLowerCase().indexOf('Outlet.txt'.toLowerCase()) == -1 ? false : true)) {
            aServiceResponce = "Temporarily the connection to the server had lost. Please logout your session and try again.";
        }
        else if (pErrorMessage == "Http failure response for (unknown url): 0 Unknown Error") {
            aServiceResponce = "Server not responding";
        }
        else {
            aServiceResponce = pErrorMessage;
        }

        return aServiceResponce;
    }

}