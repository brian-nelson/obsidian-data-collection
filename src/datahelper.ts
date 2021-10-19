import {AxisRange, DataObject, FormField, GraphField, ScatterField} from "./types";

export class DataHelper {
    static findFormField(fields: FormField[], fieldName:string) : FormField{
        for (let i = 0; i < fields.length; i++) {
            let field:FormField = fields[i];
            if (fieldName === field.name) {
                return field;
            }
        }

        return null;
    }

    static getLabelField(fields: GraphField[]) : GraphField {
        for (let i = 0; i < fields.length; i++) {
            const field:GraphField = fields[i];

            if (field.axis == 'x') {
                return field;
            }
        }

        return null;
    }

    static getDataField(fields:GraphField[]) : GraphField {
        for (let i = 0; i < fields.length; i++) {
            const field:GraphField = fields[i];

            if (field.axis == 'y') {
                return field;
            }
        }

        return null;
    }

    static getLabelsArray(data:DataObject[], field:GraphField) : any[] {
        let array:any[] = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            array.push(row[field.name]);
        }

        return array;
    }

    static getLabelsArrayAsDates(data:DataObject[], field:GraphField) : any[] {
        let output:any[] = [];

        for (let i = 0; i < data.length; i++) {

            try {
                const row = data[i];

                let temp = row[field.name];
                let dateValue = Date.parse(temp);
                output.push(dateValue.valueOf());
            } catch (e) {
                console.log(e.message);
            }
        }

        return output;
    }

    static getDataArray(data:DataObject[], field:GraphField) : number[] {
        let array:number[] = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            let value = Number(row[field.name]).valueOf();
            array.push(value);
        }

        return array;
    }

    static getScatterArray(data:DataObject[],
                           xField:GraphField,
                           yField:GraphField) : ScatterField[] {
        let array:ScatterField[] = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            let field:ScatterField = {
                x: row[xField.name],
                y: row[yField.name]
            }

            array.push(field);
        }

        return array;
    }

    static getAxisRange(data: number[]) : AxisRange {
        let min:number = Number.MAX_VALUE;
        let max:number = Number.MIN_VALUE;

        for (let i = 0; i < data.length; i++) {
            let value = data[i];

            if (value < min) {
                min = value;
            }

            if (value > max) {
                max = value;
            }
        }

        min = min - 10;
        max = max + 10;

        return {
            min: min,
            max: max
        };
    }
}