import Ember from 'ember';
import {
    computedCanAddSample,
    computedEditableSample
} from '../services/dispatcher';

export default Ember.Component.extend({
    browser: Ember.inject.service(),
    dispatcher: Ember.inject.service(),

    tagName: '',

    spider: null,

    canAddSample: computedCanAddSample('spider'),
    editableSample: computedEditableSample('spider'),
    startUrlDomains: Ember.computed('spider.startUrls', function() {
        let startUrlDomains = new Set();
        for (let uri of this.get('spider.startUrls')) {
            let domains = this.getUrlDomain(uri);
            for (let d of domains) {
                startUrlDomains.add(d);
            }
        }
        return startUrlDomains;
    }),
    sameDomain: Ember.computed('browser.url', 'spider.startUrls', function() {
        const urlDomain = this.getUrlDomain(this.get('browser.url'));
        if (!urlDomain) {
            return true;
        }
        console.log(urlDomain);
        console.log(this.get('startUrlDomains'))
        for (let d of urlDomain) {
            if (this.get('startUrlDomains').has(d)) {
                console.log(d)
                return true;
            }
        }
        return false;
    }),

    getUrlDomain(uri) {
        let a =  document.createElement('a');
        a.href = uri;
        let hostname = [a.hostname],
            splitHostname = hostname[0].split('.');
        if (splitHostname[0].length === 1 || splitHostname[0] === 'www') {
            hostname.push(hostname[0].split('.').splice(1).join('.'));
        }
        return hostname;
    },

    actions: {
        addSample() {
            this.get('dispatcher').addSample(this.get('spider'), /* redirect = */true);
        }
    }
});
