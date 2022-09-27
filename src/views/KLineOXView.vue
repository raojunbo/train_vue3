<template>
    <div>
        <div id="kline" ref="kline"></div>
    </div>
</template>

<script>
import HQChart from 'hqchart'

function DefaultData() {

}
DefaultData.GetKLineOption = function () {
    let data =
    {
        Type: '历史K线图',
        Windows: //窗口指标
            [
                { Index: "MA", Modify: false, Change: false },
                { Index: "VOL", Modify: false, Change: false },
                { Index: "OX", Args: [{ Name: 'Reversal', Value: 3 }] }
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
            MaxRequestDataCount:2000,
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
                Date:20180201
            }
        }
    };
    return data;
}
export default {
    name:"OX",
    data() {
        var data =
        {
            Symbol: '600000.sh',
            KLine:
            {
                JSChart: null,
                Option: DefaultData.GetKLineOption(),
            },
        };
        return data;
    },
    created() {
    },
    mounted() {
        this.OnSize();
        window.onresize = () => { this.OnSize(); }
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
            let chart = HQChart.Chart.JSChart.Init(this.$refs.kline);
            chart.SetOption(this.KLine.Option);
            this.KLine.JSChart = chart;
        }
    }
}
</script>

<style>

</style>