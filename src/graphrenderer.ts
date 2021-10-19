import {App, MarkdownRenderChild} from 'obsidian';
import {GraphSpec} from "./types";
import {DataRepo} from "./repos";
import { Chart, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController,
         DoughnutController, LineController, PieController, PolarAreaController, RadarController,
         ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale,
         TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip } from 'chart.js';
import {ChartFactory} from "./chartFactory";
import 'chartjs-adapter-moment';

export class GraphRenderer extends MarkdownRenderChild {
    ID_PREFIX:string;
    repo: DataRepo;

    constructor(public app: App, public graphSpec: GraphSpec, public container: HTMLElement) {
        super(container)

        this.ID_PREFIX = "dcg_";
        this.repo = new DataRepo(app.vault);
    }

    async onload() {
        Chart.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController,
            DoughnutController, LineController, PieController, PolarAreaController, RadarController,
            ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale,
            TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip);

        await this.render();
    }

    async render() {
        this.repo.ReadData(this.graphSpec.source)
            .then(dataObjects => {
                const chartElement = this.container.createEl(
                    'canvas',
                    { attr: {style:'width:600px;height:300px;'}});

                chartElement.id = this.ID_PREFIX + "chart";

                let context2D = chartElement.getContext('2d');

                let myChart = ChartFactory.getChart(
                    this.graphSpec,
                    dataObjects,
                    context2D);
            })
            .catch(e => {
               console.log(e.message);
            });
    }
}