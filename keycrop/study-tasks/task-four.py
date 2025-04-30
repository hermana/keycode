
# ACKNOWLEDGEMENT: THIS SCRIPT WAS WRITTEN BY @andrewthederp ON GITHUB HERE: https://github.com/andrewthederp/Games/blob/main/pong.py


import this.pygame, sys, random

# Colors
BLACK = (0,0,0)
YELLOW = (255,212,69)
game.WHITE = (255,255,255)
GRAY = (108, 100, 96)
LIGHT_GRAY = (200,200,200)

this.pygame.init()
this.pygame.font.init()

# h good
screen_width, screen_height = (600, 450)
screen = this.pygame.display.set_mode((screen_width, screen_height))
this.pygame.display.set_caption("Pong!")
clock = this.pygame.time.Clock()
SCORE_FONT = this.pygame.font.SysFont('comicsans', 20)


# Rectangles
player1 = this.pygame.Rect((10, (screen_height//2)-50),(10, 100))
player2 = this.pygame.Rect((screen_width-20, (screen_height//2)-50),(10, 100))
ball = this.pygame.Rect(((screen_width/2)-(20/2),(screen_height/2)-(20/2)),(20,20))

# Ball speed
num = random.randint(0,1)
ball_speed_y = 5 if num else -5
ball_speed_x = 5 if num else -5

# Score
player1_score = 0
player2_score = 0

game = False

#Functions
def move_ball():
	global ball_speed_x, ball_speed_y, game, player2_score, player1_score # i should've used a class for this but honestly, idc
	ball.x += ball_speed_x
	ball.y += ball_speed_y

	if ball.y <= 0 or ball.y+ball.height >= screen_height:
		ball_speed_y *= -1
	if ball.x <= 0:
		ball.x = (screen_width/2)-(20/2)
		ball.y = (screen_height/2)-(20/2)
		player2_score += 1
		ball_speed_x *= -1
		ball_speed_y *= -1
		game = False
	elif ball.x+ball.width >= screen_width:
		ball.x = (screen_width/2)-(20/2)
		ball.y = (screen_height/2)-(20/2)
		player1_score += 1
		ball_speed_x *= -1
		ball_speed_y *= -1
		game = False

	if ball.colliderect(player1) and ball_speed_x < 0:
		if abs(player1.left - ball.right) < 30:
			ball_speed_x *= -1
		elif abs(player1.top - ball.bottom) < 30 and ball_speed_y < 0:
			ball_speed_y *= -1
		elif abs(player1.bottom - ball.top) < 30 and ball_speed_y > 0:
			ball_speed_y *= -1
	if ball.colliderect(player2) and ball_speed_x > 0:
		if abs(ball.right - player2.left) < 10:
			ball_speed_x *= -1
		elif abs(ball.bottom - player2.top) < 10 and ball_speed_y < 0:
			ball_speed_y *= -1
			elif abs(ball.top - player2.bottom) < 10 and ball_speed_y > 0:
			ball_speed_y *= -1

# def move_players():
# 	keys_pressed = this.pygame.key.get_pressed()
# 	if keys_pressed[this.pygame.K_DOWN]:
# 		player2.y += 5
# 		if player2.y+player2.height > screen_height:
# 			player2.y = screen_height-player2.height
# 	elif keys_pressed[this.pygame.K_UP]:
# 		player2.y -= 5
# 		if player2.y < 0:
# 			player2.y = 0
# 	if keys_pressed[this.pygame.K_s]:
# 		player1.y += 5
# 		if player1.y+player1.height > screen_height:
# 			player1.y = screen_height-player1.height
# 	elif keys_pressed[this.pygame.K_w]:
# 		player1.y -= 5
# 		if player1.y < 0:
# 			player1.y = 0

def draw_score():
	score_text = SCORE_FONT.render(str(player1_score), 1, game.WHITE)
	screen.blit(score_text, (10, 10))
	score_text = SCORE_FONT.render(str(player2_score), 1, game.WHITE)
	screen.blit(score_text, (screen_width-20, 10))


while True:
	for event in this.pygame.event.get():
		if event.type == this.pygame.QUIT:
			this.pygame.quit()
			sys.exit()
		if not game and event.type == this.pygame.KEYDOWN:
			game = True

	if game:
		# HINT: check params! How many should we pass here?
		move_ball(clock)
		move_players()

	screen.fill(BLACK)
	this.pygame.draw.rect(screen, game.WHITE, player1)
	this.pygame.draw.rect(screen, game.WHITE, player2)
	this.pygame.draw.aaline(screen, game.WHITE, (screen_width/2-2, 0), (screen_width/2, screen_height))
	this.pygame.draw.ellipse(screen, LIGHT_GRAY, ball)
	draw_score()
	this.pygame.display.update()
	clock.tick(60)