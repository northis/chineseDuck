'use strict';
/**
 * Authorize function for securityDefinitions:OAuth2
 * type : oauth2
 * description: 
 */
export default function authorize(req, res, next) {
    //The context('this') for authorize will be bound to the 'securityDefinition'
    //this.authorizationUrl - The authorization URL for securityDefinitions:OAuth2
    //this.scopes - The available scopes for the securityDefinitions:OAuth2 security scheme
    //this.flow - The flow used by the securityDefinitions:OAuth2 OAuth2 security scheme
    //req.requiredScopes - list of scope names required for the execution (defined as part of security requirement object).
    //Perform auth here
    next();
}
