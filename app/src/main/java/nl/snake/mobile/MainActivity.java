package nl.snake.mobile;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.content.Context;
import android.graphics.*;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.view.MotionEvent;
import android.view.View;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.ArrayDeque;
import java.util.Random;

public class MainActivity extends Activity {
    Game game;
    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        game = new Game();
        setContentView(game);
    }
    @Override protected void onPause() { super.onPause(); if(game != null) game.pauseForBackground(); }
    @Override public void onBackPressed() { if(game.state == 0) super.onBackPressed(); else game.showMenu(); }

    class Game extends View {
        final int W=420, H=900, C=20, R=30;
        final float BX=20, BY=194, CELL=19;
        final int MENU=0,RUN=1,PAUSE=2,OVER=3;
        final int[] COLORS={0xff3deb85,0xff17caff,0xffc772ff};
        final int[] DARK={0xff0a1021,0xff0b2238,0xff14182b};
        final String[] MODES={"CLASSIC","DELUXE","PORTAL","MAZE","SPRINT"};
        final String[] DETAILS={"Pure Snake. Geen hulpmiddelen.","Bonussen, combo's en power-ups.","Ga door de randen heen.","Ontwijk de kristalrotsen.","90 seconden. Maximale score."};
        final Paint p=new Paint(3);
        final Random rnd=new Random();
        final ArrayList<Point> body=new ArrayList<>();
        final ArrayList<Point> rocks=new ArrayList<>();
        final ArrayList<Particle> sparks=new ArrayList<>();
        final ArrayDeque<Integer> queue=new ArrayDeque<>();
        final float[] starX=new float[80],starY=new float[80],starR=new float[80];
        Bitmap atlas;
        ToneGenerator sound;
        Vibrator vibrator;
        int state=MENU,mode=1,skin=0,direction=1,score=0,best=0,totalEaten=0,combo=0;
        int fruitX=13,fruitY=15,bonusX=-1,bonusY=-1,bonusType=-1;
        int livesSaved=0;
        boolean soundOn=true, vibrationOn=true,shield=false;
        float startX,startY,acc=0,elapsed=0,bonusLife=0,comboLife=0,starLife=0,slowLife=0,flash=0,noticeLife=0;
        float sprintTime=90;
        String notice="", endReason="GAME OVER";
        long previous=0;
        int pickupPulse=0;

        class Particle {
            float x,y,vx,vy,life,max; int color;
            Particle(float xx,float yy,int cc) {
                x=xx;y=yy;color=cc;
                vx=(rnd.nextFloat()-.5f)*145;vy=(rnd.nextFloat()-.5f)*145;
                max=life=.35f+rnd.nextFloat()*.45f;
            }
        }
        Game(){
            super(MainActivity.this);
            setLayerType(View.LAYER_TYPE_SOFTWARE,null);
            skin=getPreferences(0).getInt("snake_skin",0);
            soundOn=getPreferences(0).getBoolean("snake_sound",true);
            vibrationOn=getPreferences(0).getBoolean("snake_vibration",true);
            vibrator=(Vibrator)getSystemService(Context.VIBRATOR_SERVICE);
            try {sound=new ToneGenerator(AudioManager.STREAM_MUSIC,35);} catch(Exception ignored){}
            try(InputStream s=getAssets().open("sprites.png")){atlas=BitmapFactory.decodeStream(s);}catch(Exception ignored){}
            Random stars=new Random(1473);
            for(int i=0;i<starX.length;i++){starX[i]=stars.nextInt(W);starY[i]=stars.nextInt(H);starR[i]=.5f+stars.nextFloat()*1.2f;}
        }
        void pauseForBackground(){if(state==RUN){state=PAUSE;invalidate();}}
        void showMenu(){state=MENU;queue.clear();invalidate();}
        void start(int m){
            mode=m;best=getPreferences(0).getInt("best_mode_"+mode,0);
            score=0;totalEaten=0;combo=0;comboLife=0;noticeLife=0;elapsed=0;
            starLife=0;slowLife=0;flash=0;shield=false;bonusX=-1;bonusY=-1;bonusLife=0;
            sprintTime=90;state=RUN;direction=1;queue.clear();acc=0;
            body.clear(); for(int i=0;i<4;i++)body.add(new Point(8-i,15));
            rocks.clear();
            if(mode==3) {
                int[][] pos={{4,4},{5,4},{6,4},{13,4},{14,4},{15,4},
                  {4,10},{4,11},{4,12},{15,10},{15,11},{15,12},
                  {4,22},{5,22},{6,22},{13,22},{14,22},{15,22},
                  {9,6},{10,6},{9,25},{10,25}};
                for(int[] q:pos)rocks.add(new Point(q[0],q[1]));
            }
            spawnFood();previous=System.currentTimeMillis(); invalidate();
        }
        boolean used(int x,int y) {
            for(Point q:body)if(q.x==x&&q.y==y)return true;
            for(Point q:rocks)if(q.x==x&&q.y==y)return true;
            return fruitX==x&&fruitY==y;
        }
        Point freeCell(boolean excludeFruit){
            for(int k=0;k<2000;k++){
                int x=rnd.nextInt(C),y=rnd.nextInt(R);
                if(!used(x,y) && (bonusX!=x||bonusY!=y))return new Point(x,y);
            }
            for(int y=0;y<R;y++)for(int x=0;x<C;x++)if(!used(x,y))return new Point(x,y);
            return new Point(10,10);
        }
        void spawnFood(){
            fruitX=-1;fruitY=-1;
            Point q=freeCell(false);fruitX=q.x;fruitY=q.y;
        }
        void spawnBonus() {
            if(mode==0||bonusX>=0)return;
            Point q=freeCell(true);bonusX=q.x;bonusY=q.y;
            bonusType=rnd.nextInt(5);bonusLife=9f;
        }
        void effect(String s,int col,float x,float y){
            notice=s;noticeLife=1.25f;flash=.18f;
            for(int i=0;i<15;i++)sparks.add(new Particle(x,y,col));
            if(sparks.size()>100)sparks.subList(0,sparks.size()-100).clear();
            if(soundOn&&sound!=null)try{sound.startTone(ToneGenerator.TONE_PROP_BEEP,60);}catch(Exception ignored){}
            if(vibrationOn&&vibrator!=null)try{
                if(Build.VERSION.SDK_INT>=26)vibrator.vibrate(VibrationEffect.createOneShot(28,VibrationEffect.DEFAULT_AMPLITUDE));
                else vibrator.vibrate(28);
            }catch(Exception ignored){}
        }
        void turn(int d){
            int last=queue.isEmpty()?direction:queue.peekLast();
            if(d==last||((d+2)%4)==last||queue.size()>=2)return;
            queue.add(d);
        }
        float stepLength(){
            float base=mode==4?.123f:.185f;
            if(mode==0)base=.180f;
            if(mode==3)base=.176f;
            float speed=Math.min(.075f,totalEaten*.0024f);
            return Math.max(.079f,base-speed)*(slowLife>0?1.5f:1f);
        }
        void advance(){
            if(!queue.isEmpty())direction=queue.removeFirst();
            Point head=body.get(0);
            int x=head.x+(direction==1?1:direction==3?-1:0);
            int y=head.y+(direction==2?1:direction==0?-1:0);
            if(mode==2){x=(x+C)%C;y=(y+R)%R;}
            boolean wall=x<0||x>=C||y<0||y>=R;
            boolean ate=!wall&&x==fruitX&&y==fruitY;
            boolean hit=wall;
            if(!wall){
                for(Point q:rocks)if(q.x==x&&q.y==y){hit=true;break;}
                int check=body.size()-(ate?0:1);
                for(int i=0;i<check;i++)if(body.get(i).x==x&&body.get(i).y==y){hit=true;break;}
            }
            if(hit){
                if(shield){
                    shield=false;
                    body.clear();
                    for(int i=0;i<4;i++)body.add(new Point(8-i,15));
                    direction=1;queue.clear();
                    effect("SCHILD REDT JE!",0xfff8c14c,BX+10*CELL,BY+15*CELL);
                    return;
                }
                endReason="GAME OVER";finish();return;
            }
            body.add(0,new Point(x,y));
            if(ate){
                totalEaten++;combo=comboLife>0?Math.min(combo+1,5):1;
                comboLife=5.5f;
                int pts=10*combo*(starLife>0?2:1);
                score+=pts;
                if(score>best){best=score;getPreferences(0).edit().putInt("best_mode_"+mode,best).apply();}
                effect("+"+pts+(combo>1?" COMBO x"+combo:""),0xffff657b,BX+(x+.5f)*CELL,BY+(y+.5f)*CELL);
                spawnFood();
                if(totalEaten%4==0)spawnBonus();
            }else body.remove(body.size()-1);
            if(x==bonusX && y==bonusY){
                switch(bonusType){
                    case 0:score+=50;effect("+50 GOLD!",0xffffce59,BX+(x+.5f)*CELL,BY+(y+.5f)*CELL);break;
                    case 1:shield=true;effect("SCHILD ACTIEF!",0xffffce59,BX+(x+.5f)*CELL,BY+(y+.5f)*CELL);break;
                    case 2:starLife=8;effect("DUBBELE PUNTEN!",0xffd782ff,BX+(x+.5f)*CELL,BY+(y+.5f)*CELL);break;
                    case 3:slowLife=7;effect("SLOW MOTION!",0xff69e8ff,BX+(x+.5f)*CELL,BY+(y+.5f)*CELL);break;
                    default:score+=25;effect("KRISTAL +25!",0xff69e8ff,BX+(x+.5f)*CELL,BY+(y+.5f)*CELL);break;
                }
                if(score>best){best=score;getPreferences(0).edit().putInt("best_mode_"+mode,best).apply();}
                bonusX=-1;bonusY=-1;bonusLife=0;
            }
            if(body.size()==C*R-rocks.size()) {endReason="PERFECTE RUN!";finish();}
        }
        void finish(){
            if(state!=RUN)return;
            state=OVER;queue.clear();
            if(vibrationOn&&vibrator!=null)try{
                if(Build.VERSION.SDK_INT>=26)vibrator.vibrate(VibrationEffect.createOneShot(100,VibrationEffect.DEFAULT_AMPLITUDE));
                else vibrator.vibrate(100);
            }catch(Exception ignored){}
        }
        @Override protected void onDraw(Canvas real) {
            super.onDraw(real);
            long now=System.currentTimeMillis();
            float dt=previous==0?0:Math.min(.08f,(now-previous)/1000f);previous=now;
            float scale=Math.min(getWidth()/(float)W,getHeight()/(float)H);
            real.drawColor(0xff07101c);
            real.save();real.translate((getWidth()-W*scale)/2,(getHeight()-H*scale)/2);real.scale(scale,scale);
            Canvas c=real;
            background(c);
            if(state==RUN){
                elapsed+=dt;
                if(mode==4){sprintTime-=dt;if(sprintTime<=0){sprintTime=0;endReason="TIJD IS OP!";finish();}}
                comboLife=Math.max(0,comboLife-dt);starLife=Math.max(0,starLife-dt);
                slowLife=Math.max(0,slowLife-dt);flash=Math.max(0,flash-dt);
                noticeLife=Math.max(0,noticeLife-dt);
                if(bonusX>=0){bonusLife-=dt;if(bonusLife<=0){bonusX=-1;bonusY=-1;}}
                acc+=dt;
                int ticks=0;
                while(state==RUN&&acc>=stepLength()&&ticks++<4){acc-=stepLength();advance();}
                if(comboLife==0)combo=0;
            }
            for(int i=sparks.size()-1;i>=0;i--){
                Particle q=sparks.get(i);
                if(state==RUN){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;}
                if(q.life<=0){sparks.remove(i);continue;}
            }
            if(state==MENU)drawMenu(c);
            else{
                drawBoard(c);drawHUD(c);drawParticles(c);
                if(state==PAUSE)drawOverlay(c,"GEPAUZEERD","Even ontspannen.",false);
                if(state==OVER)drawOverlay(c,endReason,"Score "+score+"   •   Record "+best,true);
            }
            real.restore();
            postInvalidateDelayed(16);
        }
        void fill(Canvas c,int color,float x,float y,float w,float h,float radius){
            p.reset();p.setAntiAlias(true);p.setColor(color);c.drawRoundRect(x,y,x+w,y+h,radius,radius,p);
        }
        void outline(Canvas c,int color,float x,float y,float w,float h,float radius,float stroke){
            p.reset();p.setAntiAlias(true);p.setColor(color);p.setStyle(Paint.Style.STROKE);p.setStrokeWidth(stroke);
            c.drawRoundRect(x,y,x+w,y+h,radius,radius,p);p.setStyle(Paint.Style.FILL);
        }
        void txt(Canvas c,String s,float x,float y,int color,float size,boolean bold){
            p.reset();p.setAntiAlias(true);p.setColor(color);p.setTypeface(Typeface.create("sans-serif",bold?Typeface.BOLD:Typeface.NORMAL));
            p.setTextSize(size);c.drawText(s,x,y,p);
        }
        void centered(Canvas c,String s,float center,float y,int color,float size,boolean bold){
            p.reset();p.setAntiAlias(true);p.setTypeface(Typeface.create("sans-serif",bold?Typeface.BOLD:Typeface.NORMAL));
            p.setTextSize(size);float len=p.measureText(s);txt(c,s,center-len/2,y,color,size,bold);
        }
        void background(Canvas c){
            p.reset();p.setAntiAlias(true);
            p.setShader(new LinearGradient(0,0,400,H,new int[]{0xff050e20,0xff132143,0xff070d1c},null,Shader.TileMode.CLAMP));
            c.drawRect(0,0,W,H,p);p.setShader(null);
            float t=System.currentTimeMillis()*.0008f;
            for(int i=0;i<starX.length;i++){
                p.setColor((int)(65+40*(1+Math.sin(t+i)))*0x1000000 | 0x00a5c8ee);
                c.drawCircle(starX[i],starY[i],starR[i],p);
            }
            p.setColor(0x1616bfff);p.setStrokeWidth(1);
            for(int x=0;x<=W;x+=35)c.drawLine(x,0,x,H,p);
            for(int y=0;y<=H;y+=35)c.drawLine(0,y,W,y,p);
        }
        void drawSprite(Canvas c,int index,float x,float y,float s,float degrees){
            if(atlas==null){p.reset();p.setAntiAlias(true);p.setColor(COLORS[skin]);c.drawCircle(x+s/2,y+s/2,s*.42f,p);return;}
            int cw=atlas.getWidth()/4,ch=atlas.getHeight()/4;
            Rect src=new Rect((index%4)*cw,(index/4)*ch,((index%4)+1)*cw,((index/4)+1)*ch);
            p.reset();p.setAntiAlias(true);p.setFilterBitmap(true);p.setAlpha(255);
            c.save();c.rotate(degrees,x+s/2,y+s/2);
            c.drawBitmap(atlas,src,new RectF(x,y,x+s,y+s),p);c.restore();
        }
        void drawMenu(Canvas c){
            centered(c,"NEON",W/2,107,0xff86f9e1,62,true);
            centered(c,"SNAKE",W/2,158,0xffffffff,65,true);
            centered(c,"DELUXE EDITION",W/2,185,0xffaabfd8,13,true);
            for(int i=0;i<11;i++) {
                float a=i*.46f;
                float x=210+(i-5)*22,y=250+(float)Math.sin(a)*23;
                drawSprite(c,skin==0?1:skin==1?5:7,x-14,y-14,28,0);
            }
            drawSprite(c,skin==0?0:skin==1?4:6,315,213,56,0);
            centered(c,"KIES JE SPELMODUS",W/2,321,0xffb7cae8,15,true);
            for(int i=0;i<5;i++){
                float y=339+i*70;
                fill(c,i==1?0xff193f52:0xff16243a,24,y,372,62,17);
                outline(c,i==1?0xff41e8ac:0xff40546f,24,y,372,62,17,i==1?2:1);
                fill(c,i==1?0xff38dca8:0xff396086,34,y+13,38,36,11);
                centered(c,new String[]{"C","D","P","M","S"}[i],53,y+38,0xff08172d,22,true);
                txt(c,MODES[i],86,y+26,0xfff1fcff,19,true);
                txt(c,DETAILS[i],86,y+46,0xffa9bdd4,11,false);
                txt(c,"›",360,y+41,0xffd8ebff,27,true);
            }
            centered(c,"KIES JE SLANG",W/2,716,0xffadbedc,14,true);
            for(int i=0;i<3;i++){
                float x=104+i*73;
                fill(c,skin==i?0xff274a54:0xff14243a,x-28,728,56,56,14);
                outline(c,skin==i?0xff6bf4c5:0xff2c4f6c,x-28,728,56,56,14,skin==i?2.5f:1);
                drawSprite(c,i==0?0:i==1?4:6,x-23,733,46,0);
            }
            centered(c,"GEEN ADVERTENTIES  •  OFFLINE",W/2,819,0xff84a1bd,12,true);
            fill(c,0xff20364c,40,834,340,40,14);
            centered(c,"GELUID "+(soundOn?"AAN":"UIT")+"   •   TRILLEN "+(vibrationOn?"AAN":"UIT"),W/2,859,0xffd4e8f3,14,true);
        }
        void drawBoard(Canvas c){
            fill(c,0xff101f35,BX-4,BY-4,388,578,13);
            outline(c,0xff3a6a83,BX-4,BY-4,388,578,13,2);
            p.reset();p.setAntiAlias(true);p.setColor(0xff132841);
            c.drawRect(BX,BY,BX+C*CELL,BY+R*CELL,p);
            p.setColor(0x264b7d9f);p.setStrokeWidth(.7f);
            for(int x=1;x<C;x++)c.drawLine(BX+x*CELL,BY,BX+x*CELL,BY+R*CELL,p);
            for(int y=1;y<R;y++)c.drawLine(BX,BY+y*CELL,BX+C*CELL,BY+y*CELL,p);
            for(Point q:rocks)drawSprite(c,14,BX+q.x*CELL-3,BY+q.y*CELL-3,CELL+6,0);
            drawSprite(c,8,BX+fruitX*CELL-4,BY+fruitY*CELL-4,CELL+8,0);
            if(bonusX>=0){int[] ids={9,12,11,13,10};float sc=1f+(float)Math.sin(System.currentTimeMillis()/180.0)*.13f;
                float bs=CELL+11;float x=BX+(bonusX+.5f)*CELL-bs*sc/2,y=BY+(bonusY+.5f)*CELL-bs*sc/2;
                drawSprite(c,ids[bonusType],x,y,bs*sc,0);
            }
            int n=body.size();
            for(int i=n-1;i>=0;i--){
                Point q=body.get(i);float x=BX+q.x*CELL,y=BY+q.y*CELL;
                if(i<n-1){
                    Point ahead=body.get(i+1);
                    int ax=Math.abs(ahead.x-q.x),ay=Math.abs(ahead.y-q.y);
                    if(ax+ay==1){
                        p.reset();p.setAntiAlias(true);p.setColor(COLORS[skin]);
                        c.drawLine(x+CELL/2,y+CELL/2,BX+(ahead.x+.5f)*CELL,BY+(ahead.y+.5f)*CELL,p);
                    }
                }
                if(i==0) {
                    float deg=direction==0?-90:direction==1?0:direction==2?90:180;
                    drawSprite(c,skin==0?0:skin==1?4:6,x-5,y-5,CELL+10,deg);
                    if(shield){p.reset();p.setAntiAlias(true);p.setStyle(Paint.Style.STROKE);p.setStrokeWidth(3);p.setColor(0xffffd36c);
                        c.drawCircle(x+CELL/2,y+CELL/2,CELL*.76f,p);p.setStyle(Paint.Style.FILL);}
                }else if(i==n-1 && skin==0){
                    Point prev=body.get(i-1);
                    float deg=(q.x>prev.x)?0:(q.x<prev.x)?180:(q.y<prev.y)?-90:90;
                    drawSprite(c,3,x-3,y-3,CELL+6,deg);
                } else drawSprite(c,skin==0?1:skin==1?5:7,x-3,y-3,CELL+6,0);
            }
            if(flash>0) {
                p.reset();p.setColor((int)(flash*240)*0x1000000 | 0x00ffffff);
                c.drawRect(BX,BY,BX+C*CELL,BY+R*CELL,p);
            }
        }
        void drawHUD(Canvas c){
            txt(c,"NEON SNAKE",20,46,0xff86f9e1,30,true);
            txt(c,MODES[mode],22,73,0xff8daec5,13,true);
            fill(c,0xff1a3550,333,16,67,66,16);
            txt(c,"Ⅱ",351,61,0xffffffff,35,true);
            fill(c,0xff172b43,20,93,183,75,15);
            fill(c,0xff172b43,216,93,184,75,15);
            txt(c,"SCORE",34,117,0xff8baec4,12,true);
            txt(c,""+score,34,151,0xffffffff,29,true);
            txt(c,mode==4?"TIJD OVER":"RECORD",229,117,0xff8baec4,12,true);
            txt(c,mode==4?String.format(java.util.Locale.US,"%02d:%02d",(int)sprintTime/60,(int)sprintTime%60):""+best,229,151,0xffffffff,29,true);
            if(mode==2)centered(c,"PORTAL: RANDEN VERBONDEN",210,783,0xff8ddcfd,12,true);
            else centered(c,"SWIPE OM TE STUREN",210,784,0xffa5c1df,14,true);
            String info="";
            if(shield)info+="  SCHILD ✓ ";
            if(starLife>0)info+="  x2 "+(int)Math.ceil(starLife)+"s ";
            if(slowLife>0)info+="  SLOW "+(int)Math.ceil(slowLife)+"s ";
            if(combo>1)info+="  COMBO x"+combo;
            if(info.isEmpty())info="PAUZE VIA DE KNOP RECHTSBOVEN";
            centered(c,info,210,814,0xff73eac2,12,true);
            fill(c,0xff1b344c,24,839,372,38,14);
            centered(c,"● EET APPELS  •  ONTWIJK JE STAART",210,864,0xffadcee7,12,true);
            if(noticeLife>0){
                fill(c,0xb9091526,63,190,294,40,14);
                centered(c,notice,210,217,0xfff9db88,20,true);
            }
        }
        void drawParticles(Canvas c){
            for(Particle q:sparks){
                p.reset();p.setAntiAlias(true);p.setColor(q.color);
                p.setAlpha((int)(255*q.life/q.max));
                c.drawCircle(q.x,q.y,2.5f+3*q.life/q.max,p);
            }
        }
        void button(Canvas c,String label,float y,int color){
            fill(c,color,66,y,288,59,18);
            outline(c,0x8861e6ee,66,y,288,59,18,1.5f);
            centered(c,label,210,y+39,0xff09172b,22,true);
        }
        void drawOverlay(Canvas c,String title,String sub,boolean over){
            fill(c,0xe6071324,20,194,380,570,14);
            drawSprite(c,over?8:12,162,277,96,0);
            centered(c,title,210,410,0xffffffff,34,true);
            centered(c,sub,210,451,0xff9fc6db,17,true);
            if(over)centered(c,"APPELS GEGETEN  "+totalEaten,210,483,0xff73eac2,15,true);
            button(c,over?"OPNIEUW SPELEN":"VERDER SPELEN",530,0xff79ecc1);
            button(c,"HOOFDMENU",606,0xff7dd4fc);
        }
        @Override public boolean onTouchEvent(MotionEvent e){
            float s=Math.min(getWidth()/(float)W,getHeight()/(float)H);
            float x=(e.getX()-(getWidth()-W*s)/2)/s;
            float y=(e.getY()-(getHeight()-H*s)/2)/s;
            if(e.getAction()==MotionEvent.ACTION_DOWN){startX=x;startY=y;return true;}
            if(e.getAction()==MotionEvent.ACTION_UP){
                if(state==MENU){
                    if(y>=339 && y<339+5*70 && x>=20 && x<=400){
                        int m=(int)((y-339)/70);if(y<339+m*70+62)start(m);
                    }else if(y>=725 && y<=793){
                        int sel=Math.round((x-104)/73);if(sel>=0&&sel<3){skin=sel;getPreferences(0).edit().putInt("snake_skin",skin).apply();}
                    }else if(y>=833 && y<=878){
                        if(x<210){soundOn=!soundOn;getPreferences(0).edit().putBoolean("snake_sound",soundOn).apply();}
                        else{vibrationOn=!vibrationOn;getPreferences(0).edit().putBoolean("snake_vibration",vibrationOn).apply();}
                    }
                }else if(state==RUN){
                    if(startY<95&&startX>320){state=PAUSE;}
                    else {
                        float dx=x-startX,dy=y-startY;
                        if(Math.max(Math.abs(dx),Math.abs(dy))>22){
                            turn(Math.abs(dx)>Math.abs(dy)?(dx>0?1:3):(dy>0?2:0));
                        }
                    }
                }else if(state==PAUSE||state==OVER){
                    if(x>=55&&x<=365&&y>=530&&y<=590){
                        if(state==PAUSE){state=RUN;acc=0;previous=System.currentTimeMillis();}
                        else start(mode);
                    }else if(x>=55&&x<=365&&y>=604&&y<=669)showMenu();
                }
                invalidate();return true;
            }
            return true;
        }
    }
}