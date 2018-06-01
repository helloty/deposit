"use strict";
var DepositItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.value = obj.value;
        this.date = obj.date;
        this.money = obj.money;
        this.user = obj.user;
        this.remark = obj.remark;
    } else {
        this.key = "";
        this.value = "";
        this.date = "";
        this.money = "";
        this.user = "";
        this.remark = "";
    }
};

DepositItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var Deposit = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new DepositItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Deposit.prototype = {
    init: function () {
        console.log('init');
    },
    save: function (value, money, date, user, remark) {
        var from = Blockchain.transaction.from;
        var depositItem = this.repo.get(from);
        if (depositItem) {
            depositItem.value = JSON.parse(depositItem).value + '|-' + value;
            depositItem.money = JSON.parse(depositItem).money + '|-' + money;
            depositItem.date = JSON.parse(depositItem).date + '|-' + date;
            depositItem.user = JSON.parse(depositItem).user + '|-' + user;
            depositItem.remark = JSON.parse(depositItem).remark + '|-' + remark;
            this.repo.put(from, depositItem);
        } else {
            depositItem = new DepositItem();
            depositItem.key = from;
            depositItem.value = value;
            depositItem.money = money;
            depositItem.date = date;
            depositItem.user = user;
            depositItem.remark = remark;
            this.repo.put(from, depositItem);
        }
    },
    get: function (key) {
        var from = Blockchain.transaction.from;
        return this.repo.get(from);
    }
};
module.exports = Deposit;