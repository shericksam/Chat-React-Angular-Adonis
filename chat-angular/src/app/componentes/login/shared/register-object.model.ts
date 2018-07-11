export class RegisterObject {

    public username: string;
    public password: string;
    public nombre: string;
    public apellido: string;
    public email: string;
    public foto: string;

    constructor( object: any){
        this.username = (object.username) ? object.username : null;
        this.password = (object.password) ? object.password : null;
        this.nombre = (object.nombre) ? object.nombre : null;
        this.apellido = (object.apellido) ? object.apellido : null;
        this.email = (object.email) ? object.email : null;
        this.foto = (object.foto) ? object.foto : null;
    }
  }