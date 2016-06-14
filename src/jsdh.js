/*

The MIT License (MIT)

Copyright (c) 2016 Seachaos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/


function JSDH(){
	this.shakeTimes = parseInt(Math.random() * 5) + 3;
	this.maxShakeTimes = this.shakeTimes;
	this.key = '';
	this.finish = false;
	this.aa = 'none';
};

JSDH.prototype.onShakeProgress = function(){
	var progress = (this.maxShakeTimes - this.shakeTimes) / (this.maxShakeTimes+1) * 100;
	this.progressCallback(parseInt(progress));
}

JSDH.prototype.shakeHand = function(){
	var me = this;
	$.ajax({
		url: me.shakeUrl,
		type: 'POST',
		data: { caa : me.aa, finish: me.finish },
		dataType: 'json',
		success: function(data){
			if(me.finish){
				me.successCallback(me.key);
				return;
			}
			data.g = new BigNumber(data.g);
			data.p = new BigNumber(data.p);
			data.bb = new BigNumber(data.bb);

			var offset = 1;
			offset = (data.table.length - offset) * Math.random() + offset;
			offset = parseInt(offset);
			console.log(offset);
			var a = data.table[offset];
			a = new BigNumber(a);
			var aa = data.g.toPower(a).mod(data.p);
			// if(aa<10){
				// me.aa = 'none';
				// me.shakeHand();
				// return;
			// }
			var key = data.bb.toPower(a).mod(data.p);
			me.key += key.toString() + 'x';
			me.aa = aa.toString();

			console.log('shake:'+aa);
			if (me.shakeTimes -- > 0){
				me.onShakeProgress();
				me.shakeHand();
			}else{
				me.finish = true;
				me.shakeHand();
			}
		}, error: function(raw){
			me.failedCallback();
		}
	});
}

JSDH.prototype.init = function(arg){
	this.successCallback = arg.onSuccess;
	this.progressCallback = arg.onShake;
	this.failedCallback = arg.onFailed;
	this.shakeUrl = arg.prime_url;
	this.shakeHand();
}

