export interface DataObject {
    [key: string]: any
}

export interface FormField {
    name: string
    type: string
    displayName: string
    defaultValue: string
}

export interface GraphField {
    name: string
    type: string
    displayName: string
    axis: string
    dataColor?: string
}

export interface SplitDataFileDefinition {
    fieldName: string
    splitType: string
}

export interface FormSpec {
    source: string
    title?: string
    fields?: FormField[]
    splitDataFileBy?: SplitDataFileDefinition
    buttonText?: string
}

export interface GraphSpec {
    source: string
    type: string
    title?: string
    fields?: GraphField[]
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
    ReadData(filename:string) : Promise<DataObject[]>;
    AppendData(filename:string, data:DataObject) : Promise<void>;
    WriteData(filename:string,  dataRows:DataObject[]) : Promise<void>;
}

