<template>
    <div>
        <el-scrollbar>
            <div class="scrollbar-flex-content">
                <el-button @click="CreateDrawPciture('线段','line1')" class="line1" plains style="margin-right: 10px;">线段
                </el-button>
                <el-button @click="CreateDrawPciture('射线','line2')" class="line2" plains style="margin-right: 10px;">射线
                </el-button>
                <el-button @click="CreateDrawPciture('水平线','line3')" class="line3" plains style="margin-right: 10px;">
                    水平线</el-button>
                <el-button @click="CreateDrawPciture('趋势线','line4')" class="line4" plains style="margin-right: 10px;">
                    趋势线</el-button>
                <el-button @click="CreateDrawPciture('矩形','line5')" class="line5" plains style="margin-right: 10px;">矩形
                </el-button>
                <el-button @click="CreateDrawPciture('圆弧线','line6')" class="line6" plains style="margin-right: 10px;">
                    圆弧线</el-button>
                <el-button @click="CreateDrawPciture('M头W底','line7')" class="line7" plains style="margin-right: 10px;">
                    M头W底</el-button>
                <el-button @click="CreateDrawPciture('黄金分割线','line8')" class="line8" plains style="margin-right: 10px;">
                    黄金分割线</el-button>
            </div>
        </el-scrollbar>

        <div ref="kline"></div>
        <div class="panel">
            <div class="info" style="margin-right: 10px">{{message}}</div>
            <div class="operate">
                <el-button @click="RestartTrain" plains style="margin-right: 10px;">重新开始</el-button>
                <div class="nextorauto">
                    <el-checkbox label="自动前进" v-model="autoMoveKLine" />
                    <el-button @click="MoveNextKLine" plains style="margin-right: 10px;">下一K线</el-button>
                </div>
                <div class="buyorsell">
                    <el-button @click="Buy" plains v-if="!isHiddenBuy">买入</el-button>
                    <el-button @click="Sell" plains v-if="isHiddenBuy">卖出</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HQChart from 'hqchart'

function DefaultData() { }
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
        CorssCursorInfo: { Left: 0, Right: 2, Bottom: 1, IsShowCorss: true },
        Border: //边框
        {
            Left: 1,
            Right: 25, //右边间距
            Top: 25,
            Bottom: 25,
        },
        KLine:
        {
            DragMode: 1,
            Right: 0,                            //复权 0 不复权 1 前复权 2 后复权
            Period: 0,                           //周期: 0 日线 1 周线 2 月线 3 年线 
            PageSize: 70,   // 一屏显示多少数据
            IsShowTooltip: true,
            MaxRequestDataCount: 2000,
            RightSpaceCount: 30

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
        },
        Frame:  //子框架设置
            [
                { SplitCount: 3, IsShowLeftText: false },
                { SplitCount: 2, IsShowLeftText: false }
            ],
        ExtendChart:    //扩展图形
            [
                { Name: 'KLineTooltip' },  //手机端tooltip
                { Name: '背景图', FrameID: 0 }
            ],
        DrawTool: {
            // 存储到缓存中
            StorageKey: '4E7EA133-D6C8-4776-9869-1DDDCC5FA744'
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
            autoMoveKLine: false,
            isHiddenBuy: false,

            LatestKData: null, // 最新的交易
            LastShowData: null,
            message: null,

            OrderID: 0, //交易订单
            AryTrade: [], // 交易的数组
            LatestTrade: null,  // 最后一次交易
        }
    },
    watch: {
        // 当checkbox的值发生变化时
        autoMoveKLine: {
            handler() {
                if (this.autoMoveKLine) {
                    this.Run()
                } else {
                    this.Stop()
                }
            }
        }
    },
    created() {

    },
    mounted() {
        // 在挂载时调整窗口大小
        this.OnSize();
        // 在windwo的大小发生变化时，调整大小
        window.onresize = () => { this.OnSize(); }
        // 创建KLine
        this.CreateKLineChart();
    },
    methods:
    {
        OnSize() {
            var chartHeight = window.innerHeight - 30 - 40;
            var chartWidth = window.innerWidth - 50;
            var kline = this.$refs.kline;// refs是对dom的引用
            kline.style.width = chartWidth + 'px';
            kline.style.height = chartHeight + 'px';
            if (this.KLine.JSChart) {
                this.KLine.JSChart.OnSize();
            }
        },
        CreateKLineChart()  //创建K线图
        {
            if (this.KLine.JSChart) return;

            this.KLine.Option.Symbol = this.Symbol;

            // 创建JSChart
            let chart = HQChart.Chart.JSChart.Init(this.$refs.kline);//$refs表示对dome节点的引用
            chart.SetOption(this.KLine.Option);
            this.KLine.JSChart = chart;


            // JSCHART_EVENT_ID.RECV_TRAIN_MOVE_STEP 实际上是4
            chart.AddEventCallback({
                event: 4,
                callback: (event, data, obj) => {
                    console.log("k线被移动了")
                    this.OnKLineMove(event, data, obj);
                }
            })
            // ON_CLICK_DRAWPICTURE:17,//点击画图工具 
            // ON_FINISH_DRAWPICTURE:18,//完成画图工具 
            chart.AddEventCallback(
                {
                    event: 17,
                    callback: (event, data, obj) => { this.OnClickDrawPicture(event, data, obj); }
                }
            )
            chart.AddEventCallback({
                event: 18,
                callback: (event, data, obj) => { this.OnFinishDrawPicture(event, data, obj); }
            })
        },
        CreateDrawPciture(name, tagName) {
            // this.TagName = tagName;// 这里的tag不知道是什么
            // 设置tag
            // document.getElementsByClassName(this.TagName)[0].style.color = 'rgb(255,0,0)';
            // TODO:把其他按钮颜色清空

            var drawOption =
            {
                LineColor: '#4169E1',    //线段颜色
                LineWidth: 2,            //线段宽度
                PointColor: 'rgb(255,130,71)'    //点颜色
            };

            this.KLine.JSChart.CreateChartDrawPicture(name, drawOption);
        },
        ClearChartDrawPicture() {

        },
        OnClickDrawPicture(event, data, obj) {
            console.log('[KLineChart::OnClickDrawPicture] data', data);
        },
        OnFinishDrawPicture(event, data, obj) {
            console.log('[KLineChart::OnFinishDrawPicture] data', data);

        },
        OnKLineMove(event, data, obj) {
            // 得到最新的数据
            this.LatestKData = data.LastShowData
            var dateTime = `日期:${this.LatestKData.Date}`;
            if (this.LatestKData.Time) {
                dateTime = `日期:${this.LatestKData.Date} 时间:${this.LatestKData.Time}`
            }

            //更新界面显示信息
            var message = `状态:${data.Description} ${dateTime} 最新价格: ${this.LatestKData.Close.toFixed(2)} 剩余数据:${data.TrainDataCount}`;
            this.message = message

            if (data.TrainDataCount <= 0) {
                this.LatestKData = null
            }
        },
        MoveNextKLine() {
            this.KLine.JSChart.JSChartContainer.MoveNextKLineData()
        },
        Run() {
            this.KLine.JSChart.JSChartContainer.Run()
        },
        Stop() {
            this.KLine.JSChart.JSChartContainer.Stop()
        },
        Sell() {
            if (!this.LatestKData) {
                return
            }
            ++this.OrderID
            // 卖出时是最后的数据的收盘价
            let data = {
                Price: this.LatestKData.Close,
                Vol: 10,
                Op: 1,
                ID: this.OrderID
            }
            this.LatestTrade = data
            // 上次的交易
            let tradeItem = this.AryTrade[this.AryTrade.length - 1]
            tradeItem.Sell = {
                Price: data.Price,
                ID: data.ID,
                Date: this.LatestKData.Date,
                Time: this.LatestKData.Time
            }
            // data,isDraw是否更新图形
            this.KLine.JSChart.JSChartContainer.BuyOrSell(data, false)
            this.KLine.JSChart.JSChartContainer.MoveNextKLineData()

            // 计算分数
            this.CalulateScore()
            // 隐藏与显示操作
            this.isHiddenBuy = false
        },
        Buy() {
            if (!this.LatestKData) {
                return
            }
            ++this.OrderID
            // 买入时是最后的数据的收盘价
            let data = {
                Price: this.LatestKData.Close,
                Vol: 10,
                Op: 0,
                ID: this.OrderID
            }
            this.LatestTrade = data
            // 一个tradeItem的结构{Buy:{},Sell{}}
            let tradeItem = {
                Buy: {
                    Price: data.Price,
                    ID: data.ID,
                    Date: this.LatestKData.Date,
                    Time: this.LatestKData.Time
                }
            };
            this.AryTrade.push(tradeItem)

            this.KLine.JSChart.JSChartContainer.BuyOrSell(data, false);
            this.KLine.JSChart.JSChartContainer.MoveNextKLineData()

            // 计算分数
            this.CalulateScore()
            this.isHiddenBuy = true
        },
        RestartTrain() {
            this.AryTrade = []
            this.LatestKData = null
            this.LatestTrade = null
            this.message = null
            this.isHiddenBuy = false
            let bgPaint = this.GetBGChartPaint()
            if (bgPaint) {
                bgPaint.Data = null
            }
        },
        CalulateScore() {
            var count = 0
            var sucess = 0
            var aryBGData = [] // 背景颜色
            // 遍历交易，只有同时满足item有Buy与Sell
            for (let i in this.AryTrade) {
                let item = this.AryTrade[i]
                if (!item.Buy || !item.Sell) {
                    continue
                }
                var bgItem = {
                    Start: {
                        Date: item.Buy.Date,
                        Time: item.Buy.Time
                    },
                    End: {
                        Date: item.Sell.Date,
                        Time: item.Sell.Time
                    }
                }
                if (item.Buy.Price < item.Sell.Price) {
                    ++sucess
                    bgItem.Color = 'rgba(250,128,114,0.5)'
                } else {
                    bgItem.Color = 'rgba(152,251,152,0.5)'
                }
                aryBGData.push(bgItem)
                ++count
            }
            var result = 0
            if (count > 0) {
                result = sucess / count
            }
            var message = `成绩:交易次数${count} 成功次数${sucess} 胜率${result}`
            this.message = message

            // 绘制交易背景，背景绘制还没有
            var bgPaint = this.GetBGChartPaint()
            if (bgPaint) {
                console.log(aryBGData)
                bgPaint.Data = aryBGData
            }
        },
        GetBGChartPaint() {
            for (var i in this.KLine.JSChart.JSChartContainer.ExtendChartPaint) {
                var item = this.KLine.JSChart.JSChartContainer.ExtendChartPaint[i];

                if (item.ClassName == 'BackgroundPaint') return item;
            }
            return null;
        }
    }
}
</script>

<style>
.panel {
    /* flex规定子元素 */
    display: flex;
    height: 90;
    flex-direction: row;
    justify-content: space-between;
    background-color: beige;
}

.info {
    font-size: medium;
}

.operate {
    display: flex;
    flex-direction: row;
}

.nextorauto {
    display: flex;
    flex-direction: row;
}

.buyorsell {
    display: flex;
    flex-direction: row;
}

.scrollbar-flex-content {
    display: flex;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
}
</style>