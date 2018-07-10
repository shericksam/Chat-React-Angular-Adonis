interface Usuario {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    foto:string;
    conectado: boolean;
    email: string;
    password?: string;
    created_at: string,
    updated_at:string;
    sid:string;
}
