﻿const { Console } = require("console-mpds");
const console = new Console();
// --------------------------------------------/
/// Autor: Manuel Rosendo Castro Iglesias.
/// Autora: María Paz López.
/// ### 3-date/2-previus
/// Existe un error en los cálculos.

// Se consideran todos los meses de 30 días.

const day   = +console.readNumber('Escriba el dia ( 1-30): ');
const month = +console.readNumber('Escriba el mes ( 1-12): ');
const year  = +console.readNumber('Escriba el año (01-99): ');

const daySmallValue   = day - 1   >=  1 ;   // true, esto evita el año 0
const monthSmallValue = month - 1 >=  1 ;   // true, esto evita el año 0
const yearSmallValue  = year-1    >=  1 ;   // true, esto evita el año 0
const dayLargeValue   = day       <= 30 ;   // true 
const monthLargeValue = month     <= 12 ;   // true
const yearLargeValue  = year      <= 99 ;   // true

/* sirve como prueba */
let dateValid = 
	!(
		daySmallValue ===
		monthSmallValue ===
		yearSmallValue ===
		dayLargeValue ===
		monthLargeValue ===
		yearLargeValue
	);

// ¡No sé como hacerlo sin Let! Me rindo.
let dayPreviusSmall   = day;    
let monthPreviusSmall = month;
let yearPreviusSmall  = year;  

!(month === day === year === 1) ?                 
	yearPreviusSmall = year-1:                    
	!(month === day === 1 ?                       
			dayPreviusSmall = month-1 :           
				(day === 1) ?					  
					monthPreviusSmall = day+29 :  
			dayPreviusSmall = day - 1);
if (dateValid === true) {
	console.writeln( `fecha ${ day }/${ month }/${ year } y la anterior es ${ dayPreviusSmall}/${monthPreviusSmall}/${yearPreviusSmall}.`);
}
else (console.writeln( `No puedo hacer ese Cálculo con la fecha ${day}/${month}/${year} ya que no es válida`));
