//声明全局变量
let num = 1, max = 100;
// let zuoda = [];//存储已经作答过的题目
//正确的个数、错误的个数、正确率
// let right = 0, wrong = 0, percent = '0.00%';
//声明对象，初始化本地存储的数据格式
let objData = {
    id: 1,//题号
    right: 0,//正确的个数
    wrong: 0,//错误的个数
    percent: '0.00%',//正确率
    zuoda: [],//已经作答过的题目
    rightArr: [],//正确的题号
    wrongArr: []//错误的题号
}

//1.渲染数据--------题号+题目+答案-------------
/* 
思路：
1.页面一加载渲染数据
2.页面一加载开始网络请求(ajax发送请求，数据响应给ajax，渲染到页面)

*/

// getData(num);
function getData(num) {//num--形参--题号
    //网络请求
    $.ajax({
        type: 'get',
        url: './php/index.php',//php--解决跨域--html页面相对于php文件的路径
        data: {
            //后台的变量:前端的变量
            num: num
        },
        success: function (res) {
            res = JSON.parse(res);
            // console.log(res);
            //把数据渲染到页面
            //①渲染题目
            $('.title1>p').html(res.id + '.' + res.question);
            //②渲染答案
            //判断是选择器还是判断题--四个选项还是两个选项
            if (res.Type === '1') {
                //判断题
                let str = `
                <label for=""><input type="radio" name="sel" value="1"> 正确</label>
                <label for=""><input type="radio" name="sel" value="2"> 错误</label>`;
                //添加到div中
                $('.sel').html(str);

            } else {
                //选择器
                let str = `
                <label for=""><input type="radio" name="sel" value="1"> A：${res.a}</label>
                <label for=""><input type="radio" name="sel" value="2"> B：${res.b}</label>
                <label for=""><input type="radio" name="sel" value="3"> C：${res.c}</label>
                <label for=""><input type="radio" name="sel" value="4"> D：${res.d}</label>`;
                //添加到div中
                $('.sel').html(str);
            }

            //当题目渲染完毕，才可以开始答题
            answerQuestion(res);//实参--外边要使用数据
        }
    });
}

//2.下一题------------------------------------
$('.next').click(function () {
    num++;
    if (num <= max) {
        getData(num);
    }

    //清空答案
    $('.daan').html('');

    //存储题号
    //获取对象中的id属性，重新赋值
    objData.id = num;
    localStorage.setItem('objData', JSON.stringify(objData));

});

//3.上一题----------------------------------
$('.prev').click(function () {
    num--;
    //范围校验
    if (num < 1) {
        num = 1;
    }
    //重新渲染页面--题目和答案
    getData(num);

    //清空答案
    $('.daan').html('');
})


//4.渲染下面所有的题号----------------------
//思路：添加100个div到container中
let str = '';
for (let i = 1; i <= max; i++) {
    str += `<div class="item">${i}</div>`;
}
$('.container').html(str);

//5.答题-----------------------------------
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
    // console.log(res);
    //5.1点击题目下面的答案--开始作答
    $('.sel input').click(function () {
        //获取点击的按钮的value值，用value值和ta做比较
        let val = $(this).val();
        //答案点击之后，所有的按钮不能再被点击
        $('.sel input').attr('disabled', true);
        //5.2判断此题是否已经作答
        //声明数据，存储已经作答过的题号
        //在zuoda的数组中查找id
        if (objData.zuoda.indexOf(res.id) === -1) {//没有作答
            // console.log('没有答过');
            //5.3判断答案的对错
            if (val === res.ta) {//正确
                //渲染到页面
                $('.daan').html('<span>恭喜您答对了</span>');
                //渲染下面题号的颜色  下标比id少1
                $('.container>.item').eq(res.id - 1).addClass('rightOk');
                //正确的个数+1
                objData.right++;
                //添加正确题号的数据到数组中
                objData.rightArr.push(res.id)
            } else {//错误
                //渲染到页面
                $('.daan').html('<span class="w">很遗憾答错了</span>');
                //渲染下面题号的颜色
                $('.container>.item').eq(res.id - 1).addClass('error');
                //错误的个数+1
                objData.wrong++;
                //添加错误题号的数据到数组中
                objData.wrongArr.push(res.id)
            }
            //已经作答过的题目的id添加大zuoda的数组中
            objData.zuoda.push(res.id);
            // console.log(zuoda);
            //正确的个数等信息渲染到页面
            objData.percent = (objData.right / objData.zuoda.length * 100).toFixed(2) + '%';
            // console.log(percent);
            setDataView(objData);

            //作答完毕后，数据需要存储到本地
            localStorage.setItem('objData', JSON.stringify(objData));


        } else {//已经作答过
            // console.log('已经答过');
            //渲染到页面
            $('.daan').html('<span class="w">这个题目之前已经作答过了</span>');
        }

    });
}

// 6.本地存储---------------------------------------
/* 
思路：
存储方式：localStorage

存储的语句：
localStorage.setItem('key','value');
localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();

存储那些数据：
id
正确的个数  错误的个数  正确率
作答过的题目
答对的题目  答错的题目

数据存储的格式：
方法1：
    数据单独存储
    localStorage.setItem('id','value');
    localStorage.setItem('right','value');
    localStorage.setItem('wrong','value');
    localStorage.setItem('zuoda','value');

方法2：
    数组合并为一个对象存储
    let objData={
        id:1,
        right:,
        wrong,
        ...
    }
    localStorage.setItem('objData',JSON.stringify(objData));

*/

//实现本地存储
//进入页面--判断是否有本地存储，有存储，渲染存储的结果，没有从第一题开始答题
//6.1获取本地存储数据
let data = localStorage.getItem('objData');
//6.2判断本地是否有存储的数据
if (data) {//有存储数据
    // console.log('有数据');
    //6.3把本地数据转换为js对象,赋值给本地存储的数据
    objData = JSON.parse(data);
    console.log(objData);
    //6.4判断是否是第一题，第一题直接显示内容，不弹窗；否则弹窗
    if (objData.id === 1) {
        num = 1;
        getData(num);
    } else {
        //弹窗
        //确定，继续；取消，从第一题开始
        let result = confirm(`之前你已经看到第${objData.id}题，是否继续?`);
        if (result) {//确定
            num = objData.id;
            getData(num);
            //渲染正确率和按钮的颜色等数据
            setDataView(objData)

        } else {//取消
            num = 1;
            getData(num);
            //清除本地数据
            localStorage.removeItem('objData');
            //初始化数据
            objData = {
                id: 1,//题号
                right: 0,//正确的个数
                wrong: 0,//错误的个数
                percent: '0.00%',//正确率
                zuoda: [],//已经作答过的题目
                rightArr: [],//正确的题号
                wrongArr: []//错误的题号
            }

        }

    }

} else {//没有本地数据
    console.log('本地没有数据');
    //渲染第一题
    getData(1);
}

//7.封装渲染页面的数据--正确率等-----------------
function setDataView(objData) {
    //正确率等
    $('.zong').html(objData.zuoda.length);
    $('.right').html(objData.right);
    $('.wrong').html(objData.wrong);
    $('.lv').html(objData.percent);

    //按钮的颜色
    //正确的按钮添加绿色
    for (let i = 0; i < objData.rightArr.length; i++) {
        //eq(index):下标比id小1  数组元素存储的数据是id
        $('.container>.item').eq(objData.rightArr[i] - 1).addClass('rightOk');
    }
    //错误的按钮添加红色
    for (let j = 0; j < objData.wrongArr.length; j++) {
        $('.container>.item').eq(objData.wrongArr[j] - 1).addClass('error');
    }
}


//8.重新答题---------------------------------
$('.begin').click(function () {
    //清空所有的样式，返回第一题
    num = 1;
    getData(num);

    //清空所有按钮的颜色
    for (let i = 0; i < objData.zuoda.length; i++) {
        $('.container>.item').eq(objData.zuoda[i] - 1).removeClass('rightOk error');
    }

    //清空本地存储数据
    localStorage.removeItem('objData');
    //初始化数据
    objData = {
        id: 1,//题号
        right: 0,//正确的个数
        wrong: 0,//错误的个数
        percent: '0.00%',//正确率
        zuoda: [],//已经作答过的题目
        rightArr: [],//正确的题号
        wrongArr: []//错误的题号
    }
    //渲染到页面--正确率等
    $('.zong').html(objData.zuoda.length);
    $('.right').html(objData.right);
    $('.wrong').html(objData.wrong);
    $('.lv').html(objData.percent);

})
