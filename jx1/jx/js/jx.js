//1.获取题目数据
let objData = {
    id: 1,
    right: 0,
    wrong: 0,
    percent: '0.00%',
    zuoda: [],
    rightArr: [],
    wrongArr: [],

}

let num = 1;
getData(num);

function getData(num) {
    $.ajax({
        type: 'get',
        url: 'PHP/jx.php', //相对于html文件的路径
        data: {
            num
        },
        dataType: 'json',
        success(res) {
            //1.1获取题号和问题渲染到页面
            $('.title1 p').html(res.id + '.' + res.question);
            //1.2判断题目的类型
            if (res.Type === '2') {
                let str = `<label for=""><input type="radio" name="sel" value="1"> A：${res.a}</label>
                <label for=""><input type="radio" name="sel" value="2"> B: ${res.b}</label>
                <label for=""><input type="radio" name="sel" value="3"> C：${res.c}</label>
                <label for=""><input type="radio" name="sel" value="4"> D: ${res.d}</label>`;
                $('.sel').html(str);
            } else {
                let str = `<label for=""><input type="radio" name="sel" value="1"> 正确</label>
                <label for=""><input type="radio" name="sel" value="2"> 错误</label>`;
                $('.sel').html(str);
            }

            //当题目渲染完毕，才可以开始答题
            answerQuestion(res); //实参--外边要使用数据

        }
    })
}

//2.上一题和下一题
$('.next').click(function () {
    num++;
    if (num > 100) {
        num = 100;
        return;
    }
    getData(num);

    //清空答案
    $('.daan').html('')

    //存储题号
    objData.id = num;
    localStorage.setItem('objData', JSON.stringify(objData))
})
$('.prev').click(function () {
    num--;
    if (num < 1) {
        num = 1;
        return;
    }
    getData(num);

    //清空答案
    $('.daan').html('');
})

//3.渲染所有题号
let str = '';
for (let i = 1; i < 101; i++) {
    str += `<div class="item">${i}</div>`;
}
$('.container').html(str);

//4.开始答题
/* 
需要：
1.判断此题是否已经作答，如果已经作答，提示【这个题目之前已经作答过了】；否则可以答题
2.可以作答需要判断答案是否正确
3.数据的ta存储的正确答案
4.对应的渲染正确和错误的样式
5.答案一经选择，不可以修改，其他按钮不可以点击
6.作答过的题目存储到数组中
*/
function answerQuestion(res) {
    console.log(res);
    //1.点击题目下面的答案--开始作答
    $('.sel input').click(function () {
        //获取input的value值，用value和ta做比较
        let val = $(this).val();
        //答案点击之后，其他所有按钮不能再被点击
        $('.sel input').attr('disabled', true);
        //判断此题是否已经作答
        //声明变量，存储已经作答过的题号
        if (objData.zuoda.indexOf(res.id) === -1) {
            //没有作答
            //判断答案的对错
            if (val === res.ta) {
                //渲染到页面
                $('.daan').html('<span>恭喜您答对了</span>');
                //渲染下面题号的颜色  下标比id少1
                $('.container>.item').eq(res.id - 1).addClass('rightOk');
                //正确的个数+1
                objData.right++;
                //添加正确的题号的数据到数组中
                objData.rightArr.push(res.id)

            } else { //错误
                $('.daan').html('<span class="w">很遗憾答错了</span>')
                //渲染下面题号的颜色
                $('.container>.item').eq(res.id - 1).addClass('error');
                //错误的个数+1
                objData.wrong++;
                //添加错误题号的数据到数组中
                objData.wrongArr.push(res.id)
            }
            //已经作答过的题目的id添加到作答的数组中
            objData.zuoda.push(res.id);
            //正确的个数等信息渲染到页面
            objData.percent = (objData.right / objData.zuoda.length * 100).toFixed(2) + '%';

            $('.zong').html(objData.zuoda.length);
            $('.right').html(objData.right);
            $('.right').html(objData.wrong);
            $('.lv').html(objData.percent);

            //作答完毕后，数据需要存储到本地
            localStorage.setItem('objData', JSON.stringify(objData));

        } else { //已经作答
            $('.daan').html('<span class="w">这个题目之前已经作答过了</span>')

        }
    })

}

//6.本地存储
//6.1进入页面--判断是否有本地存储，有存储，渲染存储的结果，没有从第一题开始答题
//获取本地存储的数据
let data = localStorage.getItem('objData');
//判断本地是够有存储的数据
if (data) { //有本地数据
    //把本地数据转换为js对象，赋值给本地存储的数据
    objData = JSON.parse(data);
    //判断是否是第一题
    if (objData.id === 1) {
        num = 1;
        getData(num);
    } else {
        let result = confirm(`之前你已经看到第${objData.id}题，是否继续?`);
        if (result) {
            num = objData.id;
            getData(num);
            //渲染正确率和按钮的颜色等数据
            setDataView(objData);

        } else {
            num = 1;
            getData(num);
            localStorage.removeItem('objData');
            //初始化数据
            objData = {
                id: 1, //题号
                right: 0, //正确的个数
                wrong: 0, //错误的个数
                percent: '0.00%', //正确率
                zuoda: [], //已经作答过的题目
                rightArr: [], //正确的题号
                wrongArr: [] //错误的题号
            }
        }
    }

} else { //没有本地数据
    //渲染第一题
    getData(1);

}

//7.封装渲染页面的数据--正确率等
function setDataView(objData) {
    //正确率等
    $('.zong').html(objData.zuoda.length);
    $('.right').html(objData.right);
    $('.wrong').html(objData.wrong);
    $('.lv').html(objData.percent);

    //按钮的颜色
    for (var i = 0; i < objData.rightArr.length; i++) {
        //eq(index):下标比id小1  数组元素存储的数据是id
        $('.container>.item').eq(objData.rightArr[i] - 1).addClass('rightOk');
    }

    for (var i = 0; i < objData.wrongArr.length; i++) {
        $('.container>.item').eq(objData.wrongArr[j] - 1).addClass('error');
    }
}

//重新答题
$('.begin').click(function () {
    //清空所有样式 返回第一题
    num = 1;
    getData(num);

    //清空所有按钮的颜色
    for (var i = 0; i < objData.zuoda.length; i++) {
        $('.container>.item').eq(objData.zuoda[i] - 1).removeClass('rightOk error');
    }

    //清空本地数据
    localStorage.removeItem('objData');

    //初始化数据
    //初始化数据
    objData = {
        id: 1, //题号
        right: 0, //正确的个数
        wrong: 0, //错误的个数
        percent: '0.00%', //正确率
        zuoda: [], //已经作答过的题目
        rightArr: [], //正确的题号
        wrongArr: [] //错误的题号
    }

    //渲染到页面 -- 正确率等
    $('.zong').html(objData.zuoda.length);
    $('.right').html(objData.right);
    $('.wrong').html(objData.wrong);
    $('.lv').html(objData.percent);

})