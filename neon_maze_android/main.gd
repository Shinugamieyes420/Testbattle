extends Node2D

const BG=Color("#050914")
const WALL=Color("#26356f")
const CYAN=Color("#4df4ff")
const YELLOW=Color("#ffe66d")
const PINK=Color("#ff4fd8")
const RED=Color("#ff5277")
const GREEN=Color("#51ff9d")
const PURPLE=Color("#b66cff")
const WHITE=Color("#f7f8ff")
const MUTED=Color("#aeb8df")
const DIRS=[Vector2.LEFT,Vector2.RIGHT,Vector2.UP,Vector2.DOWN]
const MAPS=[
"#####################\n#P....#.......#....1#\n#.###.#.#####.#.###.#\n#o#...#...#...#...#o#\n#.#.#####.#.#####.#.#\n#.....#...2...#.....#\n###.#.#.#####.#.#.###\n#...#...#...#...#...#\n#.#####.#.#.#####.#.#\n#.....#...#...#.....#\n#.#.#.#####.#####.#.#\n#o#.#...3.....#...#o#\n#.###.#.#####.#.###.#\n#4....#.......#.....#\n#####################",
"#####################\n#P....#.....#.....1o#\n#.##.#.#.###.#.#.##.#\n#....#.#...#.#.#....#\n###.##.###.#.###.##.#\n#o..#.....2.....#..o#\n#.#.###.#####.###.#.#\n#.#.....#...#.....#.#\n#.#####.#.#.#####.#.#\n#.....#...#...#.....#\n###.#.###.#.###.#.###\n#o..#.....3.....#..o#\n#.##.###.###.###.##.#\n#4......#.....#.....#\n#####################"
]

var grid=[]
var rows=0
var cols=0
var tile=32.0
var origin=Vector2.ZERO
var player={}
var ghosts=[]
var pellets=0
var level=1
var score=0
var lives=3
var highscore=0
var mode="classic"
var state="menu"
var paused=false
var countdown=0.0
var time_left=120.0
var power_time=0.0
var ghost_combo=0
var inventory=""
var shield=false
var speed_time=0.0
var magnet_time=0.0
var chaos_time=8.0
var streak=0
var streak_time=0.0
var fruit=[]
var powerups=[]
var popups=[]
var joy_center=Vector2.ZERO
var joy_radius=100.0
var joy_knob=Vector2.ZERO
var joy_id=-1
var power_center=Vector2.ZERO
var power_radius=82.0
var rng=RandomNumberGenerator.new()
var font:Font

func _ready():
 rng.randomize()
 font=ThemeDB.fallback_font
 DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
 _load_save()
 get_viewport().size_changed.connect(_layout)
 _layout()
 queue_redraw()

func _layout():
 var s=get_viewport_rect().size
 joy_radius=clamp(s.y*0.12,76.0,112.0)
 joy_center=Vector2(max(joy_radius+28.0,s.x*0.10),s.y-joy_radius-24.0)
 power_radius=clamp(s.y*0.09,64.0,92.0)
 power_center=Vector2(s.x-max(power_radius+28.0,s.x*0.09),s.y-power_radius-28.0)
 if cols>0:
  var top=82.0
  var bottom=max(joy_radius*2.15,170.0)
  tile=floor(min((s.x-70.0)/cols,(s.y-top-bottom)/rows))
  tile=max(tile,18.0)
  origin=Vector2((s.x-cols*tile)/2.0,top+(s.y-top-bottom-rows*tile)/2.0)
 queue_redraw()

func _process(delta):
 if state=="play" and not paused:
  _update_game(delta)
 for p in popups:
  p.life-=delta
  p.off-=25.0*delta
 popups=popups.filter(func(p): return p.life>0.0)
 for f in fruit: f.life-=delta
 fruit=fruit.filter(func(f): return f.life>0.0)
 for p in powerups: p.life-=delta
 powerups=powerups.filter(func(p): return p.life>0.0)
 queue_redraw()

func _input(e):
 if e is InputEventKey and e.pressed and not e.echo:
  if e.keycode in [KEY_W,KEY_UP]: _set_dir(Vector2.UP)
  elif e.keycode in [KEY_S,KEY_DOWN]: _set_dir(Vector2.DOWN)
  elif e.keycode in [KEY_A,KEY_LEFT]: _set_dir(Vector2.LEFT)
  elif e.keycode in [KEY_D,KEY_RIGHT]: _set_dir(Vector2.RIGHT)
  elif e.keycode==KEY_SPACE: _use_power()
  elif e.keycode in [KEY_P,KEY_ESCAPE]:
   if state=="play": paused=!paused
 if e is InputEventScreenTouch:
  if e.pressed: _touch_down(e.index,e.position)
  else: _touch_up(e.index)
 elif e is InputEventScreenDrag and e.index==joy_id:
  _update_joy(e.position)

func _touch_down(id,pos):
 if state=="menu":
  var s=get_viewport_rect().size
  for i in range(3):
   var r=Rect2(Vector2(s.x*0.5-260,s.y*0.38+i*92),Vector2(520,72))
   if r.has_point(pos):
    _start(["classic","time","chaos"][i]); return
  return
 if state=="end":
  _start(mode); return
 if paused:
  paused=false; return
 if pos.distance_to(joy_center)<joy_radius*1.5:
  joy_id=id; _update_joy(pos); Input.vibrate_handheld(6)
 elif pos.distance_to(power_center)<power_radius*1.4:
  _use_power()

func _touch_up(id):
 if id==joy_id:
  joy_id=-1; joy_knob=Vector2.ZERO

func _update_joy(pos):
 var raw=pos-joy_center
 if raw.length()<joy_radius*0.14:
  joy_knob=Vector2.ZERO; return
 joy_knob=raw.normalized()*min(raw.length(),joy_radius*0.56)
 if abs(raw.x)>abs(raw.y)*1.08: _set_dir(Vector2.RIGHT if raw.x>0 else Vector2.LEFT)
 elif abs(raw.y)>abs(raw.x)*1.08: _set_dir(Vector2.DOWN if raw.y>0 else Vector2.UP)

func _start(m):
 mode=m; state="play"; paused=false; level=1; score=0; lives=3; time_left=120.0
 inventory=""; shield=false; speed_time=0.0; magnet_time=0.0; power_time=0.0; streak=0; streak_time=0.0; chaos_time=7.0
 _load_level(0); countdown=3.0; Input.vibrate_handheld(15)

func _load_level(idx):
 grid=[]; ghosts=[]; pellets=0
 var lines=MAPS[idx%MAPS.size()].split("\n")
 rows=lines.size(); cols=lines[0].length()
 for y in range(rows):
  var row=[]
  for x in range(cols):
   var c=lines[y].substr(x,1)
   if c=="P": player=_actor(Vector2(x+.5,y+.5),Vector2.RIGHT,7.5); c="."
   elif c in ["1","2","3","4"]:
    var gi=int(c)-1
    var g=_actor(Vector2(x+.5,y+.5),DIRS[rng.randi_range(0,3)],5.1+gi*.08)
    g.type=["hunter","ambusher","drifter","guard"][gi]
    g.color=[RED,PURPLE,GREEN,YELLOW][gi]
    g.home=g.pos
    ghosts.append(g); c="."
   if c in [".","o"]: pellets+=1
   row.append(c)
  grid.append(row)
 _layout()
 player.speed=7.4+min(2.0,level*.16)
 for i in range(ghosts.size()): ghosts[i].speed=5.0+level*.24+i*.08+(0.5 if mode=="chaos" else 0.0)

func _actor(pos,dir,spd): return {"pos":pos,"dir":dir,"queued":dir,"speed":spd,"mouth":0.0,"type":"","color":RED,"home":pos}

func _update_game(d):
 if countdown>0.0: countdown-=d; return
 if mode=="time":
  time_left-=d
  if time_left<=0: _finish(); return
 power_time=max(0.0,power_time-d); speed_time=max(0.0,speed_time-d); magnet_time=max(0.0,magnet_time-d); streak_time-=d
 if streak_time<=0: streak=0
 _move(player,d,true); _eat()
 for g in ghosts: _move(g,d,false)
 _collisions()
 if magnet_time>0: _magnet()
 if mode=="chaos":
  chaos_time-=d
  if chaos_time<=0:
   chaos_time=rng.randf_range(7,13)
   if rng.randf()<.5: _spawn_power()
   else:
    for i in range(2): _spawn_fruit()

func _move(a,d,is_player):
 var center=Vector2(floor(a.pos.x)+.5,floor(a.pos.y)+.5)
 if a.pos.distance_to(center)<a.speed*d+.04:
  a.pos=center
  var t=Vector2i(floor(a.pos.x),floor(a.pos.y))
  if is_player:
   if a.queued!=Vector2.ZERO and _can(t,a.queued): a.dir=a.queued
   if not _can(t,a.dir): a.dir=Vector2.ZERO
  else: a.dir=_ghost_dir(a)
 var mult=1.55 if is_player and speed_time>0 else 1.0
 a.pos+=a.dir*a.speed*mult*d; a.mouth+=d*10.0

func _can(t,d): return not _wall(t.x+int(d.x),t.y+int(d.y))
func _wall(x,y):
 if y<0 or y>=rows: return true
 if x<0 or x>=cols: return false
 return grid[y][x]=="#"

func _ghost_dir(g):
 var t=Vector2i(floor(g.pos.x),floor(g.pos.y)); var opts=[]
 for d in DIRS:
  if _can(t,d): opts.append(d)
 if opts.size()>1: opts.erase(-g.dir)
 if opts.is_empty(): return -g.dir
 if power_time>0:
  opts.sort_custom(func(a,b): return (Vector2(t)+a-player.pos).length()>(Vector2(t)+b-player.pos).length())
  return opts[0]
 var target=player.pos
 if g.type=="ambusher": target=player.pos+player.dir*4.0
 elif g.type=="drifter" and rng.randf()<.45: return opts[rng.randi_range(0,opts.size()-1)]
 elif g.type=="guard" and player.pos.distance_to(g.pos)>5: target=Vector2(cols*.5,rows*.5)
 opts.sort_custom(func(a,b): return (Vector2(t)+a-target).length_squared()<(Vector2(t)+b-target).length_squared())
 return opts[0]

func _eat():
 var x=int(floor(player.pos.x)); var y=int(floor(player.pos.y))
 if x<0 or x>=cols or y<0 or y>=rows: return
 var c=grid[y][x]
 if c not in [".","o"]: return
 grid[y][x]=" "; pellets-=1; streak+=1; streak_time=2.2
 _add(50 if c=="o" else 10,player.pos)
 if c=="o": power_time=max(4.8,8.5-level*.3); ghost_combo=0; Input.vibrate_handheld(18)
 if streak==10: _add(100,player.pos,"10 STREAK")
 elif streak==25: _add(300,player.pos,"25 STREAK")
 if rng.randf()<(0.04 if mode=="chaos" else 0.018) and inventory=="": _spawn_power()
 if rng.randf()<.012: _spawn_fruit()
 if pellets<=0:
  level+=1; _add(500+level*100,player.pos,"LEVEL CLEAR"); _load_level(level-1); countdown=2.2

func _spawn_power():
 var p=_open_tile(); if p.x<0:return
 powerups.append({"pos":Vector2(p.x+.5,p.y+.5),"type":["speed","shield","magnet","dash","bomb"][rng.randi_range(0,4)],"life":12.0})
func _spawn_fruit():
 var p=_open_tile(); if p.x<0:return
 fruit.append({"pos":Vector2(p.x+.5,p.y+.5),"life":10.0,"points":[250,400,650,1000][rng.randi_range(0,3)]})
func _open_tile():
 for i in range(70):
  var x=rng.randi_range(1,cols-2); var y=rng.randi_range(1,rows-2)
  if grid[y][x]!="#" and Vector2(x+.5,y+.5).distance_to(player.pos)>4: return Vector2i(x,y)
 return Vector2i(-1,-1)

func _collisions():
 for g in ghosts:
  if g.pos.distance_to(player.pos)<.58:
   if power_time>0:
    ghost_combo+=1; var pts=[200,400,800,1600][min(ghost_combo-1,3)]; _add(pts,g.pos,"+"+str(pts)); g.pos=g.home; Input.vibrate_handheld(16)
   elif shield:
    shield=false; g.pos=g.home; Input.vibrate_handheld(25)
   else:
    lives-=1; Input.vibrate_handheld(60)
    if lives<=0: _finish(); return
    _load_level(level-1); countdown=1.5; return

func _magnet():
 for y in range(rows):
  for x in range(cols):
   if grid[y][x]=="." and Vector2(x+.5,y+.5).distance_to(player.pos)<2.2:
    grid[y][x]=" "; pellets-=1; _add(10,Vector2(x+.5,y+.5))

func _use_power():
 if state!="play" or paused or inventory=="": return
 if inventory=="speed": speed_time=5.0
 elif inventory=="shield": shield=true
 elif inventory=="magnet": magnet_time=5.0
 elif inventory=="dash":
  for i in range(4):
   var t=Vector2i(floor(player.pos.x),floor(player.pos.y))
   if not _can(t,player.dir): break
   player.pos+=player.dir
 elif inventory=="bomb":
  for g in ghosts:
   if g.pos.distance_to(player.pos)<6: g.pos=g.home; _add(150,g.pos,"STUN")
 inventory=""; Input.vibrate_handheld(24)

func _collect():
 for i in range(fruit.size()-1,-1,-1):
  if player.pos.distance_to(fruit[i].pos)<.6: _add(fruit[i].points,fruit[i].pos,"BONUS"); fruit.remove_at(i)
 for i in range(powerups.size()-1,-1,-1):
  if player.pos.distance_to(powerups[i].pos)<.6: inventory=powerups[i].type; popups.append({"pos":powerups[i].pos,"text":inventory.to_upper(),"life":1.0,"off":0.0}); powerups.remove_at(i)

func _set_dir(d):
 if not player.is_empty(): player.queued=d

func _add(n,pos,label=""):
 score+=n; highscore=max(highscore,score)
 if label!="": popups.append({"pos":pos,"text":label,"life":1.0,"off":0.0})

func _finish():
 state="end"; _save()

func _draw():
 var s=get_viewport_rect().size; draw_rect(Rect2(Vector2.ZERO,s),BG)
 for x in range(0,int(s.x),52): draw_line(Vector2(x,0),Vector2(x,s.y),Color(0.08,0.22,0.34,.22),1)
 for y in range(0,int(s.y),52): draw_line(Vector2(0,y),Vector2(s.x,y),Color(0.08,0.22,0.34,.22),1)
 _text("NEON MAZE MUNCHER",Vector2(34,48),28,WHITE)
 if state=="menu": _draw_menu(s); return
 _text("SCORE "+str(score),Vector2(s.x*.40,48),22,YELLOW); _text("LEVEL "+str(level),Vector2(s.x*.55,48),20,WHITE); _text("LIVES "+str(lives),Vector2(s.x*.67,48),20,RED); _text("HI "+str(highscore),Vector2(s.x*.82,48),20,YELLOW)
 if not grid.is_empty(): _draw_maze(); _draw_player(); for g in ghosts: _draw_ghost(g)
 _draw_pickups(); _draw_controls(s)
 for p in popups:
  _text(p.text,_screen(p.pos)+Vector2(-tile,p.off),max(12,int(tile*.36)),YELLOW)
 if countdown>0: _center(str(int(ceil(countdown))),s*.5,64,CYAN)
 if paused: draw_rect(Rect2(Vector2.ZERO,s),Color(0,0,0,.65)); _center("PAUZE",s*.5,54,WHITE)
 if state=="end": draw_rect(Rect2(Vector2.ZERO,s),Color(0,0,0,.72)); _center("GAME OVER",s*.5+Vector2(0,-50),54,PINK); _center("Tik om opnieuw te spelen",s*.5+Vector2(0,20),20,WHITE)

func _draw_menu(s):
 _center("GHOST GRID",Vector2(s.x*.5,s.y*.22),56,CYAN); _center("Native Godot Android Edition",Vector2(s.x*.5,s.y*.28),18,MUTED)
 var labels=["CLASSIC RUN","TIME ATTACK · 120 SEC","CHAOS MODE"]
 for i in range(3):
  var r=Rect2(Vector2(s.x*.5-260,s.y*.38+i*92),Vector2(520,72)); draw_rect(r,Color(CYAN if i==0 else YELLOW if i==1 else PINK,.28)); draw_rect(r,CYAN if i==0 else YELLOW if i==1 else PINK,false,2); _center(labels[i],r.position+Vector2(r.size.x*.5,45),20,WHITE)

func _draw_maze():
 for y in range(rows):
  for x in range(cols):
   var c=grid[y][x]; var r=Rect2(origin+Vector2(x,y)*tile,Vector2.ONE*tile)
   if c=="#": draw_rect(r.grow(-tile*.08),WALL); draw_rect(r.grow(-tile*.08),Color(CYAN,.65),false,max(1.5,tile*.05))
   elif c==".": draw_circle(r.get_center(),tile*.045,YELLOW)
   elif c=="o": draw_circle(r.get_center(),tile*.16,PINK)

func _draw_player():
 var c=_screen(player.pos); var r=tile*.38; var a=player.dir.angle(); var mouth=.22+abs(sin(player.mouth))*.2; var pts=PackedVector2Array([c])
 for i in range(31): var ang=a+mouth+(TAU-mouth*2)*i/30.0; pts.append(c+Vector2(cos(ang),sin(ang))*r)
 draw_colored_polygon(pts,YELLOW)
 if shield: draw_arc(c,r*1.35,0,TAU,32,CYAN,2.5)

func _draw_ghost(g):
 var c=_screen(g.pos); var r=tile*.35; var col=CYAN if power_time>0 else g.color
 draw_circle(c+Vector2(0,-r*.08),r,col); draw_rect(Rect2(c+Vector2(-r,-r*.05),Vector2(r*2,r*.8)),col)
 draw_circle(c+Vector2(-r*.34,-r*.18),r*.18,WHITE); draw_circle(c+Vector2(r*.34,-r*.18),r*.18,WHITE)

func _draw_pickups():
 _collect()
 for f in fruit: draw_circle(_screen(f.pos),tile*.2,GREEN)
 for p in powerups: draw_circle(_screen(p.pos),tile*.22,PURPLE); _center(p.type.substr(0,1).to_upper(),_screen(p.pos)+Vector2(0,4),max(10,int(tile*.25)),WHITE)

func _draw_controls(s):
 draw_circle(joy_center,joy_radius,Color(CYAN,.12)); draw_arc(joy_center,joy_radius,0,TAU,48,Color(CYAN,.55),3); draw_circle(joy_center+joy_knob,joy_radius*.3,CYAN); _center("BESTUREN",joy_center+Vector2(0,joy_radius*1.2),11,MUTED)
 var pc=PURPLE if inventory!="" else Color(.28,.3,.42,.8); draw_circle(power_center,power_radius,pc); _center("POWER",power_center+Vector2(0,-4),17,WHITE); _center(inventory.to_upper() if inventory!="" else "GEEN",power_center+Vector2(0,18),10,WHITE)

func _screen(p): return origin+p*tile
func _text(t,pos,sz,col): draw_string(font,pos,t,HORIZONTAL_ALIGNMENT_LEFT,-1,sz,col)
func _center(t,pos,sz,col): draw_string(font,pos-Vector2(300,0),t,HORIZONTAL_ALIGNMENT_CENTER,600,sz,col)
func _load_save():
 if FileAccess.file_exists("user://score.save"):
  var f=FileAccess.open("user://score.save",FileAccess.READ); highscore=int(f.get_as_text())
func _save():
 var f=FileAccess.open("user://score.save",FileAccess.WRITE); f.store_string(str(highscore))
func _exit_tree(): _save()
