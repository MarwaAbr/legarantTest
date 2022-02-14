import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';

/*
 Prettify objects returned from Salesforce. This is optional, but it allows us to keep the templates independent
 from the Salesforce specific naming convention. This could also be done Salesforce-side by creating a custom REST service.
 */
let prettifyContact = (contact) => {
    return {
        id: contact.sfid,
        name: contact.Name,
       // title: contact.title,
        //picture: broker.picture__c,
        phone: contact.Phone,
        mobilePhone: contact.MobilePhone,
        email: contact.Email
    };
};

@Injectable()
export class BrokerService {

    static get parameters() {
        return [Http];
    }

    constructor(http) {
        this.http = http;
    }

    findAll() {
        return this.http.get('/Contact').map(response => response.json().map(prettifyContact));
    }

    findById(id) {
        return this.http.get('/contact/' + id).map(response => prettifyContact(response.json()));
    }

}
