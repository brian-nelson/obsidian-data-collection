import {DataObject, GraphField, GraphSpec, ScatterField} from "./types";
import {Chart} from "chart.js";
import {DataHelper} from "./datahelper";

export class ChartFactory{
    static getChart(graphSpec:GraphSpec,
             data:DataObject[],
             context:CanvasRenderingContext2D) : Chart {
        const labelField:GraphField = DataHelper.getLabelField(graphSpec.fields);
        const dataField:GraphField = DataHelper.getDataField(graphSpec.fields);

        let chartType:String = graphSpec.type;

        if (chartType == 'bar') {
            return this.getBarChart(
                context,
                graphSpec,
                labelField,
                dataField,
                data);
        } else if (chartType == 'line') {
            return this.getLineChart(
                context,
                graphSpec,
                labelField,
                dataField,
                data);
        } else if (chartType == 'scatter') {
            return this.getScatterChart(
                context,
                graphSpec,
                labelField,
                dataField,
                data);
        } else if (chartType == 'timeseries') {
            return this.getTimeSeriesChart(
                context,
                graphSpec,
                labelField,
                dataField,
                data);
        }
    }

    private static getScatterChart(context:CanvasRenderingContext2D,
                                   graphSpec: GraphSpec,
                                   xAxisField: GraphField,
                                   yAxisField: GraphField,
                                   data: DataObject[]) : Chart {
        let scatterData:ScatterField[] = DataHelper.getScatterArray(data, xAxisField, yAxisField);

        const chart = new Chart(context, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: yAxisField.displayName,
                    data: scatterData,
                    borderWidth: 1,
                    borderColor: yAxisField.dataColor
                }]
            }
        });

        if (xAxisField.type == 'date') {
            chart.options = {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }
                }
            };
        }

        return chart;
    }

    private static getTimeSeriesChart(context:CanvasRenderingContext2D,
                                   graphSpec: GraphSpec,
                                   xAxisField: GraphField,
                                   yAxisField: GraphField,
                                   data: DataObject[]) : Chart {

        if (xAxisField.type == 'date') {
            const labelArray: any[] = DataHelper.getLabelsArrayAsDates(data, xAxisField);
            const dataArray: number[] = DataHelper.getDataArray(data, yAxisField);
            const axisRange = DataHelper.getAxisRange(dataArray);
            const dataColor: string = yAxisField.dataColor;

            return new Chart(context, {
                type: 'line',
                data: {
                    labels: labelArray,
                    datasets: [{
                        label: yAxisField.displayName,
                        data: dataArray,
                        borderWidth: 1,
                        borderColor: dataColor
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            }
                        },
                        y: {
                            max: axisRange.max,
                            min: axisRange.min
                        }
                    }
                }
            });
        } else {
            return null;
        }
    }

    private static getLineChart(context:CanvasRenderingContext2D,
                 graphSpec: GraphSpec,
                 xAxisField: GraphField,
                 yAxisField: GraphField,
                 data: DataObject[]) : Chart {
        const labelArray:any[] = DataHelper.getLabelsArray(data, xAxisField);
        const dataArray:number[] = DataHelper.getDataArray(data, yAxisField);
        const dataColor:string = yAxisField.dataColor;

        return new Chart(context, {
            type: 'line',
            data: {
                labels: labelArray,
                datasets: [{
                    label: yAxisField.displayName,
                    data: dataArray,
                    borderWidth: 1,
                    borderColor: dataColor
                }]
            }
        });
    }

    private static getBarChart(context:CanvasRenderingContext2D,
                graphSpec: GraphSpec,
                xAxisField: GraphField,
                yAxisField: GraphField,
                data: DataObject[]) : Chart {
        const labelArray:any[] = DataHelper.getLabelsArray(data, xAxisField);
        const dataArray:number[] = DataHelper.getDataArray(data, yAxisField);
        const dataColor:string = yAxisField.dataColor;

        return new Chart(context, {
            type: 'bar',
            data: {
                labels: labelArray,
                datasets: [{
                    label: yAxisField.displayName,
                    data: dataArray,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }
}
