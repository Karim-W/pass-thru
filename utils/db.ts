//Singleton class
import {Entry} from './types/entry';
export class DB{
  private static instance: DB;
  private data:Record<string, Entry> = {};
  private constructor(){
    //do something
  }
  public static getInstance(): DB{
    if(!DB.instance){
      DB.instance = new DB();
      DB.instance.set('r', {title: 'r', body: '2'}as Entry);
      DB.instance.cleanup();
    }
    return DB.instance;
  }
  public get(id: string): Entry{
    const val = this.data[id];
    if(val){
      // delete from record
      // delete this.data[id];
    }
    return val;
  }
  public set(id: string, entry: Entry): string{
    // set expiration ten minutes from now
    if (!this.data[id]) {
    entry.expiresAt = new Date(Date.now() + 600000).toISOString();
    entry.pin = this.generatePin();
    console.log(entry);
    this.data[id] = entry;
    return entry.pin;
   }
   return "";
  }
  private async cleanup() {
    const now = new Date();
    for (let item in this.data) {
      const entry = this.data[item];
      const expires = new Date(entry.expiresAt);
      if (expires < now) {
        delete this.data[item];
      }
    }
  }

  private generatePin(): string{
    // generate a random 12 digit pin in 3 batches
    let pin = ""
    for (let i = 0; i < 3; i++) {
      pin += Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    }
    return pin;
  }

  public GetPaths(): any[]{
      let paths = [];
      for (let item in this.data) {
          paths.push({
              id: this.data[item].title
          });
      }
        return paths;
  }

  public ListKeys(): string[]{
    return Object.keys(this.data);
  }
}
