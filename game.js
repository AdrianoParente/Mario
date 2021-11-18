kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 1, 0.5],
})

const MOVE_SPEED = 120
const JUMP_FORCE = 360
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const FALL_DEATH = 400
const ENEMY_SPEED = 20
let isJumping = true

loadSprite('mario', 'assets/img/mario-stand.gif');
loadSprite('floor', 'assets/img/floor.gif');
loadSprite('ice-cup', 'assets/img/ice-cup.png');
loadSprite('tubeTop', 'assets/img/tubeTop.gif');
loadSprite('book', 'assets/img/book.png');
loadSprite('questionmark', 'assets/img/questionmark.gif');
loadSprite('unboxed', 'assets/img/unboxed.gif');
loadSprite('evil-shroom', 'assets/img/evil-shroom.gif')
loadSprite('shop', 'assets/img/shop.png');
loadSprite('uni', 'assets/img/uni.png');
loadSprite('hat', 'assets/img/hat.png');
loadSprite('sign', 'assets/img/sign.png');
loadSprite('dev-aca', 'assets/img/dev-aca.png');
loadSprite('bg3', 'assets/img/bg3.png');
loadSprite('end-sign', 'assets/img/end_sign.png');
loadSprite('diplom', 'assets/img/diplom.png');
loadSprite('html-tag', 'assets/img/html-tag.png');
loadSprite('javascript', 'assets/img/java script.png');
loadSprite('html', 'assets/img/html.png');
loadSprite('angular', 'assets/img/angular.png');
loadSprite('scrum', 'assets/img/scrum.png');
loadSprite('git', 'assets/img/git.png');
loadSprite('api', 'assets/img/api.png');
loadSprite('desktop', 'assets/img/desktop.png');

scene("game", () => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const map = [

    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                     =',
    '                                                                                                     =',
    '                                                                                                     =',
    '                                                                                                     =',
    '                                                                                                     =',
    '                                                      %%  $                                          =',
    '                                                                                                     =',
    '                                              * $                                                    =',
    '=                                                                                                ?   =',
    '=                                      $  $            ====                                          =',
    '=                                                                                                    =',
    '=                      $                       ==                                                    =',
    '=                                 %   =*=%=                                    $                     =',
    '=                                                                                                 == =',
    '=                                                                                                =====',
    '=                                                  ^   ^                                        ======',
    '======================================================================================================',

  ]

  const levelCfg = {
    width: 16,
    height: 16,
    '=': [sprite('floor'), solid()],
    '$': [sprite('book'), scale(0.04), 'book'],
    '%': [sprite('questionmark'), solid(), 'book-questionmark'],
    '*': [sprite('questionmark'), solid(), 'ice-cup-questionmark'],
    '}': [sprite('unboxed'), solid()],
    '+': [sprite('tubeTop'), solid(), 'pipe'],
    '^': [sprite('evil-shroom'), solid(), 'dangerous'],
    '#': [sprite('ice-cup'), solid(), scale(0.05), 'ice-cup', body()],
    '?': [sprite('hat'), scale(0.05), 'hat']
  }

  const gameLevel = addLevel(map, levelCfg);

  function big() {
    let timer = 0
    let isBig = false
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
          timer -= dt()
          if (timer <= 0) {
            this.smallify()
          }
        }
      },
      isBig() {
        return isBig
      },
      smallify() {
        this.scale = vec2(1)
        CURRENT_JUMP_FORCE = JUMP_FORCE
        timer = 0
        isBig = false
      },
      biggify(time) {
        this.scale = vec2(2)
        timer = time
        isBig = true
      }
    }
  }

  const player = add([
    sprite('mario'), solid(),
    pos(30, 120),
    body(),
    big(),
    origin('bot')
  ])

  const backgroundShop = add([
    sprite('shop'), scale(0.2),
    pos(15, 180),
    layer('bg')
  ])

  const backgroundUni = add([
    sprite('uni'), scale(0.6),
    pos(955, 105),
    layer('bg')
  ])

  action('ice-cup', (m) => {
    m.move(20, 0)
  })

  player.on("headbump", (obj) => {
    if (obj.is('book-questionmark')) {
      gameLevel.spawn('$', obj.gridPos.sub(0, 2))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0, 0))
    }
    if (obj.is('ice-cup-questionmark')) {
      gameLevel.spawn('#', obj.gridPos.sub(0, 1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0, 0))
    }
  })

  player.collides('ice-cup', (m) => {
    destroy(m)
    player.biggify(6)
  })

  player.collides('book', (c) => {
    destroy(c);
  })

  action('dangerous', (d) => {
    d.move(-ENEMY_SPEED, 0)
  })

  player.collides('dangerous', (d) => {
    if (isJumping) {
      destroy(d)
    }
  })

  player.collides('hat', (h) => {
    destroy(h);
    go('second-step');
  })



  player.action(() => {
    camPos(player.pos.x + width() / 2 - 100, 170);
    if (player.pos.y >= FALL_DEATH) {
      go('lose')
    }
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  player.action(() => {
    if (player.grounded()) {
      isJumping = false
    }
  })

  keyPress('space', () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })
})


// second level
scene("second-step", () => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const map = [

    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '                                                                                                      ',
    '=                                                                                   <                =',
    '=                                                                                                    =',
    '=                            > > > > > >                                                             =',
    '=                                               >                                                    =',
    '=                                                                                 s                  =',
    '=                                               >                              g                     =',
    '=                                                                         a                          =',
    '=                            ===========        >                                                    =',
    '=                                                                     n                              =',
    '=                                               >                  j                                 =',
    '=                                                               h                                    =',
    '======================================================================================================',
  ]


  const levelCfg = {
    width: 16,
    height: 16,
    '=': [sprite('floor'), solid()],
    '%': [sprite('questionmark'), solid(), 'coin-questionmark'],
    '<': [sprite('diplom'), scale(0.1), 'diplom'],
    '>': [sprite('html-tag'), scale(0.03), 'html-tag'],
    'h': [sprite('html'), scale(0.28), solid(), 'html'],
    'j': [sprite('javascript'), scale(0.28), solid(), 'javascript'],
    'n': [sprite('angular'), scale(0.3), solid(), 'angular'],
    'a': [sprite('api'), scale(0.28), solid(), 'api'],
    's': [sprite('scrum'), scale(0.28), solid(), 'scrum'],
    'g': [sprite('git'), scale(0.28), solid(), 'git'],
  }

  const gameLevel = addLevel(map, levelCfg);

  const player = add([
    sprite('mario'), solid(),
    pos(30, 0),
    body(),
    origin('bot')
  ])

  const backgroundShop = add([
    sprite('sign'), scale(0.2),
    pos(150, 195),
    layer('bg')
  ])

  const backgroundUni = add([
    sprite('dev-aca'), scale(0.5),
    pos(1250, 45),
    layer('bg')
  ])

  player.collides('html-tag', (c) => {
    destroy(c);
  })


  player.collides('diplom', (h) => {
    destroy(h);
    go('third-step')
  })

  player.action(() => {
    camPos(player.pos.x + width() / 2 - 100, 170);
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  player.action(() => {
    if (player.grounded()) {
      isJumping = false
    }
  })

  keyPress('space', () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })
})


//third level
scene("third-step", () => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const map =
    [

      '                                                                                                      ',
      '                                                                                                      ',
      '                                                                                                      ',
      '                                                                                                      ',
      '                                                                                                      ',
      '                                                                                                      ',
      '                                                                                                      ',
      '                                                                                                      ',
      '                                                                                                      ',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '=                                                                                           d        =',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '=                                                                                                    =',
      '======================================================================================================',
    ]


  const levelCfg = {
    width: 16,
    height: 16,
    '=': [sprite('floor'), solid()],
    'd': [sprite('desktop'), scale(0.1), 'desktop'],
  }

  const gameLevel = addLevel(map, levelCfg);

  const player = add([
    sprite('mario'), solid(),
    pos(30, 0),
    body(),
    origin('bot')
  ])

  const backgroundShop = add([
    sprite('bg3'), scale(1),
    pos(0, 0),
    layer('bg')
  ])

  const backgroundUni = add([
    sprite('end-sign'), scale(0.4),
    pos(1350, 80),
    layer('bg')
  ])


  player.collides('desktop', (h) => {
    destroy(h);
    go('finish');
  })

  player.action(() => {
    camPos(player.pos.x + width() / 2 - 100, 170);
  })

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  player.action(() => {
    if (player.grounded()) {
      isJumping = false
    }
  })

  keyPress('space', () => {
    if (player.grounded()) {
      isJumping = true
      player.jump(CURRENT_JUMP_FORCE)
    }
  })
})

scene('finish', () => {
  add([text('Congratulation! You won', 22), origin('center'), pos(width() / 2, height() / 2)])
})

start("game")