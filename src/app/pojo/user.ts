export class User {

    public id:number;
    public name:string;
    public password:string;
    public authdata:string;
    public positionType:string;
    public status:string;
    public email:string;

constructor(){


}

get getName(){
   return this.name; 
}


 get getPassword(){
    return this.password; 
 }

set setName(name:string){
    this.name= name;
}


set setPassword(password:string){
    this.password= password;
}
}
