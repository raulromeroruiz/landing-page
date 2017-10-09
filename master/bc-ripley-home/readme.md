# BC-RH
BC Ripley Home

---
# Menú
El menú esta identificad con el id **#main-menu**

Número de elementos del menú
-----
Para indicar el número de elementos del menú agregar una de las siguientes clases:

Clase | Nro de elemtos | Ancho
--- | --- | ---
.menu4 | 4 | 25%
.menu5 | 5 | 20%
.menu6 | 6 | 16.66%
.menu7 | 7 | 14%
.menu8 | 8 | 12%
.menu9 | 9 | 11.11%
.menu10 | 10 | 10%
.menu11 | 11 | 9.09%
.menu12 | 12 | 8.33%
.menu13 | 13 | 7.69%

Ej.
Menú con 5 elementos
```
<ul class="menu menu5" id="main-menu">
	<li><a class="category active" href="#" data-seccion="Centros de entretenimiento" target="_top"><span class="text one">Centros de entretenimiento</span></a></li>
	<li><a class="category" href="#" data-seccion="Estantes" target="_top"><span class="text one">Estantes</span></a></li>
	<li><a class="category" href="#" data-seccion="Muebles bar" target="_top"><span class="text">Muebles<br> bar</span></a></li>
	<li><a class="category" href="#" data-seccion="Zapateras, veladores y cómodas" target="_top"><span class="text">Zapateras, veladores<br> y cómodas</span></a></li>
	<li><a class="category" href="#" data-seccion="Muebles de cocina y baño" target="_top"><span class="text one">Muebles de<br> cocina y baño</span></a></li>
</ul>
```
Menú con 6 elementos
```
<ul class="menu menu7" id="main-menu">
	<li><a class="category active" href="#" data-seccion="Centros de entretenimiento" target="_top"><span class="text one">Centros de entretenimiento</span></a></li>
	<li><a class="category" href="#" data-seccion="Estantes" target="_top"><span class="text one">Estantes</span></a></li>
	<li><a class="category" href="#" data-seccion="Muebles bar" target="_top"><span class="text">Muebles<br> bar</span></a></li>
	<li><a class="category" href="#" data-seccion="Zapateras, veladores y cómodas" target="_top"><span class="text">Zapateras, veladores<br> y cómodas</span></a></li>
	<li><a class="category" href="#" data-seccion="Muebles de cocina y baño" target="_top"><span class="text one">Muebles de<br> cocina y baño</span></a></li>
	<li><a class="category" href="#" data-seccion="Ofertas destacadas" target="_top"><span class="text one">Ofertas<br> destacadas</span></a></li>
	<li><a class="category" href="#" data-seccion="Ofertas destacadas" target="_top"><span class="text one">Ofertas<br> destacadas</span></a></li>
</ul>
```


Color de fondo, textos y bordes del menú
-----

Se aplica sobre el elemento nav con clase **.nav**
Para indicar el color de fondo, texto y bordes; agregar una de las siguientes etiquetas:

Clase | Fondo | Texto | Bordes
--- | --- | --- | ---
.menu-black | Negro | Blanco | Blanco
.menu-white | Blanco | Negro | Negro

Ej.
Fondo Negro
```
<nav class="nav menu-black collapse-movil">
	<div class="current-category">Nombre campaña</div>
	<button id="btn-mobile"><span></span><span></span><span></span></button>
	<ul class="menu menu8" id="main-menu">
		<li>...</li>
		<li>...</li>
	</ul>
</nav>
```

Fondo Blanco
```
<nav class="nav menu-white collapse-movil">
	<div class="current-category">Nombre campaña</div>
	<button id="btn-mobile"><span></span><span></span><span></span></button>
	<ul class="menu menu8" id="main-menu">
		<li>...</li>
		<li>...</li>
	</ul>
</nav>
```


Nombre de la campaña
-----

Indicar el nombre de la campaña en el elemento con clase "**.current-category**"
```
<nav class="nav menu-black collapse-movil">
	<div class="current-category">[Nombre campaña]</div>
	<button id="btn-mobile"><span></span><span></span><span></span></button>
</nav>
```