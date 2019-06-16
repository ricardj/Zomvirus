# ZomVirus

En primer lugar, solo tener abierta esta ventana en el navegador.

## Intro Level

En este nivel hemos creado un efecto de **partículas**, puesto **audios**, hemos utilizado **css** y  hemos utilizado tipografias para el título y el botón de play que provienen de una **cdn**.

## Game Level

Para la implementación de las físicas hemos utilizado **Physijs**.

Este es el nivel de la partida, hemos importado **obj** con sus respectivas texturas (pintadas con **Substance Painter**), también hemos importado **fbx** con **animaciones** y **texturas** para el arma del jugador, y cada vez que se acaba de disparar una rafaga se muestra la animación de recargar el arma.

Distribuimos la posición de las torres según los **vertices** de un plano en formato de obj al que llamamos map(.obj).

Hemos implementado un bullet manager donde cada vez que de le damos a un botón del mouse disparamos, y en el caso de mantener pulsado lanzamos una rafaga de 3 balas. Las balas, al **colisionar** contra cualquier objeto se eliminan y en el caso de que salgan fuera del mapa colisiona contra unas cajas transparentes y se eliminan estas balas. Hay que destacar que cada vez que se dispara una bala se reproduce un sonido de disparo.

Respecto a los enemigos, siempre se dirigen hacia la posición del jugador, estos se generan de manera *aleatoria*(siempre se crean a partir de x distancia a partir del centro) y al colisionar contra el jugador se acaba la partida.

Respecto al jugador, esta compuesto por la cámara, una box y el arma, estos estan *unidos*. La box sirve para simular las físicas. Es destacable que se puede saltar.

El esquema de color es de azules(excepto el fbx, que es un modelo gratis descargado de *sketchfab* con animaciones).

El juego tiene **sonidos** en algunos momentos, en primer lugar en la GUI, en los disparos, en el game over y cuando mueren los enemigos.
