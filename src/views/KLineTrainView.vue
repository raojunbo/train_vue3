<template>
    <div>
        <div>{{message}}</div>
        <button @click="MoveNextKLine">下一个</button>
        <div ref="kline"></div>
    </div>
</template>

<script>
import HQChart from 'hqchart'

function DefaultData() {

}
DefaultData.GetKLineOption = function () {
    let data =
    {
        Type: 'K线训练',
        Windows: //窗口指标
            [
                { Index: "MA", Modify: false, Change: false },
                { Index: "VOL", Modify: false, Change: false },
            ],
        IsShowCorssCursorInfo: true,
        Border: //边框
        {
            Left: 1,
            Right: 1, //右边间距
            Top: 25,
            Bottom: 25,
        },
        KLine:
        {
            Right: 1,                            //复权 0 不复权 1 前复权 2 后复权
            Period: 0,                           //周期: 0 日线 1 周线 2 月线 3 年线 
            PageSize: 70,   // 一屏显示多少数据
            IsShowTooltip: true,
            MaxRequestDataCount: 2000,
            RightSpaceCount: 2

        },
        KLineTitle: {
            isShowName: false,
            isShowSettingInfo: false,
            isShowDateTime: true
        },
        Train: {
            DataCount: 200, // 训练数据
            StartDate: {
                Date: 20180201
            }
        }
    };
    return data;
}
export default {
    name: "Train",
    data() {
        return {
            Symbol: '600000.sh',
            KLine:
            {
                JSChart: null,//图
                Option: DefaultData.GetKLineOption(),// 图的配置对象
            },
            LatestKData: null,
            LastShowData: null,
            message: null
        }
    },
    created() {
    },
    mounted() {
        this.OnSize();
        // 在windwo的大小发生变化时，调整大小
        window.onresize = () => { this.OnSize(); }
        // 创建KLine
        this.CreateKLineChart();
    },
    methods:
    {
        OnSize() {
            var chartHeight = window.innerHeight - 30;
            var chartWidth = window.innerWidth - 30;
            var kline = this.$refs.kline;
            kline.style.width = chartWidth + 'px';
            kline.style.height = chartHeight + 'px';
            if (this.KLine.JSChart) this.KLine.JSChart.OnSize();
        },
        CreateKLineChart()  //创建K线图
        {
            if (this.KLine.JSChart) return;

            this.KLine.Option.Symbol = this.Symbol;

            // 创建JSChart
            let chart = HQChart.Chart.JSChart.Init(this.$refs.kline);//$refs表示对dome节点的引用
            chart.SetOption(this.KLine.Option);
            this.KLine.JSChart = chart;

            // 监听表格的事件
            this.KLine.JSChart.AddEventCallback({
                event: JSCHART_EVENT_ID.RECV_TRAIN_MOVE_STEP,
                callback: (event, data, obj) => {
                    this.OnKLineMove(event, data, obj)
                }
            })
        },
        OnKLineMove(event, data, obj) {
            console.log("[KLineChart::OnKLineMove] data", data);
            this.LatestKData = data.LastShowData

            var dateTime = `日期:${this.LatestKData.Date}`;
            if (this.LatestKData.Time) {
                dateTime = `日期:${this.LatestKData.Date} 时间:${this.LatestKData.Time}`
            }

            //更新界面显示信息
            var message = `状态:${data.Description} ${dateTime} 最新价格: ${this.LatestKData.Close.toFixed(2)} 剩余数据:${data.TrainDataCount}`;
            this.message = message
            // $("#traininfo")[0].innerText = message;

            if (data.TrainDataCount <= 0) {
                this.LatestKData = null
            }
        },
        MoveNextKLine() {
            this.KLine.JSChart.JSChartContainer.MoveNextKLineData()
        },
        Run() {
            this.kline.JSChartContainer.Run()
        },
        Stop() {
            this.KLine.JSChartContainer.Stop()
        }
    }
}
</script>

<style>

</style>