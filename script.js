//set encoding=utf-8

window.onload = function(){
    ///////////////////////////
    //変数
    ///////////////////////////
	var i = 0;         //インデックスとか用
	var VARMAX = 999999;//とりあえず大きい数
	var rand = 0;      //ランダム値保持用
    
    var mouseX = 0, mouseY = 0;//マウス座標
    
    var timer;              //タイマー用変数
    var fps = 30;
    var delay = 1000/fps;         //fps制御
    var click_mouse = 0;
    var animetime = 0;
  
	var img_bg = new Image();
	img_bg.src = "imgs_fish/background.png"

    var img_pc_l = [];
    img_pc_l[0] = new Image();
    img_pc_l[0].src = "imgs_fish/l.png";
    img_pc_l[1] = new Image();
    img_pc_l[1].src = "imgs_fish/l.png";
    
    var img_pc_r = [];
    img_pc_r[0] = new Image();
    img_pc_r[0].src = "imgs_fish/r.png";
    img_pc_r[1] = new Image();
    img_pc_r[1].src = "imgs_fish/r.png";
    
    var img_pc_death = [];
    img_pc_death[0] = new Image();
    img_pc_death[0].src = "imgs_fish/dead.png";
    img_pc_death[1] = new Image();
    img_pc_death[1].src = "imgs_fish/dead2.png";
    
    var img_size = {x:162,y:95};//画像サイズ
    var img_size_death = {x:162,y:95};//画像サイズ
    var LEFT = 0;       //キャラの向き
    var RIGHT = 1;

    var S_CHARA = 10;        //初期キャラ数
    var MAX_CHARA = 100;     //キャラ数上限
    
    var par = {x:5,y:6};    //移動速度
	var trace = 30;         //追跡速度
    var move_time = {x:0,y:0};//一定方向への移動時間
    
	var X_SIZE = 1250; //キャンバスXサイズ
	var Y_SIZE = 800;  //キャンバスYサイズ
    
    var kill = 0;
    
    var DEATH = -1;
    var ACTIVE = 1;
	
	var flag_near = 0; //接近フラグ
	
    //htmlから呼んで表示するメインキャンバスを用意
    var canvas = document.getElementById("can");
    if(!canvas || !canvas.getContext) return false;
    var ctx = canvas.getContext("2d");

    //プリレンダ用のキャンバス用意
    var pre_canvas = document.createElement('canvas');
	pre_canvas.width = X_SIZE;
	pre_canvas.height = Y_SIZE;
	var pre_ctx = pre_canvas.getContext("2d")
    pre_ctx.fillStyle = "#000000";
	pre_ctx.font = "30px 'MSPゴシック'";
    
    //キャラ構造体定義
	var Chara = function(){
        this.state = ACTIVE;
		this.x = 0;
		this.y = 0;
		this.muki = 0;
		this.m_time = 0;
		this.moving = 0;
		this.rate = (Math.random()+0.2)/1.5;
		this.size_y = this.rate * img_size.y;
        this.anime = 0;
        this.animetime= Math.random() * 100;
        this.fallspeed = 0;
        this.name = "fish";
        this.no = Math.round(Math.random()*20);
	};

    //インスタンス化
	var chara = [];
	for(i=0;i<S_CHARA;i++){
		chara[i] = new Chara();
		chara[i].x = Math.random() * (X_SIZE-(img_size.x * chara[i].rate)); 
        chara[i].y = Math.random() * (Y_SIZE-(img_size.y * chara[i].rate)); 
        //chara[i].state = ACTIVE;
    }
    
    
    /////////////////////////////////
    //マウスイベント登録
    /////////////////////////////////
    //マウス動いたら座標取得  
    canvas.addEventListener("mousemove",function(e){
        var rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - rect.left - 20;
        mouseY = e.clientY -rect.top - 20;
    },false);
	var on_mouse = 0;

    //マウスがキャンバス上にあるか無いか
    canvas.addEventListener("mouseover",function(e){
		on_mouse = 1;
	}, false);
    canvas.addEventListener("mouseout",function(e){
		on_mouse = 0;
	}, false);
    
    canvas.addEventListener("click",function(e){
		click_mouse = 1;
	}, false);
    ///////////////////////////
    //関数
    ///////////////////////////
    
    function random_move(){
        if(chara[i].m_time == 0){
            rand = Math.random();
            if(rand < 0.2){
                chara[i].moving = par.x * chara[i].rate;
				chara[i].muki = RIGHT;
				chara[i].m_time = (Math.random()+6) * 5;
            }
			else if(rand > 0.8){
	       		chara[i].moving = -1 * par.x * chara[i].rate;
				chara[i].muki = LEFT;
				chara[i].m_time = (Math.random()+6) * 5;
			}
			else{
	       		chara[i].moving = 0;
				chara[i].m_time = (Math.random()+3) * 2;
			}
        }
		rand = Math.random();
		if(rand < 0.333){
	    	chara[i].y = chara[i].y + (par.y * chara[i].rate);
		}
		else if(rand > 0.666){
	     	chara[i].y = chara[i].y - (par.y * chara[i].rate);
		}
		chara[i].x += chara[i].moving;
    }
    
    function trace_move(){
        //マウスポインタがキャンバス上にあるときはポインタ座標をキャラが追跡
        if(on_mouse == 1 && (Math.sqrt(Math.pow(chara[i].x+(img_size.x * chara[i].rate /2)-mouseX,2)+Math.pow(chara[i].y+(img_size.y * chara[i].rate /2)-mouseY,2)) > 80)){
            chara[i].moving = 0;
			chara[i].m_time = 0;
			chara[i].x -= ((chara[i].x-mouseX) / (Math.abs(chara[i].x-mouseX) + Math.abs(chara[i].y-mouseY)) * trace) * chara[i].rate;
			chara[i].y -= ((chara[i].y-mouseY) / (Math.abs(chara[i].x-mouseX) + Math.abs(chara[i].y-mouseY)) * trace) * chara[i].rate;
        }
		else{
			flag_near = 1;
		}
    }
    
    function fall(){
            chara[i].y += chara[i].fallspeed;
            chara[i].fallspeed += 9.8;
    }
    
    function hamidashi_hosei(size_x, size_y){
        //はみだし補正
		if(chara[i].x < 0){
	       chara[i].m_time = 0;
	       chara[i].x=0;
		}
        if(chara[i].x > X_SIZE-(size_x * chara[i].rate)){
            chara[i].m_time = 0;
            chara[i].x=X_SIZE-(size_x * chara[i].rate);
        }

		if(chara[i].y < 0)
            chara[i].y=0;
		if(chara[i].y > Y_SIZE-(size_y * chara[i].rate))
			chara[i].y=Y_SIZE-(size_y * chara[i].rate);
        
        
        
        if(chara[i].m_time > 0)
            chara[i].m_time -= 1;
        else{
            chara[i].moving = 0;
            chara[i].m_time = 0;
        }
    }
    
    function birth(){
        if(Math.random()<0.0005 * S_CHARA * S_CHARA && S_CHARA < MAX_CHARA){
	 		S_CHARA++;
            chara[S_CHARA-1] = new Chara();
	 		chara[S_CHARA-1].x = chara[S_CHARA-2].x; 
	 		chara[S_CHARA-1].y = chara[S_CHARA-2].y; 
            chara[S_CHARA-1].state = ACTIVE;
		}
    }
    
    function print_chara(){
        var min;
		var pre_min = -1;
        var pre_tmp = VARMAX;
		var tmp = VARMAX;
		var u_edge;
    
        //プリキャンバスをクリア
        pre_ctx.clearRect(0,0,X_SIZE,Y_SIZE);
		
    	pre_ctx.drawImage(img_bg, 0, 0, X_SIZE, Y_SIZE);

        //奥(y座標が小さい方)から順に描写(本当はソートしたい)
		for(var m=0; m<S_CHARA; m++){
			min = VARMAX;
			for(i=0; i<S_CHARA; i++){
				u_edge = chara[i].y + chara[i].size_y
				if((min >= u_edge && pre_min < u_edge) ||
                  pre_min == u_edge && pre_tmp > i){
				    min = u_edge;
                    tmp = i;
				}
			}
    	    draw(chara[tmp].x,chara[tmp].y, chara[tmp].muki, chara[tmp].rate, chara[tmp].anime, chara[tmp].state);
            pre_ctx.textAlign = "center";
            pre_ctx.font = "15px 'Arial'";
            pre_ctx.fillText(chara[tmp].name +" "+ chara[tmp].no,chara[tmp].x+(img_size.x * chara[tmp].rate /2),chara[tmp].y-3);
            pre_tmp = tmp;
			pre_min = min;
		}
        
        //キャラ数を描写
        pre_ctx.fillText("fish : " + S_CHARA,30,30);
        pre_ctx.fillText("kill  : " + kill,30,60);
    }
    
    function draw(x,y,muki,rate,anime,state){
        if(state == ACTIVE){
		if(muki == LEFT)
	        pre_ctx.drawImage(img_pc_l[anime], Math.round(x), Math.round(y), img_size.x*rate, img_size.y*rate);
		else
	        pre_ctx.drawImage(img_pc_r[anime], Math.round(x), Math.round(y), img_size.x*rate, img_size.y*rate);
        }
        else if(state == DEATH){
	        pre_ctx.drawImage(img_pc_death[anime], Math.round(x), Math.round(y), img_size_death.x*rate, img_size_death.y*rate);
        }
    }
    
    function print_canvas(){
        //メインキャンバスをクリア
        ctx.clearRect(0,0,X_SIZE,Y_SIZE);
		//プリレンダしたものをメインキャンバスに出力
        ctx.drawImage(pre_canvas,0,0);
    }
    function click_kill(){
        for(i=0;i<S_CHARA;i++){
            if(chara[i].state == ACTIVE && Math.sqrt(Math.pow(chara[i].x+(img_size.x * chara[i].rate /2)-mouseX,2)
                +Math.pow(chara[i].y+(img_size.y * chara[i].rate/2)-mouseY,2)) < 70){
                chara[i].state=DEATH;
                chara[i].fallspeed=0;
                kill++;
            }
        }
        click_mouse = 0;
    }
    
    function animation(){
            chara[i].animetime++;
            if(chara[i].state==ACTIVE){
                if(chara[i].animetime < 3)
                    chara[i].anime=0;
                else if(chara[i].animetime < 6)
                    chara[i].anime=1;
                else
                    chara[i].animetime = 0;
            }
            else if(chara[i].state==DEATH){
                if(chara[i].animetime < 79)
                    chara[i].anime=0;
                else if(chara[i].animetime < 80)
                    chara[i].anime=1;
                else if(chara[i].animetime < 81)
                    chara[i].anime=0;
                else if(chara[i].animetime < 82)
                    chara[i].anime=1;
                else
                    chara[i].animetime = 0;
            }
        
    }
    
    ///////////////////////////
    //メインループ
    ///////////////////////////
    var loop = function(){
	
		MAX_CHARA=document.getElementById("num1").value;

		if(MAX_CHARA<1){
			MAX_CHARA=1;
	        document.getElementById("num1").value=1;
		}
		if(MAX_CHARA>200){
			//MAX_CHARA=200;
	        //document.getElementById("num1").value=200;
		}

		if(S_CHARA>MAX_CHARA)
			S_CHARA=MAX_CHARA;

        //キャラ増殖処理
        birth(); 

        //クリック時処理
        if(click_mouse == 1){
            click_kill();
        }        
        
		flag_near = 0;
        //キャラごとの処理
    	for(i=0;i<S_CHARA;i++){
            if(chara[i].state == DEATH && Math.random() < 0.001)
                chara[i].state *= -1;
            
            //生きてるキャラ処理
            if(chara[i].state == ACTIVE){
                //ランダム移動
                random_move();
                //追跡移動
                trace_move();
            //はみだし補正,キャラ座標がキャンバスからはみ出たら補正する
            hamidashi_hosei(img_size.x, img_size.y);
            }
            //死んでるキャラ処理
            else if(chara[i].state == DEATH){
                fall();   
                hamidashi_hosei(img_size_death.x, img_size_death.y);
            }
            //はみだし補正,キャラ座標がキャンバスからはみ出たら補正する
            hamidashi_hosei();
            animation();
		}

        //キャラをプリキャンバスに描写(プリレンダ処理)
        print_chara(); 
        //メインキャンバス処理
        print_canvas();
        
        //タイマー処理
        clearTimeout(timer);
        timer = setTimeout(loop,delay);
    }
    loop();
}
