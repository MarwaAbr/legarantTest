import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';

/*
 Prettify objects returned from Salesforce. This is optional, but it allows us to keep the templates independent
 from the Salesforce specific naming convention. This could also be done Salesforce-side by creating a custom REST service.
 */
let prettifyBroker = (contact) => {
    return {
        id: contact.sfid,
        name: contact.name,
        title: contact.title,
        //picture: broker.picture__c,
        phone: contact.phone,
        mobilePhone: contact.mobile_phone,
        email: contact.email
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
        return this.http.get('/contact').map(response => response.json().map(prettifyBroker));
    }

    findById(id) {
        return this.http.get('/contact/' + id).map(response => prettifyBroker(response.json()));
    }

}
