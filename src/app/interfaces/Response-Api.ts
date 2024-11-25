//Interfaz q nos permite recibir la respuesta estándar de todas nuestras solicitudes HTTP
export interface ResponseApi
{
    status: boolean,
    value: any,
    mensaje: string
}
