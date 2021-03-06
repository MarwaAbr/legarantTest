import {OnInit} from '@angular/core';
import {Page, NavController, NavParams} from 'ionic-angular';
import {BrokerService} from '../../services/broker-service';

@Page({
    templateUrl: 'build/pages/broker-details/broker-details.html'
})
export class BrokerDetailsPage {

    static get parameters() {
        return [[NavController], [NavParams], [BrokerService]];
    }

    constructor(nav, navParams, brokerService) {
        this.brokerService = brokerService;
        this.contact = navParams.get('contact');
    }

    ngOnInit() {
        this.brokerService.findById(this.contact.id).subscribe(contact => this.contact = contact);
    }

}
