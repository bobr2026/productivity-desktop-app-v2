 export interface INote{
    id: number,
    title: string,
    content: string|null,
    category_id: number|null,
    created_at: string,
    updated_at: string,
} 
 export interface Note_props{
    id:number, 
    title:string
    category_id: number|null,
    created_at: string,
    updated_at: string,
}
export interface Icategory{
    id:string
    name:string
}