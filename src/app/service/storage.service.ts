import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { User } from '../pojo/user';


@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage:Storage|null=null;
    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
      this._storage=  await this.storage.create();
    }


     async setData(key: string, value:any) {
        try {
            const result = await this._storage.set(key, JSON.stringify(value));
            console.log('set Object in storage: ' + result);
            return result;
        } catch (reason) {
            console.log(reason);
            return null;
        }
    }

// setData(key:string,value:any){
//     this.storage.set(key,value);
// }

    async getObject(key: string): Promise<any> {
        try {
            const result = await this._storage.get(key);
            if (result != null) {
                return JSON.parse(result);
            }
            return null;
        } catch (reason) {
            console.log(reason);
            return null;
        }
    }

    remove(key: string) {
        return this._storage.remove(key);
    }

    clear() {
        this._storage.clear();
    }
}




