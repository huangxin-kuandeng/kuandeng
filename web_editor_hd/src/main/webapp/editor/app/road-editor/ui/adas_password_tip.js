/**
 * Created by wt on 2015/11/10.
 */
iD.ui.AdasPasswordTip = function (context, passwordRight, passwordWrong, adasRoads,adasValue) {
    var adsPassword = {}, modal, res = false;

    function openAdasPasswordBox(tip) {
        res = false;
        modal = iD.ui.modal(context.container());
        modal.select('.modal')
            .attr('class', 'modal-splash modal KDSEditor-col6')
        modal.select('button.close').attr('class', 'hide');

        modal.append('div')
            .attr('class', 'adasPwDiv')
            .attr('id', 'adasPwDiv');
        var adasPwDiv = d3.select('.adasPwDiv');
        var adasPw = adasPwDiv.append('div')
            .attr('class', 'adasPw')
            .attr('id', 'adasPw')
        var titleTable = adasPw.append('table')
            .attr('class', 'adasPw-title-table')
            .attr('id', 'adasPw-title-table')
            .attr('cellspacing', '0');
        var tbody = titleTable.append('tbody');
        var tr = tbody.append('tr');
        tr.append('td')
            .attr('class', 'adasPw-title-content-td')
            .text('ADAS来源修改');
        tr.append('td')
            .attr('class', 'adasPw-title-close-td')
            .on('click', function () {
                closeAdasPasswordBox();
            })
            .append('span')
            .attr('class', 'adasPw-title-close-span')
            .text('×');
        var notice = adasPw.append('div')
            .attr('class', 'adasPw-notice')
        notice.append('div')
            .attr('class', 'adasPw-noticeContent')
            .text(tip);
        notice.append('input')
            .attr('class', 'adasPw-passwd')
            .attr('id', 'adasPw-passwd')
            .attr('type', 'password')
        notice.append('div')
            .attr('class', 'adasPw-passwordErr')
            .attr('id', 'adasPw-passwordErr')
            .text('密码错误，请重新输入!')
            .attr('class', 'hide')
        var button = adasPw.append('div')
            .attr('class', 'adasPw-buttons')
        button.append('input')
            .attr('type', 'button')
            .attr('class', 'adasPw-ok')
            .attr('value', '确 定')
            .on('click', function () {
                var passwd = document.getElementById('adasPw-passwd').value;
                var err = d3.select('#adasPw-passwordErr');
                if (passwd == iD.AdasPassword.password) {
                    err.attr('class', 'hidden');
                    res = true;
                    closeAdasPasswordBox();
                }
                else {
                    res = false;
                    err.attr('class', 'adasPw-passwordErr');
                }
            });
        button.append('input')
            .attr('type', 'button')
            .attr('class', 'adasPw-cancel')
            .attr('value', '取 消')
            .on('click', function () {
                closeAdasPasswordBox();
            });
    }

    function closeAdasPasswordBox() {
        var delDiv = document.getElementById('adasPwDiv');
        if (delDiv != null) {
            delDiv.parentNode.removeChild(delDiv);
            modal.close();
            if (res == true) {
                if (passwordRight)
                    passwordRight(adasRoads,adasValue);
            }
            else {
                if (passwordWrong)
                    passwordWrong();
            }
        }
    }

    adsPassword.perform = function (tip) {
        var delDiv = document.getElementById('adasPwDiv');
        if (delDiv == null) {
            openAdasPasswordBox(tip);
            if (res == false) {
                if (passwordWrong)
                    passwordWrong();
            }
            else {
                if (passwordRight)
                    passwordRight(adasRoads,adasValue);
            }
        }
    }
    return adsPassword;
}