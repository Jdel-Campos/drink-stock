export interface Drinks{
    entry_data: string;
    name: string;
    category: string;
    quantity: number;
    validity: Date;
    record_type: "Entrada" | "Saída";
    used_event?: string
};