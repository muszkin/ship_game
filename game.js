var Game = {
	x: 0,
	y: 0,
	ship_fields: [],
	cell_opening: function(id){
		return '<td id="'+id+'">';
	},
	cell_closing: '</td>',
	line_opening: '<tr>',
	line_closing:'</tr>',
	master_field_opening: '<table id="game_field">',
	master_field_closing: '</table>',
	pregame_field_selector: '.game',
	game_score: '.score',
	game_field_selector: $('#game_field'),
	log_selector: '.log',
	generate_game_field: function(x,y){
		var field = '';
		if (x != y){
			alert('Axis X need to be equal to axis y');
		}else{
			field = this.master_field_opening;
			for (axis_x = 1;axis_x <= x;axis_x++){
				field += this.line_opening;
				for (axis_y = 1;axis_y <= y;axis_y++){
					str = axis_x + "_" + axis_y;
					field += this.cell_opening(str);
					field += this.cell_closing;
				}
				field += this.line_closing;
			}
			field += this.master_field_closing;
		}
		$(this.pregame_field_selector).append(field);
		var count = Math.round(x*y/3);
		var index = 0;
		while(index != count){
			var ship = Game.generateShips(x,y);
			if (ship){
				Game.ship_fields.push(ship);
				index++;
			}
		}
	},
	addEvent: function(){
		$('td').on('click',function(){
			Game.clicked($(this));
		});
	},
	clicked: function(handle){
		shot_cord = $(handle).attr('id');
		$(handle).unbind('click');
		this.shot_check(shot_cord);
	},
	shot_check: function(shoot){
		Game.shots++;
		var cords = shoot.split('_');
		if (this.checkCords(shoot)){
			Game.logger(cords[0],cords[1],1);
			Game.hits++;
			$('#'+shoot).css('background',"#0F0");
			Game.removeShip(shoot);
			Game.place_scores();
			if (Game.ship_fields.length == 0) {
				alert('Congratulations - you destroy all ships - your ratio: '+ Game.ratio+'%');
				Game.x++;
				Game.y++;
				Game.initialize(Game.x,Game.y);
			}
		}else{
			$('#'+shoot).css('background',"#F00");
			Game.miss++;
			Game.logger(cords[0],cords[1],0);
			Game.place_scores();
		}
		
	},
	generateShips: function(size_x,size_y){
		axis_x = Math.round(Math.random(size_x) * size_x);
		axis_y = Math.round(Math.random(size_y) * size_y);
		if (axis_x == 0){axis_x++;};
		if (axis_y == 0){axis_y++;};
		var cords = axis_x + "_" + axis_y;
		if (Game.checkCords(cords)){
			return false;
		}else{
			return cords;	
		}
	},
	checkCords: function(cords){
		var index;
		for (index=0;index<Game.ship_fields.length;index++){
			if (Game.ship_fields[index] == cords){
				return true;
			}
		}
		return false;
	},
	removeShip: function(cords){
		var index;
		for (index=0;index<Game.ship_fields.length;index++){
			if (Game.ship_fields[index] == cords){
				Game.ship_fields.splice(index,1);
			}
		}
	},
	shots: 0,
	score: 0,
	hits: 0,
	miss: 0,
	ratio: 0,
	ships: function(a){
		return a.length;
	},
	game_table: "<table><tr><td colspan='4'>Ships to destroy:</td><td id='ships'></td></tr><tr><td>Shots:</td><td>Hits:</td><td>Miss:</td><td>Ratio:</td><td>Ships left:</td></tr><tr><td id='shots'></td><td id='hits'></td><td id='miss'></td><td id='ratio'></td><td id='ships_left'></td></tr></table>",
	place_scores: function(){
		Game.ratio = Game.hits*100/Game.shots;
		$('#shots').html(Game.shots);
		$('#hits').html(Game.hits);
		$('#miss').html(Game.miss);
		$('#ratio').html(Game.ratio+'%');
		$('#ships_left').html(Game.ships(Game.ship_fields));
	},
	logger:function(x,y,type){
		switch(type){
			case 1:
				$(Game.log_selector).attr('value','Strzał na x:'+x+" y:"+y+" rezultat Zatopiony!");
			break;
			case 0:
				$(Game.log_selector).attr('value','Strzał na x:'+x+" y:"+y+" rezultat Pudło!");
			break;	
		}
	},
	scale:function(x){
		var width = ((30+4)*x)+2;
		$(Game.pregame_field_selector).css('width',width);
	},
	initialize:function(x,y){
		$('#game_field').remove();
		$('score').children('table').remove();
		Game.x = x;
		Game.y = y;
		Game.generate_game_field(x,y);
		Game.scale(x);
		Game.addEvent();
		$(Game.game_score).html(Game.game_table);
		$('#ships').html(Game.ships(Game.ship_fields));	
	}
};
	
$(document).ready(function(){
	Game.initialize(2,2);
});