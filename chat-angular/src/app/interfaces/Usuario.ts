interface Usuario {
    id: number;
    foto:string;
    nombre: string;
    apellido: string;
    email: string;
    username: string;
    password?: string;
    conectado: boolean;
}