import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly STORAGE_KEY = 'search_criteria';
    private searchCriteria: any = {};

    constructor() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.searchCriteria = JSON.parse(saved);
            } catch (e) {
                this.searchCriteria = {};
            }
        }
    }

    setCriteria(criteria: any) {
        this.searchCriteria = criteria;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(criteria));
    }

    getCriteria() {
        return this.searchCriteria;
    }

    clear() {
        this.searchCriteria = {};
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
