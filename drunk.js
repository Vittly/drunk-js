if (typeof WScript == 'undefined')
	throw new Error('unable to run without Windows Script Host!')

// определяем, есть ли вывод в консоль

var log = function () {}
if (WScript.Arguments(0) == '--verbose')
	try {
		WScript.StdOut.WriteLine('>')
		log = function (s) { WScript.Echo(s) }
	} catch (e) { }


// генерируем колоду карт

var A = ['\x03','\x04','\x05','\x06']
var B = ['2','3','4','5','6','7','8','9','10','J','D','K','T']

var all = []
for (var i = 0; i < 4; i++)
  for (var j = 0; j < 13; j++)
  	all.push({i : i, j : j})


// раздаем карты двум игрокам

var p1 = []
var p2 = []

function get_one() {
	var i = Math.floor(Math.random() * all.length)
	var x = all[i]
	all.splice(i, 1) // удаляем i-ый элемент
	return x
}

while (all.length > 0) {
	p1.push(get_one())
	p2.push(get_one())
}

// играем в "пьяницу"

var bank = []

var c1, c2

function dump(label, p) {
	var s = label + ':'
	for (var i = 0; i < p.length; i++) {
		var pi = p[i]
		s += ' ' + A[pi.i] + B[pi.j]
	}
	log(s)
}

function f(p, dir) {
	while (bank.length > 0)
		p.unshift(bank[dir]())
	log('\n')
	dump('player1', p1)
	dump('player2', p2)
}

while (p1.length > 0 && p2.length > 0) {
	c1 = p1.pop()
	c2 = p2.pop()
	bank.push(c1, c2)
	if (c1.j > c2.j)
		f(p1, 'pop')
	else if (c2.j > c1.j)
		f(p2, 'shift')
	else if (p1.length > 0 && p2.length > 0)
			bank.push(p1.pop(), p2.pop())
}

WScript.Echo('\n' + (p1.length == 0 && p2.length == 0 ? 'Draw' : (p1.length > 0 ? 'Win' : 'Loss')) + '!')
