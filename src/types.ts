export interface DataObject {
    [key: string]: any
}

export interface FormField {
    name: string
    type: string
    displayName: string
    defaultValue: string
    required?: boolean
}

export interface GraphField {
    name: string
    type: string
    displayName: string
    axis: string
    dataColor?: string
}

export interface TableField {
    name: string
    type: string
    displayName: string
    headerStyle?: string
    fieldStyle?: string
    fieldFormat?: string
}

export interface SplitDataFileDefinition {
    fieldName: string
    splitType: string
}

export interface FieldSort {
    sortFieldName:string
    sortDirection:string
}

export interface FormSpec {
    source: string
    title?: string
    fields?: FormField[]
    splitDataFileBy?: SplitDataFileDefinition
    buttonText?: string
    requiredFieldMessage?:string
    recordSavedMessage?:string
    sortOnSave?:FieldSort
}

export interface GraphSpec {
    source: string
    type: string
    title?: string
    fields?: GraphField[]
}

export interface TableSpec {
    source: string
    title?: string
    fields?: TableField[]
}

export interface ScatterField {
    x: number
    y: number
}

export interface AxisRange {
    min: number
    max: number
}

export interface Repo {
    //These two functions just read and write
    ReadData(filename:string) : Promise<DataObject[]>;
    WriteData(filename:string,  dataRows:DataObject[]) : Promise<void>;

    //This method can also sort
    AppendData(filename:string, newData:DataObject, sortOnSave:FieldSort) : Promise<void>;
}

