import {OnInit} from '@angular/core';
import {Page, NavController} from 'ionic-angular';
import {BrokerDetailsPage} from '../broker-details/broker-details';
import {BrokerService} from '../../services/broker-service';

@Page({
    templateUrl: 'build/pages/broker-list/broker-list.html'
})
export class BrokerListPage {

    static get parameters() {
        return [[NavController], [BrokerService]];
    }

    constructor(nav, brokerService) {
        this.nav = nav;
        this.brokerService = brokerService;
    }

    ngOnInit() {
        this.brokerService.findAll().subscribe(contacts => this.contacts = contacts);
    }

    itemTapped(event, contact) {
        this.nav.push(BrokerDetailsPage, {
            contact: contact
        });
    }

}
