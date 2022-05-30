let objData = {
    id: 1,
    right: 0,
    wrong: 0,
    pencent: '0.00%',
    zuoda: [],
    rightArr: [],
    wrongArr: []
}

//1.渲染数据--题号--题目--答案
let num = 1;
getData(num);

function getData(num) {
    $.ajax({
        type: 'get',
        url: './php/jx.php',
        data: {
            num: num
        },
        success(res) {
            res = JSON.parse(res);
            // console.log(res);
            //把数据渲染到页面
            $('.title1>p').html(res.id + '.' + res.question)
            //判断是判断题还是选择题
            if (res.Type === '1') {
                let str = `<label for="right"><input type="radio"  value="1" id="right"> 正确</label>
                <label for="wrong"><input type="radio"  value="2" id="wrong">错误</label>
                `;
                $('.sel').html(str);
            } else {
                let str = `<label for="A"><input type="radio" name="sel" value="1" id="A"> A：${res.a}</label>
                <label for=""><input type="radio" name="sel" value="2"> B: ${res.b}</label>
                <label for=""><input type="radio" name="sel" value="3"> C：${res.c}</label>
                <label for=""><input type="radio" name="sel" value="4"> D: ${res.d}</label>`;
                $('.sel').html(str);
            }
            //渲染成功才可以答题
            answerQuestion(res);
        }
    })
}

//2.下一题
$('.next').click(function () {
    num++;
    if (num > 100) {
        num = 100;
        return;
    }
    $('.daan').html('')
    getData(num)

    objData.id = num;
    localStorage.setItem('objData', JSON.stringify(objData))
})
//上一题
$('.prev').click(function () {
    $('.daan').html('')
    num--;
    if (num > 0) {
        getData(num);
    }
})

//渲染所有题号
let str = '';
for (var i = 1; i < 101; i++) {
    str += `<div class="item">${i}</div>`
}
$('.container').html(str)

//答题
/* 
1.判断此题是否已经做大，如果作答提示
2.没有作答，可以作答
3.作答需要判断对错
4.数据ta存储正确答案
5.对应的渲染样式
6.答案已经选择不可以修改
7.作答过的题目存储到数组中

*/


function answerQuestion(res) {
    console.log(res);
    //点击按钮开始答题
    $('.sel input').click(function () {
        //获取val
        let val = $(this).val();
        $('.sel input').attr('disabled', true);
        if (objData.zuoda.indexOf(res.id) === -1) {
            if (val === res.ta) {
                $('.daan').html('<span>恭喜您答对了</span>')
                //渲染下面的题号
                $('.container>.item').eq(res.id - 1).addClass('rightOk')
                objData.right++;
                objData.rightArr.push(res.id);

            } else {
                $('.daan').html('<span class="w">很遗憾打错了</span>')
                //渲染下面的题号
                $('.container>.item').eq(res.id - 1).addClass('error')
                objData.wrong++;
                objData.wrongArr.push(res.id);
            }
            objData.zuoda.push(res.id);
            //统计数
            objData.pencent = (objData.right / objData.zuoda.length * 100).toFixed(2) + '%';
            $('.zong').html(objData.zuoda.length)
            $('.right').html(objData.right)
            $('.wrong').html(objData.wrong)
            $('.lv').html(objData.pencent)

            localStorage.setItem('objData', JSON.stringify(objData));


        } else {
            $('.daan').html('<span class="w">这个题目已经作答</span>')
        }
    })

}

//本地存储
let data = localStorage.getItem('objData');
if (data) {
    objData = JSON.parse(data);
    if (objData.id === 1) {
        num = 1;
        getData(num)
    } else {
        let result = confirm(`看到了${objData.id}`)
        if (result) {
            num = objData.id;
            getData(num);
            setDataView(objData);

        } else {
            num = 1;
            getData(num);
            localStorage.removeItem('objData');
            let objData = {
                id: 1,
                right: 0,
                wrong: 0,
                pencent: '0.00%',
                zuoda: [],
                rightArr: [],
                wrongArr: []
            }
        }
    }
} else {
    getData(1);
}

function setDataView(objData) {
    $('.zong').html(objData.zuoda.length)
    $('.right').html(objData.right)
    $('.wrong').html(objData.wrong)
    $('.lv').html(objData.pencent)

    //按钮的颜色
    //正确
    for (let i = 0; i < objData.rightArr.length; i++) {
        $('.container>.item').eq(objData.rightArr[i] - 1).addClass('rightOk')
    }
    for (let i = 0; i < objData.wrongArr.length; i++) {
        $('.container>.item').eq(objData.wrongArr[i] - 1).addClass('error')
    }
}

//重新答题
$('.begin').click(function () {
    num = 1;
    getData(num);
    for (var i = 0; i < objData.zuoda.length; i++) {
        $('.container>.item').eq(objData.zuoda[i] - 1).removeClass('rightOk error')
    }
    localStorage.removeItem('objData');
    objData = {
        id: 1,
        right: 0,
        wrong: 0,
        pencent: '0.00%',
        zuoda: [],
        rightArr: [],
        wrongArr: []
    }
    console.log(objData);
    $('.zong').html(objData.zuoda.length)
    $('.right').html(objData.right)
    $('.wrong').html(objData.wrong)
    $('.lv').html(objData.pencent)


})