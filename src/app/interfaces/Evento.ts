export interface Evento
{
    idEvento: number,
    nombreEvento: string,
    descripcion: string,
    fechaHora?: string,
    fecha: string,
    hora: string,
    direccion_Ubicacion: string,
    capMaxPermitida: number,
    idUsuarioCreacion: number,
    cantidadAsistentes?: number,
    cuposDisponibles?: number,
    esUsuarioInscrito?: boolean
}
