package nl.snake.mobile;
import android.app.*;import android.os.*;import android.view.*;import android.graphics.*;import java.util.*;
public class MainActivity extends Activity {
 public void onCreate(Bundle b){super.onCreate(b);getWindow().getDecorView().setSystemUiVisibility(5894|1024|512);setContentView(new Game());}
 class Game extends View {
  Paint p=new Paint(3); ArrayList<Point> snake=new ArrayList<>(); Random random=new Random(); Point food; int dx=1,dy=0,score=0,best; boolean dead=false; long last=0; float sx,sy; final int cols=20,rows=30;
  Game(){super(MainActivity.this);best=getPreferences(0).getInt("best",0);reset();}
  void reset(){snake.clear();snake.add(new Point(8,15));snake.add(new Point(7,15));snake.add(new Point(6,15));dx=1;dy=0;score=0;dead=false;spawn();last=System.currentTimeMillis();}
  void spawn(){do{food=new Point(random.nextInt(cols),random.nextInt(rows));}while(snake.contains(food));}
  void tick(){Point h=snake.get(0);int x=h.x+dx,y=h.y+dy;if(x<0||x>=cols||y<0||y>=rows){dead=true;return;}boolean eat=x==food.x&&y==food.y;for(int i=0;i<snake.size()-(eat?0:1);i++){Point q=snake.get(i);if(q.x==x&&q.y==y){dead=true;return;}}snake.add(0,new Point(x,y));if(eat){score+=10;if(score>best){best=score;getPreferences(0).edit().putInt("best",best).apply();}spawn();}else snake.remove(snake.size()-1);}
  protected void onDraw(Canvas c){super.onDraw(c);int w=getWidth(),h=getHeight();c.drawColor(Color.rgb(10,17,29));float cell=Math.min(w/(float)cols,(h-180f)/rows),ox=(w-cell*cols)/2,oy=115; p.setTypeface(Typeface.create("sans-serif",Typeface.BOLD));p.setColor(Color.WHITE);p.setTextSize(42);c.drawText("SNAKE",25,55,p);p.setTextSize(25);c.drawText("Score: "+score+"    Best: "+best,25,91,p);
  p.setColor(Color.rgb(20,35,49));c.drawRoundRect(ox-3,oy-3,ox+cols*cell+3,oy+rows*cell+3,12,12,p);
  for(int i=0;i<snake.size();i++){Point q=snake.get(i);p.setColor(i==0?Color.rgb(122,255,158):Color.rgb(34,198,116));c.drawRoundRect(ox+q.x*cell+2,oy+q.y*cell+2,ox+(q.x+1)*cell-2,oy+(q.y+1)*cell-2,cell*.25f,cell*.25f,p);}
  p.setColor(Color.rgb(255,83,100));c.drawCircle(ox+(food.x+.5f)*cell,oy+(food.y+.5f)*cell,cell*.37f,p);
  p.setColor(Color.LTGRAY);p.setTextSize(21);c.drawText("Swipe om te sturen",25,h-30,p);
  if(dead){p.setColor(0xDD000000);c.drawRect(0,oy,w,oy+rows*cell,p);p.setColor(Color.WHITE);p.setTextSize(42);c.drawText("GAME OVER",w/2f-145,oy+rows*cell/2,p);p.setTextSize(23);c.drawText("Tik om opnieuw te spelen",w/2f-135,oy+rows*cell/2+45,p);}
  if(!dead&&System.currentTimeMillis()-last>Math.max(75,165-score/15)){tick();last=System.currentTimeMillis();}postInvalidateDelayed(25);}
  public boolean onTouchEvent(android.view.MotionEvent e){if(e.getAction()==0){sx=e.getX();sy=e.getY();return true;}if(e.getAction()==1){if(dead){reset();invalidate();return true;}float x=e.getX()-sx,y=e.getY()-sy;if(Math.max(Math.abs(x),Math.abs(y))<25)return true;if(Math.abs(x)>Math.abs(y)){if(x>0&&dx!= -1){dx=1;dy=0;}else if(x<0&&dx!=1){dx=-1;dy=0;}}else{if(y>0&&dy!= -1){dx=0;dy=1;}else if(y<0&&dy!=1){dx=0;dy=-1;}}return true;}return true;}
 }
}